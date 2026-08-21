const fs = require('fs');

const replaceInFile = (file, replacements) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  for (const { oldStr, newStr } of replacements) {
    content = content.replace(oldStr, newStr);
  }
  fs.writeFileSync(file, content);
};

// Sidebar
replaceInFile('src/components/Sidebar.tsx', [
  { oldStr: '>AFIRN<', newStr: '>VANDRISHTI<' }
]);

// SimulationDashboard
replaceInFile('src/components/SimulationDashboard.tsx', [
  { oldStr: 'AFIRN Live Simulation', newStr: 'VANDRISHTI Live Simulation' },
  { oldStr: 'AFIRN enhances', newStr: 'VANDRISHTI enhances' }
]);

// CommandCenter
replaceInFile('src/components/CommandCenter.tsx', [
  { oldStr: 'AFIRN Command Officer', newStr: 'VANDRISHTI Command Officer' },
  { oldStr: 'Adaptive Forest Intelligence & Response Network (AFIRN)', newStr: 'VANDRISHTI - Forest Intelligence & Response Network' }
]);

// index.html
replaceInFile('index.html', [
  { oldStr: 'AFIRN', newStr: 'VANDRISHTI' }
]);

// metadata.json
replaceInFile('metadata.json', [
  { oldStr: '"name": "AFIRN"', newStr: '"name": "VANDRISHTI"' }
]);

console.log('Renaming complete.');
