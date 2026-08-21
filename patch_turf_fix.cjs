const fs = require('fs');

let code = fs.readFileSync('src/utils/geo.ts', 'utf8');

const fixRings = `
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
`;

code = code.replace("export const loadGeoData = async () => {", fixRings + "\nexport const loadGeoData = async () => {");

code = code.replace(
  "districtsGeoJSON = data;",
  "districtsGeoJSON = fixPolygonRings(data);"
);

code = code.replace(
  "forestsGeoJSON = data;",
  "forestsGeoJSON = fixPolygonRings(data);"
);

fs.writeFileSync('src/utils/geo.ts', code);
