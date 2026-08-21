import fs from 'fs';

let content = fs.readFileSync('src/components/Alerts.tsx', 'utf-8');

content = content.replace(/text-gray-900/g, 'text-white');
content = content.replace(/bg-white/g, 'bg-[#121E15]');
content = content.replace(/border-gray-200/g, 'border-white/5');
content = content.replace(/border-gray-100/g, 'border-white/5');
content = content.replace(/text-gray-500/g, 'text-gray-400');
content = content.replace(/text-gray-700/g, 'text-gray-300');
content = content.replace(/text-gray-200/g, 'text-gray-400');
content = content.replace(/bg-gray-100/g, 'bg-white/10');
content = content.replace(/bg-gray-50/g, 'bg-white/5');

content = content.replace(/bg-yellow-100 text-yellow-400/g, 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30');
content = content.replace(/bg-orange-500\/20 text-orange-700/g, 'bg-orange-500/20 text-orange-400 border border-orange-500/30');
content = content.replace(/bg-red-100 text-red-400/g, 'bg-red-500/20 text-red-400 border border-red-500/30');
content = content.replace(/bg-purple-100 text-purple-700/g, 'bg-purple-500/20 text-purple-400 border border-purple-500/30');
content = content.replace(/bg-blue-500\/20 text-blue-700/g, 'bg-blue-500/20 text-blue-400 border border-blue-500/30');
content = content.replace(/bg-green-100 text-green-400/g, 'bg-green-500/20 text-green-400 border border-green-500/30');

// "Alerts & Incidents" to "Active Incidents"
content = content.replace('Alerts & Incidents', 'Active Incidents');

fs.writeFileSync('src/components/Alerts.tsx', content);

