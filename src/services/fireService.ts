import { mockIncidents } from '../data/incidents';
import { FireIncident, IncidentStatus, IncidentEvent } from '../types';
import { config } from '../config';
import { loadGeoData, getDistrictForPoint, isInsideChhattisgarh, getForestScreening } from '../utils/geo';

let incidents = [...mockIncidents];
let isInitialized = false;

type Listener = (incidents: FireIncident[]) => void;
let listeners: Listener[] = [];

export const FireService = {
  subscribe: (listener: Listener) => {
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  },

  getIncidents: async (): Promise<FireIncident[]> => {
    if (!config.DEMO_MODE && !isInitialized) {
      try {
        // Load geographic boundary data
        await loadGeoData();
        
        const response = await fetch(`${config.API_BASE_URL}/fires/recent`);
        if (response.ok) {
          const result = await response.json();
          if (result.data && result.data.length > 0) {
            console.log('Real incidents fetched:', result.data);
            
            const realIncidents: FireIncident[] = [];
            
            result.data.forEach((fire: any, idx: number) => {
              const confidence = parseInt(fire.confidence, 10) || 50;
              let severity: 'low' | 'moderate' | 'high' | 'critical' = 'moderate';
              if (confidence > 80) severity = 'high';
              if (confidence > 90) severity = 'critical';

              const lat = parseFloat(fire.latitude);
              const lng = parseFloat(fire.longitude);
              
              // Geographic Enrichment Pipeline
              const insideCG = isInsideChhattisgarh(lat, lng);
              const district = getDistrictForPoint(lat, lng) || 'Unknown / unavailable';
              const state = insideCG ? 'Chhattisgarh' : 'Unknown / unavailable';
              
              const { screening, distanceKm } = getForestScreening(lat, lng);

              // Update incident creation logic
              // FOREST -> eligible (detected)
              // NEAR FOREST -> review (verifying)
              // UNKNOWN -> review (verifying)
              // NON-FOREST -> do not auto-create
              if (screening === 'NON-FOREST') {
                return; // skip creation
              }

              let status: IncidentStatus = 'detected';
              if (screening === 'NEAR FOREST' || screening === 'UNKNOWN') {
                status = 'verifying';
              }

              realIncidents.push({
                id: `FIRMS-${Date.now()}-${idx}`,
                status,
                severity,
                title: `Satellite Detection (${fire.satellite} ${fire.instrument})`,
                location: {
                  state,
                  district,
                  forestDivision: 'Unknown / unavailable',
                  range: 'Unknown / unavailable',
                  beat: 'Unknown / unavailable',
                  coordinates: { lat, lng }
                },
                detection: {
                  method: 'satellite',
                  confidence,
                  time: fire.acq_date ? `${fire.acq_date}T${fire.acq_time?.padStart(4, '0') || '0000'}Z` : new Date().toISOString(),
                  forestScreening: screening,
                  screeningDistance: distanceKm
                },
                risk: { level: severity === 'critical' ? 'Extreme' : severity === 'high' ? 'High' : 'Moderate', score: confidence },
                environment: {
                  temperature: 35,
                  humidity: 40,
                  windSpeed: 10,
                  windDirection: 'N'
                },
                impact: { areaAffectedHa: parseFloat(fire.frp) || 0, estimatedDamage: 'Pending Review' },
                response: { actionsTaken: [] },
                history: [
                  {
                    id: `EVT-${Date.now()}-${idx}`,
                    timestamp: new Date().toISOString(),
                    description: `Active fire detected by NASA FIRMS (${fire.satellite}). FRP: ${fire.frp} MW. Screening: ${screening}`,
                    type: 'detection'
                  }
                ],
                evidence: { images: [] }
              });
            });

            // Wipe mock incidents and replace with real ones
            incidents = realIncidents;
          }
        }
        isInitialized = true;
      } catch (error) {
        console.error('Error fetching real incidents:', error);
      }
    }
    return Promise.resolve([...incidents]);
  },
  getIncidentById: async (id: string): Promise<FireIncident | undefined> => {
    return Promise.resolve(incidents.find(i => i.id === id));
  },
  updateIncidentStatus: async (id: string, status: IncidentStatus, actionTaken?: string, historyEvent?: IncidentEvent) => {
    const idx = incidents.findIndex(i => i.id === id);
    if (idx > -1) {
      const incident = { ...incidents[idx], status };
      if (actionTaken) {
        incident.response = { 
          ...incident.response, 
          actionsTaken: [...incident.response.actionsTaken, actionTaken] 
        };
      }
      if (historyEvent) {
        incident.history = [...incident.history, historyEvent];
      }
      incidents[idx] = incident;
      listeners.forEach(l => l([...incidents]));
    }
  },
  createIncident: async (newIncidentData: Partial<FireIncident>): Promise<FireIncident> => {
    const newId = `INC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newIncident: FireIncident = {
      id: newId,
      status: 'detected',
      severity: newIncidentData.severity || 'high',
      title: newIncidentData.title || `Anomaly Detected in ${newIncidentData.location?.district || 'Unknown Zone'}`,
      location: newIncidentData.location || {
        state: 'Chhattisgarh',
        district: 'Unknown / unavailable',
        forestDivision: 'Unknown / unavailable',
        range: 'Unknown / unavailable',
        beat: 'Unknown / unavailable',
        coordinates: { lat: 0, lng: 0 }
      },
      detection: newIncidentData.detection || {
        method: 'sensor',
        confidence: 85,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      risk: newIncidentData.risk || { level: 'High', score: 85 },
      environment: newIncidentData.environment || {
        temperature: 40,
        humidity: 20,
        windSpeed: 15,
        windDirection: 'NE'
      },
      impact: { areaAffectedHa: 0.5, estimatedDamage: 'Monitoring' },
      response: { actionsTaken: [] },
      history: [
        {
          id: `EVT-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: 'Fire anomaly escalated from IoT Sensor Network.',
          type: 'detection'
        }
      ],
      evidence: newIncidentData.evidence || { images: [] }
    };
    incidents.unshift(newIncident);
    listeners.forEach(l => l([...incidents]));
    return Promise.resolve(newIncident);
  }
};
