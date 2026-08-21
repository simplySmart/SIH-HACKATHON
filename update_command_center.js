import fs from 'fs';
let content = fs.readFileSync('src/components/CommandCenter.tsx', 'utf-8');

const buttonAdd = `
          <button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl px-4 py-2.5 shadow-sm text-sm font-bold transition-all"
          >
            <RefreshCw className={\`w-4 h-4 \${isSyncing ? 'animate-spin' : ''}\`} />
            {isSyncing ? 'Syncing FIRMS...' : 'Sync Data'}
          </button>
`;

if (!content.includes('Sync Data')) {
  content = content.replace('<div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">', '<div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">' + buttonAdd);
  fs.writeFileSync('src/components/CommandCenter.tsx', content);
  console.log("Added Sync button to CommandCenter");
}
