const fs = require('fs');

let content = fs.readFileSync('src/components/CommandCenter.tsx', 'utf8');

const oldSyncBtn = `<button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-xl px-4 py-2.5 shadow-sm text-sm font-bold transition-all"
          >`;
          
const simBtn = `<button 
            onClick={() => navigate('/simulation')} 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 shadow-sm text-sm font-bold transition-all"
          >
            <PlayCircle className="w-4 h-4" />
            SIH Simulation
          </button>
          `;
          
content = content.replace(oldSyncBtn, simBtn + oldSyncBtn);

// Need to make sure PlayCircle is imported from lucide-react in CommandCenter.tsx
if (!content.includes('PlayCircle')) {
  content = content.replace(/import \{/, 'import { PlayCircle,');
}

fs.writeFileSync('src/components/CommandCenter.tsx', content);
