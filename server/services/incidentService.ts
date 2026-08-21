import fs from 'fs';
import path from 'path';
import * as turf from '@turf/turf';
import { getFires } from './firmsService';
import { getWeather } from './weatherService';

// Define the FireIncident type for the backend
export interface FireIncident {
  id: string;
  status: 'detected' | 'verifying' | 'confirmed' | 'responding' | 'contained' | 'extinguished' | 'rejected';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  location: {
    state: string;
    district: string;
    forestDivision: string;
    range: string;
    beat: string;
    coordinates: { lat: number; lng: number };
  };
  firstDetectedAt: string;
  lastDetectedAt: string;
  detectionCount: number;
  satelliteSources: string[];
  latestConfidence: number;
  maximumFRP: number;
  detection: {
    method: 'satellite' | 'sensor' | 'manual' | 'combined';
    confidence: number;
    time: string;
    forestScreening?: 'FOREST' | 'NEAR FOREST' | 'NON-FOREST' | 'UNKNOWN';
    screeningDistance?: number;
  };
  risk: { level: string; score: number };
  environment: { temperature: number; humidity: number; windSpeed: number; windDirection: string };
  impact: { areaAffectedHa: number; estimatedDamage?: string };
  response: { actionsTaken: string[] };
  history: any[];
  evidence: { images: string[]; sources?: any };
  satelliteDetections: any[];
}

let backendIncidents: FireIncident[] = [];
let geoDataLoaded = false;
let cgDistricts: any = null;
let cgForests: any = null;

const CLUSTER_DISTANCE_KM = 2.5; // 2.5 km
const CLUSTER_TIME_HOURS = 24;

const loadGeoData = () => {
  if (geoDataLoaded) return;
  try {
    const distPath = path.join(process.cwd(), 'public', 'data', 'cg_districts.json');
    if (fs.existsSync(distPath)) {
      cgDistricts = JSON.parse(fs.readFileSync(distPath, 'utf8'));
    }
    const forestPath = path.join(process.cwd(), 'public', 'data', 'cg_forests.json');
    if (fs.existsSync(forestPath)) {
      cgForests = JSON.parse(fs.readFileSync(forestPath, 'utf8'));
      
      // Clean invalid rings if necessary
      if (cgForests.features) {
        cgForests.features.forEach((feature: any) => {
          const ensureClosed = (ring: any[]) => {
             if (ring.length > 0) {
                const first = ring[0];
                const last = ring[ring.length - 1];
                if (first[0] !== last[0] || first[1] !== last[1]) {
                   ring.push([...first]);
                }
             }
             return ring;
          };

          if (feature.geometry && feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates = feature.geometry.coordinates
               .filter((ring: any) => ring.length >= 3)
               .map(ensureClosed);
          } else if (feature.geometry && feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates = feature.geometry.coordinates.map((poly: any) => 
              poly.filter((ring: any) => ring.length >= 3).map(ensureClosed)
            ).filter((poly: any) => poly.length > 0);
          }
        });
      }
    }
    geoDataLoaded = true;
  } catch (err) {
    console.error("Backend failed to load geo JSON", err);
  }
};

const getDistrictForPoint = (lat: number, lng: number) => {
  if (!cgDistricts) return null;
  const pt = turf.point([lng, lat]);
  for (const feature of cgDistricts.features) {
    if (feature.geometry) {
      if (turf.booleanPointInPolygon(pt, feature)) {
        return feature.properties?.DISTRICT || feature.properties?.name || 'Unknown';
      }
    }
  }
  return null;
};

const getForestScreening = (lat: number, lng: number): { screening: 'FOREST' | 'NEAR FOREST' | 'NON-FOREST' | 'UNKNOWN', distanceKm?: number } => {
  if (!cgForests) return { screening: 'UNKNOWN' };
  const pt = turf.point([lng, lat]);
  
  let isInside = false;
  let minDistance = Infinity;

  for (const feature of cgForests.features) {
    if (!feature.geometry) continue;
    
    if (turf.booleanPointInPolygon(pt, feature)) {
      isInside = true;
      break;
    }
    
    try {
      const line = turf.polygonToLine(feature);
      if (line) {
        if (line.type === 'FeatureCollection') {
           for (const f of line.features) {
              const d = turf.pointToLineDistance(pt, f as any, { units: 'kilometers' });
              if (d < minDistance) minDistance = d;
           }
        } else {
           const d = turf.pointToLineDistance(pt, line as any, { units: 'kilometers' });
           if (d < minDistance) minDistance = d;
        }
      }
    } catch (e) { }
  }

  if (isInside) return { screening: 'FOREST', distanceKm: 0 };
  if (minDistance <= 2) return { screening: 'NEAR FOREST', distanceKm: minDistance };
  return { screening: 'NON-FOREST', distanceKm: minDistance === Infinity ? undefined : minDistance };
};

