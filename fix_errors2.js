import fs from 'fs';

let cmdCenter = fs.readFileSync('src/components/CommandCenter.tsx', 'utf-8');
cmdCenter = cmdCenter.replace('import { \n  CloudSun', 'import { RefreshCw, \n  CloudSun');
cmdCenter = cmdCenter.replace('import {   CloudSun', 'import { RefreshCw,   CloudSun');
fs.writeFileSync('src/components/CommandCenter.tsx', cmdCenter);

let serverService = fs.readFileSync('server/services/incidentService.ts', 'utf-8');
serverService = serverService.replace('const distance = turf.pointToLineDistance(incidentPoint, f);', 'const distance = turf.pointToLineDistance(incidentPoint, f as any);');
fs.writeFileSync('server/services/incidentService.ts', serverService);
