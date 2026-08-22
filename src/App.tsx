/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Routes, Route } from 'react-router-dom';
import Communication from './components/Communication';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import CommandCenter from './components/CommandCenter';
import LiveMonitoring from './components/LiveMonitoring';
import Alerts from './components/Alerts';
import IncidentDetailsPage from './components/IncidentDetailsPage';
import IotNetwork from './components/IotNetwork';
import ReportsDashboard from './components/ReportsDashboard';
import SettingsDashboard from './components/SettingsDashboard';
import SimulationDashboard from './components/SimulationDashboard';

import { useState } from 'react';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      {/* GLOBAL GREEN TREES TEXTURE BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
        <div className="absolute bottom-0 left-0 right-0 h-[300px] w-full" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 20 L90 70 L76 70 L100 110 L20 110 L44 70 L30 70 Z' fill='%23047857'/%3E%3Crect x='52' y='110' width='16' height='10' fill='%23064e3b'/%3E%3C/svg%3E")`, backgroundSize: '100px 100px', backgroundPosition: 'bottom' }} />
        <div className="absolute top-0 bottom-0 left-0 w-8 md:w-16 h-full" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 20 L90 70 L76 70 L100 110 L20 110 L44 70 L30 70 Z' fill='%23047857'/%3E%3C/svg%3E")`, backgroundSize: '40px 40px', backgroundRepeat: 'repeat-y' }} />
        <div className="absolute top-0 bottom-0 right-0 w-8 md:w-16 h-full" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 20 L90 70 L76 70 L100 110 L20 110 L44 70 L30 70 Z' fill='%23047857'/%3E%3C/svg%3E")`, backgroundSize: '40px 40px', backgroundRepeat: 'repeat-y' }} />
      </div>

      <main className="flex-1 px-4 pt-20 pb-[calc(env(safe-area-inset-bottom)+70px)] md:p-6 w-full min-h-screen relative flex flex-col z-10">
        <div className="max-w-7xl mx-auto flex flex-col relative flex-1 w-full">
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/monitoring" element={<LiveMonitoring />} />
            <Route path="/incidents" element={<Alerts />} />
            <Route path="/incidents/:id" element={<IncidentDetailsPage />} />
            <Route path="/sensors" element={<IotNetwork />} />
            <Route path="/communication" element={<Communication />} />
                        <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="/settings" element={<SettingsDashboard />} />
            <Route path="/simulation" element={<SimulationDashboard />} />
          </Routes>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
