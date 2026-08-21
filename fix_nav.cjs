const fs = require('fs');
let content = fs.readFileSync('src/components/MobileBottomNav.tsx', 'utf8');
content = content.replace(
  "const moreItems = [",
  "const moreItems = [\n    { icon: PlayCircle, label: 'Simulation', path: '/simulation' },"
);
fs.writeFileSync('src/components/MobileBottomNav.tsx', content);
