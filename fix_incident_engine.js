import fs from 'fs';
let content = fs.readFileSync('server/services/incidentService.ts', 'utf-8');

content = content.replace("feature.geometry.type === 'Polygon' ? turf.polygonToLineString(feature) : turf.multiPolygonToLine(feature);", "turf.polygonToLine(feature);");

fs.writeFileSync('server/services/incidentService.ts', content);
