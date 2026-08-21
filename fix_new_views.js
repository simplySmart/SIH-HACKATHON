import fs from 'fs';

// Communication.tsx
let commContent = fs.readFileSync('src/components/Communication.tsx', 'utf-8');
commContent = commContent.replace(/text-gray-900/g, 'text-white');
commContent = commContent.replace(/text-gray-500/g, 'text-gray-400');
commContent = commContent.replace(/bg-white/g, 'bg-[#121E15]');
commContent = commContent.replace(/border-gray-200/g, 'border-white/5');
commContent = commContent.replace(/bg-green-100/g, 'bg-green-500/20');
commContent = commContent.replace(/bg-blue-100/g, 'bg-blue-500/20');
commContent = commContent.replace(/bg-purple-100/g, 'bg-purple-500/20');
commContent = commContent.replace(/text-green-600/g, 'text-green-400');
commContent = commContent.replace(/text-blue-600/g, 'text-blue-400');
commContent = commContent.replace(/text-purple-600/g, 'text-purple-400');
commContent = commContent.replace(/text-red-600/g, 'text-red-400');
fs.writeFileSync('src/components/Communication.tsx', commContent);

// PatrolUnits.tsx
let patrolContent = fs.readFileSync('src/components/PatrolUnits.tsx', 'utf-8');
patrolContent = patrolContent.replace(/text-gray-900/g, 'text-white');
patrolContent = patrolContent.replace(/text-gray-500/g, 'text-gray-400');
patrolContent = patrolContent.replace(/text-gray-600/g, 'text-gray-300');
patrolContent = patrolContent.replace(/bg-white/g, 'bg-[#121E15]');
patrolContent = patrolContent.replace(/border-gray-200/g, 'border-white/5');
patrolContent = patrolContent.replace(/border-gray-100/g, 'border-white/5');
patrolContent = patrolContent.replace(/bg-gray-100/g, 'bg-white/10');
patrolContent = patrolContent.replace(/hover:bg-gray-200/g, 'hover:bg-white/20');
patrolContent = patrolContent.replace(/text-red-600/g, 'text-red-400');
patrolContent = patrolContent.replace(/text-green-600/g, 'text-green-400');
fs.writeFileSync('src/components/PatrolUnits.tsx', patrolContent);

