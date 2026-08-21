const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  'className="flex h-screen bg-[#070b09] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#112417] via-[#070b09] to-[#040605] font-sans text-gray-300 overflow-hidden"',
  'className="flex h-screen bg-[#F5F7F8] font-sans text-gray-900 overflow-hidden"'
);
fs.writeFileSync('src/App.tsx', appCode);

let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
sidebarCode = sidebarCode.replace(
  'bg-black/40 backdrop-blur-3xl',
  'bg-[#0a1410] border-r border-[#15271e]'
);
sidebarCode = sidebarCode.replace(
  'bg-green-500/10 text-white shadow-[inset_3px_0_0_0_#22c55e]',
  'bg-[#1a2d21] text-white shadow-[inset_4px_0_0_0_#22c55e]'
);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarCode);
