/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Routes, Route } from 'react-router-dom';
import Communication from './components/Communication';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import MobileBottomNav from './components/MobileBottomNav';
import CommandCenter from './components/CommandCenter';
import LiveMonitoring from './components/LiveMonitoring';
import Alerts from './components/Alerts';
import IncidentDetailsPage from './components/IncidentDetailsPage';
import IotNetwork from './components/IotNetwork';
import ReportsDashboard from './components/ReportsDashboard';
import SettingsDashboard from './components/SettingsDashboard';
import SimulationDashboard from './components/SimulationDashboard';

export default function App() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      <Sidebar />
      <MobileHeader />
      
      <main className="flex-1 md:ml-64 px-4 pt-20 pb-[calc(env(safe-area-inset-bottom)+70px)] md:p-6 w-full min-h-screen relative">
        <div className="max-w-7xl mx-auto flex flex-col relative min-h-[calc(100vh-120px)]">
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
