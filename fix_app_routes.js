import fs from 'fs';

// 1. App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
const importsAdd = `import Communication from './components/Communication';
import PatrolUnits from './components/PatrolUnits';\n`;
appContent = appContent.replace("import Sidebar from './components/Sidebar';", importsAdd + "import Sidebar from './components/Sidebar';");

const oldRoutes = `<Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/monitoring" element={<LiveMonitoring />} />
            <Route path="/incidents" element={<Alerts />} />
            <Route path="/incidents/:id" element={<IncidentDetailsPage />} />
            <Route path="/risk" element={<RiskDashboard />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/satellite" element={<SatelliteIntelligence />} />
            <Route path="/sensors" element={<IotNetwork />} />
            <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="/settings" element={<SettingsDashboard />} />
          </Routes>`;
const newRoutes = `<Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/monitoring" element={<LiveMonitoring />} />
            <Route path="/incidents" element={<Alerts />} />
            <Route path="/incidents/:id" element={<IncidentDetailsPage />} />
            <Route path="/sensors" element={<IotNetwork />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/patrols" element={<PatrolUnits />} />
            <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="/settings" element={<SettingsDashboard />} />
          </Routes>`;
appContent = appContent.replace(oldRoutes, newRoutes);
fs.writeFileSync('src/App.tsx', appContent);

// 2. Sidebar.tsx
let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
sidebarContent = sidebarContent.replace("import { NavLink } from 'react-router-dom';", "import { NavLink } from 'react-router-dom';\nimport { Radio, Truck } from 'lucide-react';");
const oldNavItems = `  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Activity, label: 'Live Monitoring', path: '/monitoring' },
    { icon: Bell, label: 'Incidents', path: '/incidents' },
    { icon: ThermometerSun, label: 'Risk & Forecast', path: '/risk' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Satellite, label: 'Satellite View', path: '/satellite' },
    { icon: Cpu, label: 'IoT Sensors', path: '/sensors' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];`;
const newNavItems = `  const navItems = [
    { icon: LayoutDashboard, label: 'Operations Center', path: '/' },
    { icon: Bell, label: 'Active Incidents', path: '/incidents' },
    { icon: Activity, label: 'Live Forest Map', path: '/monitoring' },
    { icon: Cpu, label: 'Sensor Network', path: '/sensors' },
    { icon: Radio, label: 'Communication', path: '/communication' },
    { icon: Truck, label: 'Patrol Units', path: '/patrols' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];`;
sidebarContent = sidebarContent.replace(oldNavItems, newNavItems);
sidebarContent = sidebarContent.replace("VanRakshak", "AFIRN");
sidebarContent = sidebarContent.replace("Forest Fire Detection", "Command & Control System");
fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);

// 3. MobileBottomNav.tsx
let mobileNavContent = fs.readFileSync('src/components/MobileBottomNav.tsx', 'utf-8');
const oldMobileItems = `  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: Activity, label: 'Map', path: '/monitoring' },
    { icon: Bell, label: 'Alerts', path: '/incidents' },
    { icon: ThermometerSun, label: 'Risk', path: '/risk' },
  ];`;
const newMobileItems = `  const navItems = [
    { icon: LayoutDashboard, label: 'Ops', path: '/' },
    { icon: Bell, label: 'Incidents', path: '/incidents' },
    { icon: Activity, label: 'Map', path: '/monitoring' },
    { icon: Cpu, label: 'Sensors', path: '/sensors' },
  ];`;
mobileNavContent = mobileNavContent.replace(oldMobileItems, newMobileItems);
fs.writeFileSync('src/components/MobileBottomNav.tsx', mobileNavContent);
