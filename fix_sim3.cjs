const fs = require('fs');

let content = fs.readFileSync('src/components/SimulationDashboard.tsx', 'utf8');

content = content.replace(
  '<div className="flex flex-col h-screen bg-slate-900 font-sans text-slate-100 relative overflow-hidden z-50">',
  '<div className="fixed top-[calc(env(safe-area-inset-top)+56px)] bottom-[calc(env(safe-area-inset-bottom)+60px)] left-0 right-0 z-30 flex flex-col bg-slate-900 font-sans text-slate-100 overflow-hidden md:relative md:top-auto md:bottom-auto md:h-[calc(100vh-120px)] md:rounded-3xl">'
);

// We should also make the TOP BAR - CONTROLS responsive so it fits on mobile
content = content.replace(
  '<div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 z-20">',
  '<div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 md:px-6 shrink-0 z-20">'
);
content = content.replace(
  '<h1 className="font-bold text-lg tracking-wide">VANDRISHTI Live Simulation</h1>',
  '<h1 className="font-bold text-sm md:text-lg tracking-wide truncate hidden sm:block">VANDRISHTI Live Simulation</h1>'
);

fs.writeFileSync('src/components/SimulationDashboard.tsx', content);
