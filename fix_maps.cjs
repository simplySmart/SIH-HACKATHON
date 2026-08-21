const fs = require('fs');
const path = require('path');

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  if (file === 'SimulationDashboard.tsx') return;
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Change dark_all or dark_nolabels to light_all
  content = content.replace(/dark_all/g, 'light_all');
  content = content.replace(/dark_nolabels/g, 'light_all');
  content = content.replace(/mapbox\/dark-v11/g, 'mapbox/light-v11'); // if any
  
  // also standard CartoDB Voyager or Light
  content = content.replace(/cartocdn\.com\/dark/g, 'cartocdn.com/light');

  fs.writeFileSync(filePath, content);
});

console.log("Map tiles switched to light mode");
