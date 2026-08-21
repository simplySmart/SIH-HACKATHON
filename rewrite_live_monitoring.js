import fs from 'fs';

let content = fs.readFileSync('src/components/LiveMonitoring.tsx', 'utf-8');

content = content.replace(/bg-white\/90/g, 'bg-[#121E15]/90');
content = content.replace(/bg-white\/80/g, 'bg-[#121E15]/80');
content = content.replace(/bg-white/g, 'bg-[#121E15]');
content = content.replace(/border-gray-200/g, 'border-white/5');
content = content.replace(/border-gray-100/g, 'border-white/5');
content = content.replace(/text-gray-900/g, 'text-white');
content = content.replace(/text-gray-700/g, 'text-gray-300');
content = content.replace(/text-gray-600/g, 'text-gray-400');
content = content.replace(/text-gray-500/g, 'text-gray-400');
content = content.replace(/bg-gray-100/g, 'bg-white/10');
content = content.replace(/bg-gray-50/g, 'bg-white/5');
content = content.replace('Live Monitoring', 'Live Forest Map');
content = content.replace('Global overview of sensor networks', 'Tactical active incident tracking map');

// Use CartoDB Dark Matter if it's currently using Voyager or OSM.
content = content.replace('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png');

fs.writeFileSync('src/components/LiveMonitoring.tsx', content);

