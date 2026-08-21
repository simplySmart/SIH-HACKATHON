import { NavLink } from 'react-router-dom';
import {
  Bell,
  LayoutDashboard,
  Activity,
  BarChart2,
  Satellite,
  Cpu,
  FileText,
  Settings,
  TreePine,
  ChevronDown,
  ThermometerSun,
  Radio, 
  Truck,
  PlayCircle
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Operations Center', path: '/' },
    { icon: Bell, label: 'Active Incidents', path: '/incidents' },
    { icon: Activity, label: 'Live Forest Map', path: '/monitoring' },
    { icon: Cpu, label: 'Sensor Network', path: '/sensors' },
    { icon: Radio, label: 'Communication', path: '/communication' },
    { icon: Truck, label: 'Patrol Units', path: '/patrols' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: PlayCircle, label: 'SIH Simulation', path: '/simulation' },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-[#121E15] border-r border-white/5 text-gray-400 flex-col h-screen fixed left-0 top-0 z-20 shadow-sm">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
          <TreePine className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h1 className="text-white font-bold text-lg leading-tight truncate">AFIRN</h1>
          <p className="text-[11px] text-gray-500 truncate">Command & Control System</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-green-900/30 text-green-400 shadow-[inset_4px_0_0_0_#22c55e]'
                  : 'hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="font-medium text-sm text-left">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User"
            className="w-9 h-9 rounded-full bg-gray-100 shrink-0"
          />
          <div className="flex-1 overflow-hidden">
            <h4 className="text-white text-sm font-medium truncate">Cmdr. Verma</h4>
            <p className="text-[10px] text-gray-500 truncate">Officer in Charge</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
