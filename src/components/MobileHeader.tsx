import { useLocation } from 'react-router-dom';
import { TreePine } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SystemService } from '../services/systemService';

const routeNames: Record<string, string> = {
  '/': 'Command Center',
  '/monitoring': 'Live Map',
  '/incidents': 'Incidents',
  '/risk': 'Risk & Forecast',
  '/satellite': 'Satellite',
  '/sensors': 'IoT Network',
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function MobileHeader() {
  const location = useLocation();
  const [status, setStatus] = useState<string>('LIVE');
  
  // Clean up paths like /incidents/INC-123
  let currentPath = location.pathname;
  if (currentPath.startsWith('/incidents/')) {
    currentPath = '/incidents';
  }
  
  const pageTitle = routeNames[currentPath] || 'VanRakshak';

  useEffect(() => {
    SystemService.getStatus().then((s) => {
      setStatus(s.overallHealth === 'operational' ? 'LIVE' : 'ERROR');
    });
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50 md:hidden h-14 flex items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <TreePine className="w-5 h-5 text-green-600" />
        </div>
      </div>
      
      <div className="flex-1 flex justify-center">
        <h1 className="text-sm font-bold text-gray-900 truncate px-2">{pageTitle}</h1>
      </div>
      
      <div className="flex items-center justify-end min-w-[60px]">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded border border-green-100">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[9px] font-bold text-green-700 uppercase tracking-wider">{status}</span>
        </div>
      </div>
    </header>
  );
}
