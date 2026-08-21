/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Routes, Route } from 'react-router-dom';
import Communication from './components/Communication';
import PatrolUnits from './components/PatrolUnits';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import MobileBottomNav from './components/MobileBottomNav';
import CommandCenter from './components/CommandCenter';
import LiveMonitoring from './components/LiveMonitoring';
import Alerts from './components/Alerts';
import IncidentDetailsPage from './components/IncidentDetailsPage';
import RiskDashboard from './components/RiskDashboard';
import SatelliteIntelligence from './components/SatelliteIntelligence';
import IotNetwork from './components/IotNetwork';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ReportsDashboard from './components/ReportsDashboard';
import SettingsDashboard from './components/SettingsDashboard';
import SimulationDashboard from './components/SimulationDashboard';

export default function App() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0B120C] font-sans text-gray-100 overflow-hidden relative">
      <Sidebar />
      <MobileHeader />
      
      <main className="flex-1 md:ml-64 px-4 pt-20 pb-[calc(env(safe-area-inset-bottom)+80px)] md:p-8 overflow-y-auto w-full h-full relative">
        <div className="max-w-7xl mx-auto h-full flex flex-col relative">
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/monitoring" element={<LiveMonitoring />} />
            <Route path="/incidents" element={<Alerts />} />
            <Route path="/incidents/:id" element={<IncidentDetailsPage />} />
            <Route path="/sensors" element={<IotNetwork />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/patrols" element={<PatrolUnits />} />
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
