import fs from 'fs';

let content = fs.readFileSync('src/components/CommandCenter.tsx', 'utf-8');

// Header
content = content.replace('Welcome, Forest Official', 'AFIRN Command Officer');
content = content.replace('Real-time Forest Fire Detection System - Chhattisgarh', 'Adaptive Forest Intelligence & Response Network (AFIRN)');
content = content.replace('text-gray-900', 'text-white').replace('text-gray-900', 'text-white');
content = content.replace(/text-gray-900/g, 'text-white');
content = content.replace(/bg-white/g, 'bg-[#121E15]');
content = content.replace(/border-gray-200/g, 'border-white/5');
content = content.replace(/border-gray-100/g, 'border-white/5');
content = content.replace(/text-gray-500/g, 'text-gray-400');
content = content.replace(/text-gray-700/g, 'text-gray-300');
content = content.replace(/bg-gray-50/g, 'bg-white/5');
content = content.replace(/bg-green-50/g, 'bg-green-500/10');
content = content.replace(/bg-red-50/g, 'bg-red-500/10');
content = content.replace(/bg-yellow-50/g, 'bg-yellow-500/10');
content = content.replace(/bg-orange-50/g, 'bg-orange-500/10');
content = content.replace(/bg-blue-50/g, 'bg-blue-500/10');
content = content.replace(/bg-emerald-50/g, 'bg-emerald-500/10');
content = content.replace(/border-green-100/g, 'border-green-500/20');
content = content.replace(/border-red-100/g, 'border-red-500/20');
content = content.replace(/border-yellow-100/g, 'border-yellow-500/20');
content = content.replace(/border-emerald-100/g, 'border-emerald-500/20');
content = content.replace(/border-red-200/g, 'border-red-500/20');
content = content.replace(/border-orange-200/g, 'border-orange-500/20');
content = content.replace(/border-blue-200/g, 'border-blue-500/20');
content = content.replace(/text-green-700/g, 'text-green-400');
content = content.replace(/text-red-700/g, 'text-red-400');
content = content.replace(/text-yellow-700/g, 'text-yellow-400');
content = content.replace(/text-orange-700/g, 'text-orange-400');
content = content.replace(/text-blue-700/g, 'text-blue-400');
content = content.replace(/text-emerald-700/g, 'text-emerald-400');
content = content.replace(/text-emerald-800/g, 'text-emerald-300');
content = content.replace(/text-gray-400 mb-1/g, 'text-gray-500 mb-1');
content = content.replace(/bg-gray-100/g, 'bg-white/10');
content = content.replace(/bg-gray-900/g, 'bg-white/10');
content = content.replace(/hover:bg-gray-800/g, 'hover:bg-white/20');

// Replace the image banner code entirely or adjust it.
// Wait, is there a banner? There's `bannerImg` import but it's not used in the snippet shown.

fs.writeFileSync('src/components/CommandCenter.tsx', content);

