import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudSun, Calendar, MapPin, 
  Flame, TreePine, Wifi, AlertTriangle, 
  Leaf, ChevronRight, Activity, Satellite, Cpu, Truck, Clock, ThermometerSun
} from 'lucide-react';
import { FireService } from '../services/fireService';
import { RiskService } from '../services/riskService';
import { SatelliteService } from '../services/satelliteService';
import { IotService } from '../services/iotService';
import { FireIncident, DistrictRisk, SatelliteStatus, IotSensor } from '../types';
import bannerImg from '../assets/banner.png';

// Simple SVG sparkline component
const Sparkline = ({ color, data }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 60},${20 - ((d - min) / range) * 20}`).join(' ');
  return (
    <svg width="60" height="24" className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function CommandCenter() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  const [risks, setRisks] = useState<DistrictRisk[]>([]);
  const [satellite, setSatellite] = useState<SatelliteStatus[]>([]);
  const [sensors, setSensors] = useState<IotSensor[]>([]);

  useEffect(() => {
    FireService.getIncidents().then(setIncidents);
    RiskService.getDistrictRisks().then(setRisks);
    SatelliteService.getStatus().then(setSatellite);
    IotService.getSensors().then(setSensors);
  }, []);

  const activeIncidents = incidents.filter(i => ['detected', 'verifying', 'confirmed', 'responding'].includes(i.status));
  const extremeRisks = risks.filter(r => r.riskClass === 'Extreme');
  const totalBurnedArea = incidents.reduce((sum, i) => sum + i.impact.areaAffectedHa, 0);

  const iotConnected = sensors.filter(s => s.status === 'Normal').length;
  const iotAnomalies = sensors.filter(s => s.status === 'Fire Anomaly').length;
  const iotOffline = sensors.filter(s => s.status === 'Offline').length;
  const iotWarnings = sensors.filter(s => s.status === 'Warning').length;

  const recentTimeline = incidents
    .flatMap(i => i.history.map(h => ({ ...h, incidentId: i.id, title: i.title })))
    .reverse()
    .slice(0, 5);

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto space-y-6 pb-12">
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Welcome, Forest Official <span className="text-xl">👋</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time Forest Fire Detection System - Chhattisgarh</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <CloudSun className="w-6 h-6 text-yellow-500" />
            <div>
              <div className="text-sm font-bold text-gray-900">32°C</div>
              <div className="text-[10px] text-gray-500">Raipur, Chhattisgarh</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm font-bold text-gray-900">19 May 2025</div>
              <div className="text-[10px] text-gray-500">10:30 AM</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">System Status</div>
              <div className="text-sm font-semibold text-gray-900">All Systems Operational</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative w-full h-[280px] rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-gray-900">
        <img 
          src={bannerImg} 
          alt="Dashboard Banner" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        
        {/* Glassmorphism Text Box to ensure text is readable regardless of the uploaded image */}
        <div className="absolute inset-0 flex flex-col justify-center p-10 max-w-2xl z-10">
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 w-max">
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
              Protecting Chhattisgarh\'s <br/>
              <span className="text-green-400">Forests in Real-time</span>
            </h2>
            <p className="text-gray-200 text-sm mb-6 max-w-lg leading-relaxed">
              AI-powered monitoring using IoT sensors and satellite imagery for early fire detection and faster response.
            </p>
            <button 
              onClick={() => navigate('/monitoring')}
              className="flex items-center gap-2 bg-white/90 hover:bg-white text-green-900 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm w-max"
            >
              <MapPin className="w-4 h-4" /> View Live Map
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold text-gray-500">Active Alerts</div>
              <div className="text-2xl font-black text-gray-900 mt-1">7</div>
            </div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="text-[10px] font-bold text-red-500">+2 since last hour</div>
            <Sparkline color="#ef4444" data={[2, 3, 2, 4, 3, 5, 7]} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <TreePine className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold text-gray-500">Monitored Zones</div>
              <div className="text-2xl font-black text-gray-900 mt-1">128</div>
            </div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="text-[10px] font-bold text-gray-500">Across Chhattisgarh</div>
            <Sparkline color="#22c55e" data={[100, 110, 120, 115, 125, 128, 128]} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Wifi className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold text-gray-500">Sensors Online</div>
              <div className="text-2xl font-black text-gray-900 mt-1">256</div>
            </div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="text-[10px] font-bold text-gray-500">Out of 270</div>
            <Sparkline color="#3b82f6" data={[240, 245, 250, 248, 255, 252, 256]} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold text-gray-500">Fires Detected Today</div>
              <div className="text-2xl font-black text-gray-900 mt-1">3</div>
            </div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="text-[10px] font-bold text-orange-500">+1 since yesterday</div>
            <Sparkline color="#f97316" data={[1, 0, 2, 1, 3, 2, 3]} />
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold text-gray-500">Area at Risk</div>
              <div className="text-2xl font-black text-gray-900 mt-1">12.4 <span className="text-sm font-bold text-gray-500">km²</span></div>
            </div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="text-[10px] font-bold text-gray-500">High Risk Zones</div>
            <Sparkline color="#9333ea" data={[10, 10.5, 11, 12, 11.8, 12.2, 12.4]} />
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl pr-5 pl-6 pt-[47px] pb-[42px] flex items-center justify-between shadow-sm overflow-hidden relative">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-green-900 mb-0.5">Early Detection. Faster Response. Greener Tomorrow.</h3>
            <p className="text-xs text-green-700">Together, we can safeguard our forests and wildlife.</p>
          </div>
        </div>
        
        {/* Simple CSS-based forest silhouette decoration */}
        <div className="absolute right-0 bottom-0 h-full w-1/3 opacity-30 flex items-end justify-end pointer-events-none">
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-16 fill-green-800">
             <path d="M180,60 L180,20 L190,40 L190,60 Z M160,60 L160,30 L170,50 L170,60 Z M130,60 L130,10 L140,40 L150,20 L160,60 Z M100,60 L100,25 L115,50 L120,35 L135,60 Z M70,60 L75,15 L90,45 L105,60 Z" />
          </svg>
        </div>
      </div>

      <div className="pt-6 pb-2">
        <h2 className="text-xl font-bold text-gray-900">Intelligence Grid</h2>
      </div>

      {/* 4-Column Intelligence Grid (Restored from old UI) */}
      <div className="grid grid-cols-4 gap-6">
        {/* Risk Overview */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ThermometerSun className="w-4 h-4 text-orange-500" /> District Risk
          </h3>
          <div className="flex justify-between mb-4 pb-4 border-b border-gray-100">
            <div className="text-center"><div className="text-xl font-black text-red-600">{extremeRisks.length}</div><div className="text-[10px] font-bold text-gray-500 uppercase">Extreme</div></div>
            <div className="text-center"><div className="text-xl font-black text-red-500">{risks.filter(r => r.riskClass === 'Very High').length}</div><div className="text-[10px] font-bold text-gray-500 uppercase">V. High</div></div>
            <div className="text-center"><div className="text-xl font-black text-orange-500">{risks.filter(r => r.riskClass === 'High').length}</div><div className="text-[10px] font-bold text-gray-500 uppercase">High</div></div>
          </div>
          <div className="space-y-2">
            {risks.slice(0, 3).map((r, idx) => (
              <div key={r.id} className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{idx + 1}. {r.district}</span>
                <span className="font-bold text-gray-900">{r.riskScore}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Satellite Activity */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Satellite className="w-4 h-4 text-blue-500" /> Satellite Feed
          </h3>
          <div className="space-y-3">
            {satellite.map(sat => (
              <div key={sat.name} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <div className="text-xs font-bold text-gray-900">{sat.name} Pass</div>
                  <div className="text-[10px] text-gray-500">Latest: {sat.latestPass}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-gray-900">{sat.detectionCount}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Detections</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IoT Network */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-500" /> IoT Network
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-green-50 rounded-lg border border-green-100 text-center">
              <div className="text-lg font-black text-green-700">{iotConnected}</div>
              <div className="text-[10px] font-bold text-green-700 uppercase">Connected</div>
            </div>
            <div className="p-2 bg-red-50 rounded-lg border border-red-100 text-center">
              <div className="text-lg font-black text-red-700">{iotAnomalies}</div>
              <div className="text-[10px] font-bold text-red-700 uppercase">Anomalies</div>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-100 text-center">
              <div className="text-lg font-black text-yellow-700">{iotWarnings}</div>
              <div className="text-[10px] font-bold text-yellow-700 uppercase">Warnings</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-black text-gray-700">{iotOffline}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase">Offline</div>
            </div>
          </div>
        </div>

        {/* Response Status */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-500" /> Response Status
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-end mb-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Active Teams</div>
                <div className="text-sm font-bold text-gray-900">{activeIncidents.filter(i => i.status === 'responding').length * 2} Dispatched</div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-3/4"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <Clock className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">System Avg ETA</div>
                <div className="text-lg font-black text-emerald-700">~24 Mins</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Timeline & Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Recent Activity</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recentTimeline.map((ev, idx) => (
              <div key={idx} className="shrink-0 w-64 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 mb-1">{ev.timestamp}</div>
                <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">{ev.description}</div>
                <div className="text-[10px] font-bold text-blue-600 uppercase">Ref: {ev.incidentId}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-80 xl:w-[400px] bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/monitoring')} className="p-3 bg-gray-900 text-white shadow-sm rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 flex items-center justify-between transition-all">
              Live Map <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/incidents')} className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-100 flex items-center justify-between transition-colors">
              Critical Fires <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/risk')} className="p-3 bg-orange-50 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-orange-100 flex items-center justify-between transition-colors">
              Risk Map <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/reports')} className="p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-100 flex items-center justify-between transition-colors">
              Reports <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
