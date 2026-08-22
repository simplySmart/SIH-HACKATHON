const fs = require('fs');
let content = fs.readFileSync('src/components/SimulationDashboard.tsx', 'utf8');

// Fix the duplicate range slider
content = content.replace(
  '<div className="flex items-center gap-4 w-64">',
  '<div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">'
);

// Fix the flex sizing so they split 50/50 instead of using vh which breaks on short screens
content = content.replace(
  '<div className="w-full lg:w-[70%] flex-1 lg:flex-none lg:h-full relative bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-700 shrink-0 lg:shrink min-h-[40vh]">',
  '<div className="w-full lg:w-[70%] flex-1 lg:flex-none lg:h-full relative bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-700 shrink-0 lg:shrink">'
);
content = content.replace(
  '<div className="w-full lg:w-[30%] bg-slate-900 lg:border-l lg:border-t-0 border-slate-700 flex flex-col h-[40vh] lg:h-full relative z-20 overflow-y-auto shrink-0">',
  '<div className="w-full lg:w-[30%] bg-slate-900 lg:border-l lg:border-t-0 border-slate-700 flex flex-col flex-1 lg:flex-none lg:h-full relative z-20 overflow-hidden shrink-0">'
);

fs.writeFileSync('src/components/SimulationDashboard.tsx', content);
