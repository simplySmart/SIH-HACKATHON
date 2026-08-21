import fs from 'fs';

// 1. App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace('bg-[#F5F7F8] font-sans text-gray-900', 'bg-[#0B120C] font-sans text-gray-100');
fs.writeFileSync('src/App.tsx', appContent);

// 2. Sidebar.tsx
let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
sidebarContent = sidebarContent.replace('bg-white border-r border-gray-200 text-gray-500', 'bg-[#121E15] border-r border-white/5 text-gray-400');
sidebarContent = sidebarContent.replace('bg-green-100', 'bg-green-500/20');
sidebarContent = sidebarContent.replace('text-gray-900', 'text-white');
sidebarContent = sidebarContent.replace('shadow-[inset_4px_0_0_0_#16a34a]', 'shadow-[inset_4px_0_0_0_#22c55e]');
sidebarContent = sidebarContent.replace("bg-green-50 text-green-900", "bg-green-900/30 text-green-400");
sidebarContent = sidebarContent.replace("hover:bg-gray-50 hover:text-gray-900", "hover:bg-white/5 hover:text-white");
fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);

// 3. MobileBottomNav.tsx
let mobileNavContent = fs.readFileSync('src/components/MobileBottomNav.tsx', 'utf-8');
mobileNavContent = mobileNavContent.replace('bg-white border-t border-gray-200 text-gray-500', 'bg-[#121E15] border-t border-white/5 text-gray-400');
mobileNavContent = mobileNavContent.replace("text-green-600", "text-green-400");
mobileNavContent = mobileNavContent.replace("hover:text-gray-900", "hover:text-white");
fs.writeFileSync('src/components/MobileBottomNav.tsx', mobileNavContent);

// 4. MobileHeader.tsx
let mobileHeaderContent = fs.readFileSync('src/components/MobileHeader.tsx', 'utf-8');
mobileHeaderContent = mobileHeaderContent.replace('bg-white/80 backdrop-blur-md border-b border-gray-200', 'bg-[#121E15]/80 backdrop-blur-md border-b border-white/5');
mobileHeaderContent = mobileHeaderContent.replace('text-gray-900', 'text-white');
mobileHeaderContent = mobileHeaderContent.replace('bg-green-100', 'bg-green-500/20');
mobileHeaderContent = mobileHeaderContent.replace('text-gray-500', 'text-gray-400');
fs.writeFileSync('src/components/MobileHeader.tsx', mobileHeaderContent);

