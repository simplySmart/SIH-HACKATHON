import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Activity,
  Bell,
  ThermometerSun,
  Menu,
  X,
  Satellite,
  Cpu,
  BarChart2,
  FileText,
  Settings
} from 'lucide-react';

export default function MobileBottomNav() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();

  const primaryItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Activity, label: 'Monitor', path: '/monitoring' },
    { icon: Bell, label: 'Incidents', path: '/incidents' },
    { icon: ThermometerSun, label: 'Risk', path: '/risk' },
  ];

  const moreItems = [
    { icon: Satellite, label: 'Satellite', path: '/satellite' },
    { icon: Cpu, label: 'Sensors', path: '/sensors' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  // Close sheet when route changes
  useEffect(() => {
    setIsMoreOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Bottom Sheet Backdrop */}
      {isMoreOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <div 
        className={`fixed bottom-[calc(env(safe-area-inset-bottom)+60px)] left-0 right-0 bg-white rounded-t-3xl z-50 md:hidden transition-transform duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-gray-100 ${isMoreOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="p-4">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
          <h3 className="text-sm font-bold text-gray-900 mb-4 px-2">More Tools</h3>
          <div className="grid grid-cols-4 gap-4">
            {moreItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                onClick={() => setIsMoreOpen(false)}
                className={({ isActive }) => 
                  `flex flex-col items-center justify-center p-3 rounded-2xl gap-2 transition-colors ${
                    isActive ? 'bg-green-50 text-green-700' : 'text-gray-500 active:bg-gray-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-6 h-6 ${isActive ? 'text-green-400' : 'text-gray-500'}`} />
                    <span className="text-[10px] font-bold text-center">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-[60px]">
          {primaryItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) => 
                `flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-500 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-green-600 fill-green-50' : ''}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors ${
              isMoreOpen ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {isMoreOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
