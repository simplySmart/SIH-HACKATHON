const fs = require('fs');

let content = fs.readFileSync('src/components/SimulationDashboard.tsx', 'utf8');

// Fix main layout wrapper
content = content.replace(
  '<div className="flex-1 flex overflow-hidden">',
  '<div className="flex-1 flex flex-col lg:flex-row overflow-hidden">'
);

// Fix center map
content = content.replace(
  '<div className="w-[70%] h-full relative bg-slate-950 border-r border-slate-700">',
  '<div className="w-full lg:w-[70%] h-[50vh] lg:h-full relative bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-700 shrink-0 lg:shrink">'
);

// Fix right panel
content = content.replace(
  '<div className="w-[30%] bg-[#060e14] flex flex-col h-full overflow-hidden relative">',
  '<div className="w-full lg:w-[30%] bg-[#060e14] flex flex-col h-[50vh] lg:h-full overflow-hidden relative flex-1">'
);

fs.writeFileSync('src/components/SimulationDashboard.tsx', content);
