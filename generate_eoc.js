import fs from 'fs';

const content = `
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RefreshCw, CloudSun, Flame, ShieldAlert, Activity, Satellite, Cpu, Truck, 
  Clock, ThermometerSun, Radio, Wifi, Server, Wind, Droplets, Navigation,
  AlertTriangle, Crosshair, MapPin, Zap, ChevronRight, Eye, Layers
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { FireService } from '../services/fireService';
import { RiskService } from '../services/riskService';
import { SatelliteService } from '../services/satelliteService';
import { IotService } from '../services/iotService';
import { FireIncident, DistrictRisk, SatelliteStatus, IotSensor } from '../types';

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'moderate': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
    default: return 'text-gray-400 bg-white/5 border-white/10';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'detected': return 'text-yellow-400';
    case 'verifying': return 'text-orange-400';
    case 'confirmed': return 'text-red-400';
    case 'responding': return 'text-purple-400';
    case 'contained': return 'text-blue-400';
    case 'extinguished': return 'text-green-400';
    default: return 'text-gray-400';
  }
};

export default function CommandCenter() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  const [sensors, setSensors] = useState<IotSensor[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    FireService.getIncidents().then(setIncidents);
    IotService.getSensors().then(setSensors);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await FireService.refreshIncidents();
    const updatedIncidents = await FireService.getIncidents();
    setIncidents(updatedIncidents);
    setIsSyncing(false);
  };

  const activeIncidents = incidents.filter(i => ['detected', 'verifying', 'confirmed', 'responding'].includes(i.status));
  const criticalIncidents = incidents.filter(i => i.severity === 'critical' && i.status !== 'extinguished');
  
  // Highest priority incident for the banner
  const topPriority = criticalIncidents.length > 0 ? criticalIncidents[0] : activeIncidents[0];

  const mapCenter = topPriority ? [topPriority.location.coordinates.lat, topPriority.location.coordinates.lng] : [21.2514, 81.6296];

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto space-y-6 pb-12 pr-2">
      
      {/* Header section */}
      <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            AFIRN Command Officer <span className="text-xl">👋</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Adaptive Forest Intelligence & Response Network (AFIRN)</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-xl px-4 py-2.5 shadow-sm text-sm font-bold transition-all"
          >
            <RefreshCw className={\`w-4 h-4 \${isSyncing ? 'animate-spin' : ''}\`} />
            {isSyncing ? 'Syncing FIRMS...' : 'Sync Data'}
          </button>
        </div>
      </div>

      {/* TOP PRIORITY BANNER */}
      {topPriority && (
        <div className="w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden shrink-0 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="flex items-start lg:items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Flame className="w-7 h-7 text-red-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-bold text-white">Current Highest Priority Fire</h2>
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Critical</span>
                <span className="bg-white/10 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded border border-white/10 uppercase">{topPriority.id}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Crosshair className="w-4 h-4 text-gray-400" />
                  <span>Conf: <strong className="text-white">{topPriority.latestConfidence || topPriority.detection.confidence}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Wind className="w-4 h-4 text-orange-400" />
                  <span>Spread: <strong className="text-orange-400">0.5 km/h N</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>Nearest Village: <strong className="text-white">Achanakmar (2.1km)</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span>Water: <strong className="text-white">Maniari River (1.2km)</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>T+ 45 mins</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <button className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg transition-colors">
              Respond Now
            </button>
            <button 
              onClick={() => navigate(\`/incidents/\${topPriority.id}\`)}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl border border-white/10 transition-colors"
            >
              Open Incident Command
            </button>
          </div>
        </div>
      )}

      {/* MAIN DASHBOARD SPLIT */}
      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[800px]">
        
        {/* LEFT COLUMN: Map & Queue (55%) */}
        <div className="w-full lg:w-[55%] flex flex-col gap-6 h-full">
          
          {/* LIVE MAP */}
          <div className="bg-[#121E15] rounded-2xl border border-white/5 shadow-sm overflow-hidden flex flex-col flex-1 min-h-[400px]">
            <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-[#152318]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" /> Live Forest Map
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded">Tactical View</span>
              </div>
            </div>
            <div className="flex-1 relative z-0">
              <MapContainer 
                center={mapCenter as [number, number]} 
                zoom={9} 
                style={{ height: '100%', width: '100%', background: '#0B120C' }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                {activeIncidents.map(inc => (
                  <Marker 
                    key={inc.id}
                    position={[inc.location.coordinates.lat, inc.location.coordinates.lng]}
                    icon={L.divIcon({
                      className: 'bg-transparent border-0',
                      html: \`<div class="w-6 h-6 \${inc.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'} rounded-full flex items-center justify-center border-2 border-white/20 shadow-[0_0_10px_rgba(239,68,68,0.5)]"><div class="w-2 h-2 bg-white rounded-full"></div></div>\`,
                      iconSize: [24, 24],
                      iconAnchor: [12, 12]
                    })}
                  >
                    <Popup className="eoc-popup">
                      <div className="p-1">
                        <div className="font-bold text-gray-900">{inc.id}</div>
                        <div className="text-xs text-gray-600 capitalize">{inc.severity} Severity</div>
                        <button onClick={() => navigate(\`/incidents/\${inc.id}\`)} className="mt-2 text-[10px] bg-red-600 text-white px-2 py-1 rounded w-full font-bold">Open Command</button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* OPERATIONAL QUEUE */}
          <div className="bg-[#121E15] rounded-2xl border border-white/5 shadow-sm overflow-hidden flex flex-col shrink-0">
            <div className="px-4 py-3 border-b border-white/5 bg-[#152318] flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" /> Operational Queue
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 border-b border-white/5">Incident ID</th>
                    <th className="px-4 py-3 border-b border-white/5">Beat</th>
                    <th className="px-4 py-3 border-b border-white/5">Conf.</th>
                    <th className="px-4 py-3 border-b border-white/5">Severity</th>
                    <th className="px-4 py-3 border-b border-white/5">Status</th>
                    <th className="px-4 py-3 border-b border-white/5">Assigned</th>
                    <th className="px-4 py-3 border-b border-white/5">Time</th>
                    <th className="px-4 py-3 border-b border-white/5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeIncidents.slice(0, 5).map(inc => (
                    <tr key={inc.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-bold text-white">{inc.id}</td>
                      <td className="px-4 py-3 text-gray-400">{inc.location.beat}</td>
                      <td className="px-4 py-3 font-bold text-white">{inc.latestConfidence || inc.detection.confidence}%</td>
                      <td className="px-4 py-3">
                        <span className={\`px-2 py-0.5 rounded text-[10px] font-bold uppercase border \${getSeverityColor(inc.severity)}\`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold capitalize"><span className={getStatusColor(inc.status)}>{inc.status}</span></td>
                      <td className="px-4 py-3 text-gray-400">{inc.status === 'responding' ? 'PU-01 Bravo' : 'Pending'}</td>
                      <td className="px-4 py-3 text-gray-400">{inc.detection.time}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => navigate(\`/incidents/\${inc.id}\`)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {activeIncidents.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500 font-medium">
                        No active incidents in the operational queue.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN: Dashboards (45%) */}
        <div className="w-full lg:w-[45%] flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* OPERATIONAL OVERVIEW */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            <div className="bg-[#121E15] p-3 rounded-xl border border-white/5 flex flex-col justify-center shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Critical</div>
              <div className="text-2xl font-black text-red-500">{criticalIncidents.length}</div>
            </div>
            <div className="bg-[#121E15] p-3 rounded-xl border border-white/5 flex flex-col justify-center shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">High</div>
              <div className="text-2xl font-black text-orange-500">{incidents.filter(i => i.severity === 'high' && i.status !== 'extinguished').length}</div>
            </div>
            <div className="bg-[#121E15] p-3 rounded-xl border border-white/5 flex flex-col justify-center shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Active</div>
              <div className="text-2xl font-black text-white">{activeIncidents.length}</div>
            </div>
            <div className="bg-[#121E15] p-3 rounded-xl border border-white/5 flex flex-col justify-center shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Contained Today</div>
              <div className="text-2xl font-black text-blue-400">{incidents.filter(i => i.status === 'contained').length}</div>
            </div>
          </div>

          {/* FIRE CONFIDENCE ENGINE */}
          <div className="bg-[#121E15] rounded-2xl border border-white/5 p-4 shadow-sm shrink-0">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-purple-400" /> Fire Confidence Engine
            </h3>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-red-500" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-white">92%</span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase">Confidence</span>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-2 rounded border border-white/5">
                  <div className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Satellite (NASA)</div>
                  <div className="text-xs font-bold text-white">95% (VIIRS)</div>
                </div>
                <div className="bg-white/5 p-2 rounded border border-white/5">
                  <div className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">IoT Sensors</div>
                  <div className="text-xs font-bold text-yellow-400">CO2 Anomaly</div>
                </div>
                <div className="bg-white/5 p-2 rounded border border-white/5">
                  <div className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">AI Camera</div>
                  <div className="text-xs font-bold text-gray-400">No Visual</div>
                </div>
                <div className="bg-white/5 p-2 rounded border border-white/5">
                  <div className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Forest Zone</div>
                  <div className="text-xs font-bold text-red-400">Verified Core</div>
                </div>
              </div>
            </div>
          </div>

          {/* FIRE INTELLIGENCE */}
          <div className="bg-[#121E15] rounded-2xl border border-white/5 p-4 shadow-sm shrink-0">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ThermometerSun className="w-4 h-4 text-orange-400" /> Fire Intelligence
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1"><Wind className="w-3 h-3"/> Wind</div>
                <div className="text-sm font-bold text-white">12 km/h NE</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1"><Droplets className="w-3 h-3"/> Humidity</div>
                <div className="text-sm font-bold text-orange-400">18% (Critical)</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1"><Flame className="w-3 h-3"/> Fuel Moist.</div>
                <div className="text-sm font-bold text-red-400">Very Dry</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 col-span-3 flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Estimated Spread Direction</div>
                  <div className="text-sm font-bold text-white">Moving North-East towards Sector 4</div>
                </div>
                <Navigation className="w-6 h-6 text-orange-500 transform rotate-45" />
              </div>
            </div>
          </div>

          {/* SENSOR NETWORK */}
          <div className="bg-[#121E15] rounded-2xl border border-white/5 p-4 shadow-sm shrink-0 cursor-pointer hover:bg-[#152318] transition-colors" onClick={() => navigate('/sensors')}>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-blue-400" /> Sensor Network</div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </h3>
            <div className="flex justify-between items-center gap-2">
              <div className="text-center flex-1">
                <div className="text-lg font-black text-green-400">142</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase">Online</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-lg font-black text-gray-400">850</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase">Sleeping</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-lg font-black text-yellow-400">12</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase">Alert</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-lg font-black text-red-500">3</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase">Fire Mode</div>
              </div>
            </div>
          </div>

          {/* COMMUNICATION STATUS */}
          <div className="bg-[#121E15] rounded-2xl border border-white/5 p-4 shadow-sm shrink-0 cursor-pointer hover:bg-[#152318] transition-colors" onClick={() => navigate('/communication')}>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><Radio className="w-4 h-4 text-cyan-400" /> Communication Status</div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
                <span className="text-[10px] font-bold text-gray-300">LoRa Mesh</span>
                <span className="text-[10px] font-bold text-green-400">98% UP</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
                <span className="text-[10px] font-bold text-gray-300">Gateway</span>
                <span className="text-[10px] font-bold text-green-400">5/5 Online</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
                <span className="text-[10px] font-bold text-gray-300">Cellular</span>
                <span className="text-[10px] font-bold text-yellow-400">Degraded</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
                <span className="text-[10px] font-bold text-gray-300">Satellite Uplink</span>
                <span className="text-[10px] font-bold text-green-400">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
`

fs.writeFileSync('src/components/CommandCenter.tsx', content);

