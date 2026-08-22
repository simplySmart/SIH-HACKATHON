const fs = require('fs');

let content = fs.readFileSync('src/components/SimulationDashboard.tsx', 'utf8');

// Fix Top Bar
content = content.replace(
  '<div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 md:px-6 shrink-0 z-20">',
  '<div className="bg-slate-800 border-b border-slate-700 flex flex-wrap items-center justify-between p-2 md:px-6 shrink-0 z-20 gap-y-2">'
);

content = content.replace(
  '<div className="flex items-center gap-4 w-64">\n          <div className="flex-1">\n             <input\n                type="range"\n                min="0" max={DURATION}\n                value={time}\n                onChange={(e) => setTime(Number(e.target.value))}\n               className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"\n             />\n          </div>\n        </div>',
  '<div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">\n          <div className="flex-1">\n             <input\n                type="range"\n                min="0" max={DURATION}\n                value={time}\n                onChange={(e) => setTime(Number(e.target.value))}\n               className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"\n             />\n          </div>\n        </div>'
);

// We need to add the mobile slider below the timer. We can replace the timer block.
const oldTimer = `<div className="flex flex-col items-end w-32">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mission Timer</span>
          <span className="font-mono font-bold text-lg text-indigo-400">
            00:{Math.floor(time / 1000).toString().padStart(2, '0')}.{Math.floor((time % 1000) / 10).toString().padStart(2, '0')}
          </span>
        </div>`;

const newTimer = `<div className="flex flex-col items-end min-w-[80px] md:w-32">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</span>
          <span className="font-mono font-bold text-sm md:text-lg text-indigo-400">
            00:{Math.floor(time / 1000).toString().padStart(2, '0')}.{Math.floor((time % 1000) / 10).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="w-full md:hidden px-2 pb-1">
          <input
            type="range"
            min="0" max={DURATION}
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>`;

content = content.replace(oldTimer, newTimer);

// Fix Map container height
content = content.replace(
  '<div className="w-full lg:w-[70%] h-[50vh] lg:h-full relative bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-700 shrink-0 lg:shrink">',
  '<div className="w-full lg:w-[70%] flex-1 lg:flex-none min-h-[40%] lg:h-full relative bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-700 shrink-0 lg:shrink">'
);

// Fix panel layout 
content = content.replace(
  '<div className="w-full lg:w-[30%] bg-slate-900 lg:border-l border-t lg:border-t-0 border-slate-700 flex flex-col h-full relative z-20 flex-1 overflow-y-auto">',
  '<div className="w-full lg:w-[30%] bg-slate-900 lg:border-l lg:border-t-0 border-slate-700 flex flex-col h-[50%] lg:h-full relative z-20 overflow-y-auto">'
);

fs.writeFileSync('src/components/SimulationDashboard.tsx', content);
