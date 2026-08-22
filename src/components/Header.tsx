import { useLocation } from 'react-router-dom';
import { TreePine, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SystemService } from '../services/systemService';

const routeNames: Record<string, string> = {
  '/': 'Command Center',
  '/monitoring': 'Live Map',
  '/incidents': 'Incidents',
  '/sensors': 'IoT Network',
  '/communication': 'Communication',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/simulation': 'Simulation',
};

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();
  const [status, setStatus] = useState<string>('LIVE');
  
  let currentPath = location.pathname;
  if (currentPath.startsWith('/incidents/')) {
    currentPath = '/incidents';
  }
  
  const pageTitle = routeNames[currentPath] || 'VANDRISHTI';

  useEffect(() => {
    SystemService.getStatus().then((s) => {
      setStatus(s.overallHealth === 'operational' ? 'LIVE' : 'ERROR');
    });
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-[40] h-[calc(3.5rem+env(safe-area-inset-top))] flex items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600 hidden md:block">
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
          <TreePine className="w-5 h-5 text-emerald-600" />
        </div>
        <h1 className="text-sm font-bold text-slate-900 hidden md:block">VANDRISHTI</h1>
      </div>
      
      <div className="flex-1 flex justify-center md:hidden">
        <h1 className="text-sm font-bold text-slate-900 truncate px-2">{pageTitle}</h1>
      </div>
      
      <div className="flex items-center justify-end min-w-[60px]">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-md border border-emerald-100 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">{status}</span>
        </div>
      </div>
    </header>
  );
}
