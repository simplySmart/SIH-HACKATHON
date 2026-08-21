import fs from 'fs';

let content = fs.readFileSync('src/components/CommandCenter.tsx', 'utf-8');

content = content.replace(/bg-purple-50/g, 'bg-purple-500/10');
content = content.replace(/bg-gradient-to-r from-green-50 to-emerald-50/g, 'bg-gradient-to-r from-[#121E15] to-[#1a2d1e]');
content = content.replace(/bg-green-500\/100/g, 'bg-green-500');
content = content.replace(/bg-emerald-500\/100/g, 'bg-emerald-500');
content = content.replace(/text-green-900/g, 'text-green-400');
content = content.replace(/hover:bg-red-100/g, 'hover:bg-red-500/20');
content = content.replace(/hover:bg-orange-100/g, 'hover:bg-orange-500/20');
content = content.replace(/hover:bg-blue-100/g, 'hover:bg-blue-500/20');
content = content.replace(/border-gray-100/g, 'border-white/5');

fs.writeFileSync('src/components/CommandCenter.tsx', content);

