import fs from 'fs';

let content = fs.readFileSync('server/services/incidentService.ts', 'utf-8');
content = content.replace("const d = turf.pointToLineDistance(pt, f, { units: 'kilometers' });", "const d = turf.pointToLineDistance(pt, f as any, { units: 'kilometers' });");
fs.writeFileSync('server/services/incidentService.ts', content);
