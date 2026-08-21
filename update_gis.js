import fs from 'fs';
let content = fs.readFileSync('server/services/gisService.ts', 'utf-8');
content = content.replace("return { error: 'Failed to fetch GIS context', details: error.message };", "return { nearestRoad: null, nearestWater: null, nearestSettlement: null, source: 'OpenStreetMap', error: 'Network Error' };");

// Let's also change the Overpass URL to one that might work in this environment if possible. 
// We'll use the main one but add a User-Agent just in case it's a block.
content = content.replace("headers: {", "headers: { 'User-Agent': 'VanRakshak App (Research)',");
fs.writeFileSync('server/services/gisService.ts', content);
console.log("Updated gisService.ts");
