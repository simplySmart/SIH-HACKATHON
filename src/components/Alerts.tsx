import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Maximize, 
  Search, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  AlertTriangle,
  ShieldAlert,
  Activity,
  CheckCircle,
  Eye,
  Radio
} from 'lucide-react';
import { FireIncident } from '../types';
import { FireService } from '../services/fireService';

export default function Alerts() {
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState<string>('All');
  const [incidents, setIncidents] = useState<FireIncident[]>([]);

  useEffect(() => {
    FireService.getIncidents().then(setIncidents);
    const unsubscribe = FireService.subscribe((updatedIncidents) => {
      setIncidents(updatedIncidents);
    });
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'verifying': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'confirmed': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'responding': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'contained': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'extinguished': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      default: return 'bg-white/10 text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'high': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'moderate': return <Activity className="w-5 h-5 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const metrics = {
    active: incidents.filter(i => ['detected', 'verifying', 'confirmed', 'responding'].includes(i.status)).length,
    critical: incidents.filter(i => i.severity === 'critical' && i.status !== 'extinguished').length,
    verifying: incidents.filter(i => i.status === 'verifying').length,
    responding: incidents.filter(i => i.status === 'responding').length,
    contained: incidents.filter(i => i.status === 'contained').length,
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filterTab === 'All') return true;
    return incident.status.toLowerCase() === filterTab.toLowerCase();
  });

  return (
    <div className="flex flex-col h-full bg-[#0f1912]/80 backdrop-blur-3xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/10 overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Incidents</h1>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-md border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">System Operational</span>
          </div>
          <span className="bg-orange-500/20 text-orange-300 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-orange-500/30">
            Demo Data
          </span>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors ml-2">
            <Bell className="w-5 h-5 text-gray-300" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Maximize className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </header>

      {/* Metrics */}
      <div className="flex md:grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 shrink-0 overflow-x-auto pb-2 snap-x">
        <div className="bg-[#121E15]/5 rounded-xl p-4 border border-white/10 min-w-[120px] snap-center">
          <div className="text-sm font-medium text-gray-400 mb-1">Active</div>
          <div className="text-2xl font-bold text-white">{metrics.active}</div>
        </div>
        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20 min-w-[120px] snap-center">
          <div className="text-sm font-medium text-red-600 mb-1">Critical</div>
          <div className="text-2xl font-bold text-red-400">{metrics.critical}</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 min-w-[120px] snap-center">
          <div className="text-sm font-medium text-orange-600 mb-1">Verifying</div>
          <div className="text-2xl font-bold text-orange-700">{metrics.verifying}</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 min-w-[120px] snap-center">
          <div className="text-sm font-medium text-purple-600 mb-1">Responding</div>
          <div className="text-2xl font-bold text-purple-700">{metrics.responding}</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 min-w-[120px] snap-center">
          <div className="text-sm font-medium text-blue-600 mb-1">Contained</div>
          <div className="text-2xl font-bold text-blue-700">{metrics.contained}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-white/10 mb-4 shrink-0 gap-4 md:gap-0">
        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {['All', 'Detected', 'Verifying', 'Confirmed', 'Responding', 'Contained', 'Extinguished'].map(tab => (
            <button 
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`pb-3 font-medium whitespace-nowrap relative ${filterTab === tab ? 'text-green-400 border-b-2 border-green-600' : 'text-gray-400 hover:text-gray-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 pb-3 overflow-x-auto hide-scrollbar">
          <div className="relative w-full md:w-auto">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2 bg-transparent border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 w-full md:w-48 xl:w-64 text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg text-sm text-gray-400 hover:bg-[#121E15]/5 transition-colors shrink-0">
            Severity
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg text-sm text-gray-400 hover:bg-[#121E15]/5 transition-colors shrink-0">
            Source
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* List / Table */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Cards View */}
        <div className="md:hidden grid grid-cols-1 gap-4 pb-4">
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map((incident) => (
              <div 
                key={incident.id} 
                className="bg-[#121E15]/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-[#121E15]/10 transition-colors"
                onClick={() => navigate(`/incidents/${incident.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-green-400 text-sm mb-0.5">{incident.id}</div>
                    <div className="text-xs text-gray-300 font-medium">{incident.location.district}, {incident.location.state}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(incident.severity)}
                    <span className="capitalize text-gray-400 font-medium">{incident.severity}</span>
                  </div>
                  <div className="text-gray-300 flex items-center gap-1.5 justify-end">
                    {incident.detection.method === 'satellite' ? <Radio className="w-3.5 h-3.5"/> : incident.detection.method === 'sensor' ? <Activity className="w-3.5 h-3.5"/> : <Eye className="w-3.5 h-3.5"/>}
                    <span className="capitalize">{incident.detection.method}</span>
                  </div>
                  <div className="text-gray-300">
                    <span className="text-gray-400 text-xs block mb-0.5">Confidence</span>
                    {incident.detection.confidence}%
                  </div>
                  <div className="text-gray-300 text-right">
                    <span className="text-gray-400 text-xs block mb-0.5">Est. Area</span>
                    {incident.impact.areaAffectedHa > 0 ? `${incident.impact.areaAffectedHa} ha` : '--'}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <div className="text-xs text-gray-400">
                    {new Date(incident.detection.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {new Date(incident.detection.time).toLocaleDateString()}
                  </div>
                  <button className="text-xs font-semibold text-green-400 flex items-center gap-1">
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400">
              No incidents match the selected filter.
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <table className="hidden md:table w-full text-left border-collapse">
          <thead className="sticky top-0 bg-transparent z-10">
            <tr>
              <th className="py-4 font-semibold text-xs uppercase tracking-wider text-gray-400">Incident ID & District</th>
              <th className="py-4 font-semibold text-xs uppercase tracking-wider text-gray-400">Time</th>
              <th className="py-4 font-semibold text-xs uppercase tracking-wider text-gray-400">Severity</th>
              <th className="py-4 font-semibold text-xs uppercase tracking-wider text-gray-400">Confidence</th>
              <th className="py-4 font-semibold text-xs uppercase tracking-wider text-gray-400">Est. Area</th>
              <th className="py-4 font-semibold text-xs uppercase tracking-wider text-gray-400">Source</th>
              <th className="py-4 font-semibold text-xs uppercase tracking-wider text-gray-400">Status</th>
              <th className="py-4 font-semibold text-xs uppercase tracking-wider text-gray-400 text-right pr-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.length > 0 ? (
              filteredIncidents.map((incident) => (
                <tr 
                  key={incident.id} 
                  className="border-b border-white/10 hover:bg-[#121E15]/5/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                >
                <td className="py-4 pr-4">
                  <div className="font-semibold text-green-400 text-sm mb-0.5">{incident.id}</div>
                  <div className="text-xs text-gray-300 font-medium">{incident.location.district}, {incident.location.state}</div>
                </td>
                <td className="py-4">
                  <div className="font-medium text-white text-sm">{new Date(incident.detection.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{new Date(incident.detection.time).toLocaleDateString()}</div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(incident.severity)}
                    <span className="text-sm font-medium capitalize text-gray-400">{incident.severity}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="font-medium text-white text-sm">{incident.detection.confidence}%</div>
                </td>
                <td className="py-4">
                  <div className="font-medium text-white text-sm">{incident.impact.areaAffectedHa > 0 ? `${incident.impact.areaAffectedHa} ha` : '--'}</div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1.5 text-gray-300">
                    {incident.detection.method === 'satellite' ? <Radio className="w-4 h-4"/> : incident.detection.method === 'sensor' ? <Activity className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    <span className="text-sm capitalize">{incident.detection.method}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </td>
                <td className="py-4 text-right pr-4">
                  <button 
                    className="px-3 py-1.5 bg-transparent border border-white/10 rounded-lg text-xs font-semibold text-gray-400 group-hover:border-green-300 group-hover:text-green-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/incidents/${incident.id}`);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400">
                  No incidents match the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
