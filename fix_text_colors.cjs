const fs = require('fs');
const path = require('path');

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  if (file === 'SimulationDashboard.tsx') return;
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/text-green-400/g, 'text-emerald-600');
  content = content.replace(/text-blue-400/g, 'text-blue-600');
  content = content.replace(/text-purple-400/g, 'text-purple-600');
  content = content.replace(/text-red-400/g, 'text-red-600');
  content = content.replace(/text-yellow-400/g, 'text-orange-600');
  content = content.replace(/text-orange-400/g, 'text-orange-600');
  content = content.replace(/text-cyan-400/g, 'text-cyan-600');
  
  content = content.replace(/text-green-500/g, 'text-emerald-600');
  
  // also fix light backgrounds for those icon circles
  content = content.replace(/bg-green-500\/20/g, 'bg-emerald-100');
  content = content.replace(/bg-blue-500\/20/g, 'bg-blue-100');
  content = content.replace(/bg-purple-500\/20/g, 'bg-purple-100');
  content = content.replace(/bg-red-500\/20/g, 'bg-red-100');
  content = content.replace(/bg-yellow-500\/20/g, 'bg-orange-100');
  content = content.replace(/bg-orange-500\/20/g, 'bg-orange-100');
  content = content.replace(/bg-cyan-500\/20/g, 'bg-cyan-100');

  fs.writeFileSync(filePath, content);
});

console.log("Text contrast colors fixed");
