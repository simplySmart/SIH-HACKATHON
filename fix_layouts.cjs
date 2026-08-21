const fs = require('fs');
const path = require('path');

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  if (file === 'SimulationDashboard.tsx') return;
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Strip top-level overflow and fixed heights from most dashboards
  // e.g. "flex flex-col h-full bg-transparent overflow-y-auto space-y-6 pb-12 pr-2"
  // => "flex flex-col space-y-6 pb-12"
  
  if (file !== 'LiveMonitoring.tsx' && file !== 'IotNetwork.tsx' && file !== 'SatelliteIntelligence.tsx' && file !== 'AnalyticsDashboard.tsx') {
    // For non-map heavy dashboards, remove h-full and overflow
    content = content.replace(/flex flex-col h-full [^"]*overflow[^"]*/g, match => {
      let m = match.replace(/h-full/g, '');
      m = m.replace(/overflow-[a-z]+-auto/g, '');
      m = m.replace(/overflow-hidden/g, '');
      return m;
    });
  }

  // Live Monitoring is a map, it needs to be tall
  if (file === 'LiveMonitoring.tsx') {
    content = content.replace(/className="flex flex-col h-full/g, 'className="flex flex-col h-[calc(100vh-140px)] min-h-[600px]');
  }
  
  // Fix IotNetwork and others with map and sidebars to be a bit taller or just fill
  if (file === 'IotNetwork.tsx' || file === 'SatelliteIntelligence.tsx' || file === 'AnalyticsDashboard.tsx') {
     content = content.replace(/className="flex flex-col h-full/g, 'className="flex flex-col min-h-[calc(100vh-140px)]');
  }

  // Remove `pr-2` or `custom-scrollbar` from nested divs to avoid nested scrolling
  content = content.replace(/overflow-y-auto pr-2 custom-scrollbar/g, '');
  content = content.replace(/overflow-y-auto space-y-6 pb-12 pr-2/g, 'space-y-6 pb-12');
  
  fs.writeFileSync(filePath, content);
});

// App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative/, "min-h-screen bg-slate-50 font-sans text-slate-900 relative");
appContent = appContent.replace(/overflow-y-auto w-full h-full relative/, "w-full min-h-screen relative");
appContent = appContent.replace(/<div className="max-w-7xl mx-auto h-full flex flex-col relative">/, `<div className="max-w-7xl mx-auto flex flex-col relative min-h-[calc(100vh-120px)]">`);
fs.writeFileSync('src/App.tsx', appContent);

console.log("Fixed layouts and scrolling");
