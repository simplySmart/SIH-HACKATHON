const fs = require('fs');

let content = fs.readFileSync('src/components/SimulationDashboard.tsx', 'utf8');

// Fix Map container height to ensure proportional split
content = content.replace(
  '<div className="w-full lg:w-[70%] flex-1 lg:flex-none min-h-[40%] lg:h-full relative bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-700 shrink-0 lg:shrink">',
  '<div className="w-full lg:w-[70%] flex-1 lg:flex-none lg:h-full relative bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-700 shrink-0 lg:shrink min-h-[40vh]">'
);

// Fix panel layout to flex-1 to split space perfectly with map on mobile
content = content.replace(
  '<div className="w-full lg:w-[30%] bg-slate-900 lg:border-l lg:border-t-0 border-slate-700 flex flex-col h-[50%] lg:h-full relative z-20 overflow-y-auto">',
  '<div className="w-full lg:w-[30%] bg-slate-900 lg:border-l lg:border-t-0 border-slate-700 flex flex-col h-[40vh] lg:h-full relative z-20 overflow-y-auto shrink-0">'
);

fs.writeFileSync('src/components/SimulationDashboard.tsx', content);
