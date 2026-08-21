const fs = require('fs');

// App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/bg-\[#0B120C\] font-sans text-gray-100/, "bg-slate-50 font-sans text-slate-900");
appContent = appContent.replace(/pb-\[calc\(env\(safe-area-inset-bottom\)\+80px\)\]/, "pb-[calc(env(safe-area-inset-bottom)+70px)]");
appContent = appContent.replace(/md:p-8/, "md:p-6");
fs.writeFileSync('src/App.tsx', appContent);

// Sidebar.tsx
let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
sidebarContent = sidebarContent.replace(/bg-\[#121E15\] border-white\/5 text-gray-400/, "bg-white border-slate-200 text-slate-600");
sidebarContent = sidebarContent.replace(/text-white font-bold text-lg/, "text-slate-900 font-bold text-lg");
sidebarContent = sidebarContent.replace(/text-gray-500/, "text-slate-500");
sidebarContent = sidebarContent.replace(/bg-green-900\/30 text-green-400 shadow-\[inset_4px_0_0_0_#22c55e\]/, "bg-emerald-50 text-emerald-700 shadow-[inset_4px_0_0_0_#047857]");
sidebarContent = sidebarContent.replace(/hover:bg-white\/5 hover:text-white/, "hover:bg-slate-50 hover:text-slate-900");
sidebarContent = sidebarContent.replace(/text-gray-400/g, "text-slate-400");
sidebarContent = sidebarContent.replace(/text-green-600/g, "text-emerald-600");
sidebarContent = sidebarContent.replace(/border-t border-white\/5/, "border-t border-slate-200");
sidebarContent = sidebarContent.replace(/bg-green-500\/20/g, "bg-emerald-100");
sidebarContent = sidebarContent.replace(/hover:bg-white\/5/g, "hover:bg-slate-50");
sidebarContent = sidebarContent.replace(/text-white text-sm/g, "text-slate-900 text-sm");
sidebarContent = sidebarContent.replace(/text-\[10px\] text-gray-500/g, "text-[10px] text-slate-500");
sidebarContent = sidebarContent.replace(
  /const navItems = \[[\s\S]*?\];/,
  `const navItems = [
    { icon: LayoutDashboard, label: 'Operations Center', path: '/' },
    { icon: Bell, label: 'Active Incidents', path: '/incidents' },
    { icon: Activity, label: 'Live Forest Map', path: '/monitoring' },
    { icon: Cpu, label: 'Sensor Network', path: '/sensors' },
    { icon: Radio, label: 'Communication', path: '/communication' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: PlayCircle, label: 'SIH Simulation', path: '/simulation' },
  ];`
);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);

// MobileBottomNav.tsx
let mobileNavContent = fs.readFileSync('src/components/MobileBottomNav.tsx', 'utf8');
mobileNavContent = mobileNavContent.replace(
  /const primaryItems = \[[\s\S]*?\];/,
  `const primaryItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Activity, label: 'Map', path: '/monitoring' },
    { icon: Bell, label: 'Incidents', path: '/incidents' },
    { icon: Cpu, label: 'Sensors', path: '/sensors' },
  ];`
);
mobileNavContent = mobileNavContent.replace(
  /const moreItems = \[[\s\S]*?\];/,
  `const moreItems = [
    { icon: Radio, label: 'Comms', path: '/communication' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];`
);
fs.writeFileSync('src/components/MobileBottomNav.tsx', mobileNavContent);

// MobileHeader.tsx
let mobileHeaderContent = fs.readFileSync('src/components/MobileHeader.tsx', 'utf8');
mobileHeaderContent = mobileHeaderContent.replace(/text-white/g, "text-slate-900");
fs.writeFileSync('src/components/MobileHeader.tsx', mobileHeaderContent);

console.log("Updated Layout and Navigation files");
