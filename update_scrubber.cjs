const fs = require('fs');
let content = fs.readFileSync('src/components/SimulationDashboard.tsx', 'utf8');

const oldTopBar = `<div className="flex flex-col items-end w-48">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mission Timer</span>
          <span className="font-mono font-bold text-lg text-indigo-400">
            00:{Math.floor(time / 1000).toString().padStart(2, '0')}.{Math.floor((time % 1000) / 10).toString().padStart(2, '0')}
          </span>
        </div>`;

const newTopBar = `<div className="flex items-center gap-4 w-64">
          <div className="flex-1">
             <input 
               type="range" 
               min="0" max={DURATION} 
               value={time} 
               onChange={(e) => setTime(Number(e.target.value))}
               className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
             />
          </div>
        </div>
        <div className="flex flex-col items-end w-32">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mission Timer</span>
          <span className="font-mono font-bold text-lg text-indigo-400">
            00:{Math.floor(time / 1000).toString().padStart(2, '0')}.{Math.floor((time % 1000) / 10).toString().padStart(2, '0')}
          </span>
        </div>`;

content = content.replace(oldTopBar, newTopBar);
fs.writeFileSync('src/components/SimulationDashboard.tsx', content);
