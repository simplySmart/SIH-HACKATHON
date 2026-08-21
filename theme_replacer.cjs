const fs = require('fs');
const path = require('path');

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

const replacements = [
  { search: /bg-\[#121E15\]/g, replace: 'bg-white' },
  { search: /bg-\[#0B120C\]/g, replace: 'bg-slate-50' },
  { search: /bg-\[#152318\]/g, replace: 'bg-slate-50' },
  { search: /bg-\[#050505\]/g, replace: 'bg-slate-100' },
  { search: /bg-black\/60/g, replace: 'bg-white/90' },
  { search: /bg-black\/70/g, replace: 'bg-white/95' },
  { search: /bg-black\/50/g, replace: 'bg-slate-800/20' }, // Backdrops
  { search: /bg-black\/40/g, replace: 'bg-slate-100' },
  { search: /bg-black\/20/g, replace: 'bg-slate-50' },
  
  // Borders
  { search: /border-white\/5/g, replace: 'border-slate-200' },
  { search: /border-white\/10/g, replace: 'border-slate-200' },
  { search: /border-white\/20/g, replace: 'border-slate-300' },
  { search: /border-gray-800/g, replace: 'border-slate-200' },
  
  // Text
  { search: /text-white/g, replace: 'text-slate-900' },
  { search: /text-gray-400/g, replace: 'text-slate-500' },
  { search: /text-gray-500/g, replace: 'text-slate-400' },
  { search: /text-gray-300/g, replace: 'text-slate-600' },
  { search: /text-gray-100/g, replace: 'text-slate-900' },
  
  // Inner backgrounds
  { search: /bg-white\/5/g, replace: 'bg-slate-50' },
  { search: /bg-white\/10/g, replace: 'bg-slate-100' },
  { search: /bg-white\/20/g, replace: 'bg-slate-200' },
  { search: /bg-gray-800/g, replace: 'bg-white' },
  { search: /bg-gray-900/g, replace: 'bg-slate-50' },

  // Shadows for light theme
  { search: /shadow-sm/g, replace: 'shadow-sm' },
  
  // Scrollbar specific styles (if any)
  { search: /shadow-\[inset_0_0_150px_rgba\(0,0,0,0\.8\)\]/g, replace: 'shadow-[inset_0_0_150px_rgba(255,255,255,0.5)]' }
];

files.forEach(file => {
  if (file === 'SimulationDashboard.tsx') return; // Skip simulation as we just styled it dark and it's a specific SIH component
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  replacements.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
  });
  
  fs.writeFileSync(filePath, content);
});

console.log("Global theme replacements applied");
