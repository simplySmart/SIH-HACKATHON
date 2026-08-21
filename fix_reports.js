import fs from 'fs';

let content = fs.readFileSync('src/components/ReportsDashboard.tsx', 'utf-8');

content = content.replace(/text-gray-900/g, 'text-white');
content = content.replace(/text-gray-500/g, 'text-gray-400');
content = content.replace(/text-gray-600/g, 'text-gray-300');
content = content.replace(/text-gray-700/g, 'text-gray-300');
content = content.replace(/bg-white/g, 'bg-[#121E15]');
content = content.replace(/border-gray-200/g, 'border-white/5');
content = content.replace(/border-gray-100/g, 'border-white/5');
content = content.replace(/bg-gray-100/g, 'bg-white/10');
content = content.replace(/hover:bg-gray-50/g, 'hover:bg-white/5');
content = content.replace(/hover:bg-gray-100/g, 'hover:bg-white/20');
content = content.replace(/bg-green-100/g, 'bg-green-500/20');
content = content.replace(/bg-blue-100/g, 'bg-blue-500/20');
content = content.replace(/text-blue-600/g, 'text-blue-400');
content = content.replace(/text-green-600/g, 'text-green-400');
content = content.replace(/bg-green-50 text-green-700/g, 'bg-green-500/10 text-green-400');
content = content.replace(/bg-red-50 text-red-700/g, 'bg-red-500/10 text-red-400');
content = content.replace(/bg-yellow-50 text-yellow-700/g, 'bg-yellow-500/10 text-yellow-400');

fs.writeFileSync('src/components/ReportsDashboard.tsx', content);
