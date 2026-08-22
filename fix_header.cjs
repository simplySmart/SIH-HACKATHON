const fs = require('fs');

let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

content = content.replace(
  'z-[40] h-14 flex items-center',
  'z-[40] h-[calc(3.5rem+env(safe-area-inset-top))] flex items-center'
);

fs.writeFileSync('src/components/Header.tsx', content);

let simContent = fs.readFileSync('src/components/SimulationDashboard.tsx', 'utf8');
simContent = simContent.replace(
  'top-[calc(env(safe-area-inset-top)+56px)]',
  'top-[calc(env(safe-area-inset-top)+3.5rem)]'
);
fs.writeFileSync('src/components/SimulationDashboard.tsx', simContent);
