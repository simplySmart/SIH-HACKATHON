import * as turf from '@turf/turf';

let districtsGeoJSON: any = null;
let forestsGeoJSON: any = null;

// Ensure we only fetch once
let fetchPromise: Promise<void> | null = null;
let fetchForestsPromise: Promise<void> | null = null;


function fixPolygonRings(geoJsonData) {
  if (!geoJsonData || !geoJsonData.features) return geoJsonData;
  geoJsonData.features.forEach(feature => {
    if (feature.geometry && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')) {
      const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
      polygons.forEach(polygon => {
        polygon.forEach(ring => {
          if (ring.length > 0) {
            const first = ring[0];
            const last = ring[ring.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
              ring.push([...first]);
            }
          }
        });
      });
    }
  });
  return geoJsonData;
}

export const loadGeoData = async () => {
  const promises = [];
  
  if (!districtsGeoJSON) {
    if (!fetchPromise) {
      fetchPromise = fetch(`/data/cg_districts.json`)
        .then(res => res.json())
        .then(data => {
          districtsGeoJSON = fixPolygonRings(data);
        })
        .catch(err => {
          console.error("Failed to load district geojson", err);
        });
    }
    promises.push(fetchPromise);
  }

  if (!forestsGeoJSON) {
    if (!fetchForestsPromise) {
      fetchForestsPromise = fetch(`/data/cg_forests.json`)
        .then(res => res.json())
        .then(data => {
          forestsGeoJSON = fixPolygonRings(data);
        })
        .catch(err => {
          console.error("Failed to load forest geojson", err);
        });
    }
    promises.push(fetchForestsPromise);
  }

  return Promise.all(promises);
};

export const getGeoJSON = () => districtsGeoJSON;
export const getForestsGeoJSON = () => forestsGeoJSON;

export const getDistrictForPoint = (lat: number, lng: number): string | null => {
  if (!districtsGeoJSON) return null;
  const pt = turf.point([lng, lat]);
  for (const feature of districtsGeoJSON.features) {
    if (turf.booleanPointInPolygon(pt, feature)) {
      return feature.properties.district || null;
    }
  }
  return null;
};

export const isInsideChhattisgarh = (lat: number, lng: number): boolean => {
  return getDistrictForPoint(lat, lng) !== null;
};

export const getDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const from = turf.point([lng1, lat1]);
  const to = turf.point([lng2, lat2]);
  return turf.distance(from, to, { units: 'kilometers' });
};

export const getForestScreening = (lat: number, lng: number): { screening: 'FOREST' | 'NEAR FOREST' | 'NON-FOREST' | 'UNKNOWN', distanceKm?: number } => {
  if (!forestsGeoJSON) return { screening: 'UNKNOWN' };
  
  const pt = turf.point([lng, lat]);
  
  // 1. Check if inside forest
  for (const feature of forestsGeoJSON.features) {
    if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
      if (turf.booleanPointInPolygon(pt, feature)) {
        return { screening: 'FOREST', distanceKm: 0 };
      }
    }
  }

  // 2. Check distance to nearest forest
  let minDistanceKm = Infinity;
  for (const feature of forestsGeoJSON.features) {
    // pointToPolygonDistance is not always available in basic turf or requires @turf/point-to-polygon-distance
    // Alternative: simplify by checking distance to bounding box, or sample points.
    // Or turf.pointToLineDistance(pt, turf.polygonToLine(feature))
    try {
      let d = Infinity;
      if (feature.geometry.type === 'Polygon') {
         const line = turf.polygonToLine(feature);
         if (line && line.type === 'FeatureCollection') {
           for (const l of line.features) {
             const dist = turf.pointToLineDistance(pt, l as any, { units: 'kilometers' });
             if (dist < d) d = dist;
           }
         } else if (line && line.type === 'Feature') {
           d = turf.pointToLineDistance(pt, line as any, { units: 'kilometers' });
         }
      } else if (feature.geometry.type === 'MultiPolygon') {
         // Fallback to bounding box distance for MultiPolygon
         const bbox = turf.bbox(feature);
         const bboxPoly = turf.bboxPolygon(bbox);
         const line = turf.polygonToLine(bboxPoly);
         d = turf.pointToLineDistance(pt, line as any, { units: 'kilometers' });
      }
      
      if (d < minDistanceKm) {
        minDistanceKm = d;
      }
    } catch(e) {
      // Ignored for invalid features
    }
  }

  if (minDistanceKm < Infinity) {
    if (minDistanceKm <= 1.0) { // 1 km threshold for NEAR FOREST
      return { screening: 'NEAR FOREST', distanceKm: minDistanceKm };
    } else {
      return { screening: 'NON-FOREST', distanceKm: minDistanceKm };
    }
  }

  return { screening: 'UNKNOWN' };
};
