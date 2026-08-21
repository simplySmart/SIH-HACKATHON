/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F5F7F8] font-sans text-gray-900 overflow-hidden relative">
      <Sidebar />
      <MobileHeader />
      
      <main className="flex-1 md:ml-64 px-4 pt-20 pb-[calc(env(safe-area-inset-bottom)+80px)] md:p-8 overflow-y-auto w-full h-full">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <Routes>
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
          </Routes>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}



