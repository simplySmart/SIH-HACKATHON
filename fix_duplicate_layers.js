import fs from 'fs';
let content = fs.readFileSync('src/components/IncidentDetails.tsx', 'utf-8');

const regex = /(\{\/\* Context Layers \*\/\}[\s\S]*?<\/>\s*\n\s*\)\})/g;
const matches = content.match(regex);
if (matches && matches.length > 1) {
  content = content.replace(matches[1], ''); // remove second instance
  fs.writeFileSync('src/components/IncidentDetails.tsx', content);
  console.log("Removed duplicate Context Layers.");
} else {
  console.log("Did not find duplicates.");
}
