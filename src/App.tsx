/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
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
    <div className="flex h-screen bg-[#F5F7F8] font-sans text-gray-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
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
    </div>
  );
}



