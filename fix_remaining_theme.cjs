const fs = require('fs');
const path = require('path');

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  if (file === 'SimulationDashboard.tsx') return;
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/bg-\[#0f1912\]\/(\d+)/g, 'bg-white/$1');
  content = content.replace(/bg-\[#0f1912\]/g, 'bg-white');
  content = content.replace(/bg-black\/(\d+)/g, 'bg-white/$1');
  content = content.replace(/bg-gray-900/g, 'bg-slate-50');
  content = content.replace(/text-gray-200/g, 'text-slate-600');
  content = content.replace(/text-white\/80/g, 'text-slate-600');
  content = content.replace(/text-white\/60/g, 'text-slate-500');
  content = content.replace(/text-white\/40/g, 'text-slate-400');
  content = content.replace(/text-white\/20/g, 'text-slate-300');
  content = content.replace(/border-white\/10/g, 'border-slate-200');
  content = content.replace(/border-white\/20/g, 'border-slate-300');
  
  // Specific fix for LiveMonitoring layout
  content = content.replace(/className="w-full flex-1 z-0"/g, 'className="w-full h-full z-0"');
  
  // LiveMonitoring card uses some weird fixed position bottom on mobile
  content = content.replace(/bg-white\/95 lg:bg-white\/90/g, 'bg-white/95 lg:bg-white');
  
  fs.writeFileSync(filePath, content);
});

console.log("Remaining theme and layout fixed");
