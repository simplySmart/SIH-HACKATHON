const fs = require('fs');
let content = fs.readFileSync('src/components/SimulationDashboard.tsx', 'utf8');

content = content.replace(
  '<div className="w-[30%] bg-slate-900 border-l border-slate-700 flex flex-col h-full relative z-20">',
  '<div className="w-full lg:w-[30%] bg-slate-900 lg:border-l border-t lg:border-t-0 border-slate-700 flex flex-col h-full relative z-20 flex-1 overflow-y-auto">'
);

fs.writeFileSync('src/components/SimulationDashboard.tsx', content);
