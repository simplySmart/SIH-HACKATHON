import * as turf from '@turf/turf';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache: Record<string, CacheEntry<any>> = {};
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const getGisContext = async (lat: number, lng: number) => {
  // Round to 3 decimal places to create a pseudo-grid cache (~110m resolution)
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data;
  }

  // Overpass QL to get roads, water, and settlements within radii
  // 5000m for roads and water, 10000m for settlements
  const query = `
    [out:json][timeout:15];
    (
      way["highway"~"primary|secondary|tertiary|residential|unclassified"](around:5000, ${lat}, ${lng});
      way["natural"="water"](around:5000, ${lat}, ${lng});
      way["waterway"](around:5000, ${lat}, ${lng});
      node["place"~"city|town|village|hamlet"](around:10000, ${lat}, ${lng});
    );
    out geom;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'User-Agent': 'VanRakshak App (Research)',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error(`Overpass API Error: ${response.status}`);
    }

    const data = await response.json();
    
    let nearestRoad = null;
    let nearestWater = null;
    let nearestSettlement = null;
    
    let minRoadDist = Infinity;
    let minWaterDist = Infinity;
    let minSettlementDist = Infinity;

    const point = turf.point([lng, lat]);

    for (const element of data.elements) {
      if (element.type === 'node' && element.tags?.place) {
        const pt = turf.point([element.lon, element.lat]);
        const dist = turf.distance(point, pt, { units: 'kilometers' });
        if (dist < minSettlementDist) {
          minSettlementDist = dist;
          nearestSettlement = {
            name: element.tags.name || 'Unnamed Settlement',
            type: element.tags.place,
            distance: dist.toFixed(1),
            coordinates: [element.lat, element.lon]
          };
        }
      } 
      else if (element.type === 'way' && element.geometry) {
        // Convert geometry to LineString for Turf
        const lineCoords = element.geometry.map((g: any) => [g.lon, g.lat]);
        if (lineCoords.length < 2) continue;
        
        let lineOrPoly;
        if (lineCoords[0][0] === lineCoords[lineCoords.length - 1][0] && lineCoords[0][1] === lineCoords[lineCoords.length - 1][1] && lineCoords.length >= 4) {
           lineOrPoly = turf.polygon([lineCoords]);
        } else {
           lineOrPoly = turf.lineString(lineCoords);
        }

        // Distance in km
        let dist = Infinity;
        if (lineOrPoly.geometry.type === 'Polygon') {
          const ptInside = turf.booleanPointInPolygon(point, lineOrPoly);
          if (ptInside) {
            dist = 0;
          } else {
            // Get distance to edge
            const line = turf.polygonToLine(lineOrPoly);
            if (line.type === 'Feature') {
              dist = turf.pointToLineDistance(point, line as any, { units: 'kilometers' });
            }
          }
        } else {
          dist = turf.pointToLineDistance(point, lineOrPoly as any, { units: 'kilometers' });
        }

        if (element.tags?.highway && dist < minRoadDist) {
          minRoadDist = dist;
          nearestRoad = {
            name: element.tags.name || element.tags.ref || 'Unnamed Road',
            type: element.tags.highway,
            distance: dist.toFixed(1),
            geometry: lineCoords.map((c: any) => [c[1], c[0]]) // leaflet format [lat, lng]
          };
        }
        else if ((element.tags?.natural === 'water' || element.tags?.waterway) && dist < minWaterDist) {
          minWaterDist = dist;
          nearestWater = {
            name: element.tags.name || 'Unnamed Water Body',
            type: element.tags.natural || element.tags.waterway,
            distance: dist.toFixed(1),
            geometry: lineCoords.map((c: any) => [c[1], c[0]])
          };
        }
      }
    }

    const result = {
      nearestRoad,
      nearestWater,
      nearestSettlement,
      source: 'OpenStreetMap',
      retrievedAt: new Date().toISOString()
    };

    cache[cacheKey] = { data: result, timestamp: now };
    return result;

  
  } catch (error: any) {
    console.error('GIS Service Error:', error);
    
    // Fallback to Nominatim for nearest settlement since Overpass timed out
    try {
      const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`, {
        headers: { 'User-Agent': 'VanRakshak App (Research)' },
        signal: AbortSignal.timeout(5000)
      });
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        const settlementName = nomData.address?.city || nomData.address?.town || nomData.address?.village || nomData.address?.county || 'Unknown Location';
        
        const pt1 = turf.point([lng, lat]);
        const pt2 = turf.point([parseFloat(nomData.lon), parseFloat(nomData.lat)]);
        const dist = turf.distance(pt1, pt2, { units: 'kilometers' });
        
        const result = {
          nearestRoad: null,
          nearestWater: null,
          nearestSettlement: {
            name: settlementName,
            type: nomData.addresstype || 'settlement',
            distance: dist.toFixed(1),
            coordinates: [parseFloat(nomData.lat), parseFloat(nomData.lon)]
          },
          source: 'OpenStreetMap (Nominatim)',
          retrievedAt: new Date().toISOString()
        };
        cache[cacheKey] = { data: result, timestamp: now };
        return result;
      }
    } catch (nomErr) {
      console.error('Nominatim Fallback Error:', nomErr);
    }

    return { nearestRoad: null, nearestWater: null, nearestSettlement: null, source: 'OpenStreetMap', error: 'Network Error' };
  }

};
