import fs from 'fs';
let content = fs.readFileSync('server/services/incidentService.ts', 'utf-8');

content = content.replace(/\\\`/g, "`");
content = content.replace(/\\\$/g, "$");

fs.writeFileSync('server/services/incidentService.ts', content);
console.log("Fixed escaping");
