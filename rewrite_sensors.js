import fs from 'fs';

let content = fs.readFileSync('src/components/IotNetwork.tsx', 'utf-8');

// The prompt wants adaptive sensing states: Sleeping, Monitoring, High Alert, Fire Mode, Offline.
// Let's replace the logic inside where we count connected/warning/anomaly.

content = content.replace(/bg-\[\#F5F7F6\]/g, 'bg-[#0B120C]');
content = content.replace(/bg-white/g, 'bg-[#121E15]');
content = content.replace(/border-gray-100/g, 'border-white/5');
content = content.replace(/border-gray-200/g, 'border-white/10');
content = content.replace(/text-gray-900/g, 'text-white');
content = content.replace(/text-gray-600/g, 'text-gray-400');
content = content.replace(/text-gray-500/g, 'text-gray-400');
content = content.replace(/text-gray-400/g, 'text-gray-500');

content = content.replace('IoT Network', 'Adaptive Sensor Network');
content = content.replace('Ground sensors complementing satellite observations.', 'Tactical Ground Sensing: Sleeping, Monitoring, Alert, Fire Mode, Offline.');
content = content.replace(/Connected/g, 'Monitoring');
content = content.replace(/Warning/g, 'High Alert');
content = content.replace(/Fire Anomaly/g, 'Fire Mode');
content = content.replace(/bg-green-50 rounded-md border border-green-100/g, 'bg-green-500/10 rounded-md border border-green-500/20');
content = content.replace(/text-green-700/g, 'text-green-400');
content = content.replace(/bg-orange-100 text-orange-800/g, 'bg-orange-500/10 text-orange-400 border border-orange-500/20');

// Replace chart background colors and stroke colors for recharts
content = content.replace(/stroke="\#10b981"/g, 'stroke="#4ade80"');
content = content.replace(/fill="\#d1fae5"/g, 'fill="#4ade8020"');

fs.writeFileSync('src/components/IotNetwork.tsx', content);

