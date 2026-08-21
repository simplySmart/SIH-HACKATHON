const fs = require('fs');
const path = require('path');

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  if (file === 'SimulationDashboard.tsx') return;
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix button text on solid backgrounds
  content = content.replace(/(bg-red-\d00[^"]*)text-slate-900/g, "$1text-white");
  content = content.replace(/(bg-blue-\d00[^"]*)text-slate-900/g, "$1text-white");
  content = content.replace(/(bg-green-\d00[^"]*)text-slate-900/g, "$1text-white");
  content = content.replace(/(bg-indigo-\d00[^"]*)text-slate-900/g, "$1text-white");
  content = content.replace(/(bg-purple-\d00[^"]*)text-slate-900/g, "$1text-white");
  content = content.replace(/(bg-emerald-\d00[^"]*)text-slate-900/g, "$1text-white");
  
  // Also fix text-slate-900 that comes BEFORE the background
  content = content.replace(/text-slate-900([^"]*bg-red-[56]00)/g, "text-white$1");
  content = content.replace(/text-slate-900([^"]*bg-emerald-[56]00)/g, "text-white$1");
  content = content.replace(/text-slate-900([^"]*bg-blue-[56]00)/g, "text-white$1");
  
  fs.writeFileSync(filePath, content);
});
console.log("Fixed text colors on solid backgrounds");