export const syncIncidents = async () => {
  loadGeoData();
  const res = await getFires();
  if (!res.data || res.data.length === 0) return backendIncidents;

  const newDetections = res.data;
  
  for (const det of newDetections) {
    const lat = parseFloat(det.latitude);
    const lng = parseFloat(det.longitude);
    
    const district = getDistrictForPoint(lat, lng);
    if (!district) continue; 
    
    const { screening, distanceKm } = getForestScreening(lat, lng);
    if (screening === 'NON-FOREST') continue; 

    const detTimeStr = det.acq_date ? `${det.acq_date}T${det.acq_time?.padStart(4, '0') || '0000'}Z` : new Date().toISOString();
    const detTime = new Date(detTimeStr).getTime();
    const frp = parseFloat(det.frp) || 0;
    const confidence = parseInt(det.confidence) || 50;
    const source = det.satellite || 'Unknown';
    
    let matchedIncident = null;
    for (const inc of backendIncidents) {
      const incLastTime = new Date(inc.lastDetectedAt).getTime();
      const timeDiffHours = Math.abs(detTime - incLastTime) / (1000 * 60 * 60);
      
      if (timeDiffHours <= CLUSTER_TIME_HOURS) {
         const pt1 = turf.point([lng, lat]);
         const pt2 = turf.point([inc.location.coordinates.lng, inc.location.coordinates.lat]);
         const dist = turf.distance(pt1, pt2, { units: 'kilometers' });
         
         if (dist <= CLUSTER_DISTANCE_KM) {
            matchedIncident = inc;
            break;
         }
      }
    }

    if (matchedIncident) {
      const isNewDtc = !matchedIncident.satelliteDetections.find((d: any) => 
         d.latitude === det.latitude && d.longitude === det.longitude && d.acq_date === det.acq_date && d.acq_time === det.acq_time
      );
      
      if (isNewDtc) {
        matchedIncident.satelliteDetections.push(det);
        matchedIncident.detectionCount += 1;
        
        if (detTime > new Date(matchedIncident.lastDetectedAt).getTime()) {
           matchedIncident.lastDetectedAt = new Date(detTime).toISOString();
           matchedIncident.latestConfidence = confidence;
        }
        if (detTime < new Date(matchedIncident.firstDetectedAt).getTime()) {
           matchedIncident.firstDetectedAt = new Date(detTime).toISOString();
        }
        
        if (frp > matchedIncident.maximumFRP) {
           matchedIncident.maximumFRP = frp;
           matchedIncident.impact.areaAffectedHa = matchedIncident.maximumFRP; 
        }
        
        if (!matchedIncident.satelliteSources.includes(source)) {
           matchedIncident.satelliteSources.push(source);
        }

        matchedIncident.severity = calculateSeverity(matchedIncident.latestConfidence, matchedIncident.maximumFRP, matchedIncident.detectionCount, screening);
        
        matchedIncident.history.push({
          id: `EVT-${Date.now()}-${Math.random()}`,
          timestamp: new Date().toISOString(),
          description: `Additional satellite detection (${source}). Cluster size now ${matchedIncident.detectionCount}.`,
          type: 'detection'
        });
      }
    } else {
      const severity = calculateSeverity(confidence, frp, 1, screening);
      let status: 'detected' | 'verifying' = 'detected';
      if (screening === 'NEAR FOREST' || screening === 'UNKNOWN') status = 'verifying';

      const newInc: FireIncident = {
        id: `FIRMS-CG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status,
        severity,
        title: `Fire Event in ${district}`,
        location: {
          state: 'Chhattisgarh',
          district,
          forestDivision: 'Unknown',
          range: 'Unknown',
          beat: 'Unknown',
          coordinates: { lat, lng }
        },
        firstDetectedAt: new Date(detTime).toISOString(),
        lastDetectedAt: new Date(detTime).toISOString(),
        detectionCount: 1,
        satelliteSources: [source],
        latestConfidence: confidence,
        maximumFRP: frp,
        detection: {
          method: 'satellite',
          confidence,
          time: new Date(detTime).toISOString(),
          forestScreening: screening,
          screeningDistance: distanceKm
        },
        risk: { level: severity === 'critical' ? 'Extreme' : 'High', score: confidence },
        environment: { temperature: 30, humidity: 40, windSpeed: 10, windDirection: 'N' },
        impact: { areaAffectedHa: frp },
        response: { actionsTaken: [] },
        history: [{
          id: `EVT-${Date.now()}-${Math.random()}`,
          timestamp: new Date().toISOString(),
          description: `Initial satellite detection by ${source}. FRP: ${frp} MW. Screening: ${screening}`,
          type: 'detection'
        }],
        evidence: { images: [] },
        satelliteDetections: [det]
      };
      
      backendIncidents.push(newInc);
      enrichIncidentWeather(newInc.id);
    }
  }

  backendIncidents.sort((a, b) => new Date(b.lastDetectedAt).getTime() - new Date(a.lastDetectedAt).getTime());
  return backendIncidents;
};

const calculateSeverity = (confidence: number, frp: number, clusterSize: number, screening: string): 'low' | 'moderate' | 'high' | 'critical' => {
  let score = 0;
  if (confidence > 80) score += 2;
  else if (confidence > 60) score += 1;

  if (frp > 50) score += 3;
  else if (frp > 20) score += 2;
  else if (frp > 10) score += 1;

  if (clusterSize > 5) score += 2;
  else if (clusterSize > 2) score += 1;

  if (screening === 'FOREST') score += 2;

  if (score >= 7) return 'critical';
  if (score >= 5) return 'high';
  if (score >= 3) return 'moderate';
  return 'low';
};

const enrichIncidentWeather = async (id: string) => {
  const inc = backendIncidents.find(i => i.id === id);
  if (!inc) return;
  try {
    const wx = await getWeather(inc.location.coordinates.lat, inc.location.coordinates.lng);
    if (wx.data) {
      inc.environment = {
        temperature: wx.data.temperature || 30,
        humidity: wx.data.humidity || 40,
        windSpeed: wx.data.windSpeed || 10,
        windDirection: wx.data.windDirection ? `${wx.data.windDirection}°` : 'N'
      };
      if (wx.data.vpd !== undefined && wx.data.vpd > 1.5) {
        inc.risk.level = 'Extreme';
        inc.risk.score = Math.min(100, inc.risk.score + 10);
      }
    }
  } catch(e) { }
};

export const getIncidentsStore = () => backendIncidents;

export const triggerSync = async () => {
  return await syncIncidents();
};
