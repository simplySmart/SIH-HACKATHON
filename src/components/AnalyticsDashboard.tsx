import { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { Filter, MapPin, Calendar, Activity, AlertTriangle, TrendingUp, Clock, Flame, ShieldCheck } from 'lucide-react';
import { FireService } from '../services/fireService';
import { FireIncident } from '../types';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'];
const SEVERITY_COLORS = {
  low: '#3b82f6',
  moderate: '#eab308',
  high: '#f97316',
  critical: '#ef4444'
};

export default function AnalyticsDashboard() {
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [timeRange, setTimeRange] = useState<string>('7d');

  useEffect(() => {
    FireService.getIncidents().then(setIncidents);
  }, []);

  // Mock historical data generation for charts to make them look populated
  const generateTimeSeries = () => {
    const data = [];
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    for (let i = days; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      data.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fires: Math.floor(Math.random() * 15) + (selectedDistrict !== 'All' ? 0 : 5),
        area: Math.floor(Math.random() * 100) + 10,
      });
    }
    return data;
  };

  const timeSeriesData = useMemo(() => generateTimeSeries(), [timeRange, selectedDistrict]);

  const filteredIncidents = useMemo(() => {
    if (selectedDistrict === 'All') return incidents;
    return incidents.filter(i => i.location.district === selectedDistrict);
  }, [incidents, selectedDistrict]);

  const totalFires = filteredIncidents.length;
  const activeFires = filteredIncidents.filter(i => ['detected', 'verifying', 'confirmed', 'responding'].includes(i.status)).length;
  const burnedArea = filteredIncidents.reduce((sum, i) => sum + i.impact.areaAffectedHa, 0);
  const avgResponseTime = 42; // Mock average response time in minutes
  const verificationRate = 94; // %

  const districtData = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach(i => {
      counts[i.location.district] = (counts[i.location.district] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [incidents]);

  const severityData = useMemo(() => {
    const counts: Record<string, number> = { low: 0, moderate: 0, high: 0, critical: 0 };
    filteredIncidents.forEach(i => {
      counts[i.severity] = (counts[i.severity] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: name.toUpperCase(), value, severity: name }));
  }, [filteredIncidents]);

  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredIncidents.forEach(i => {
      const src = i.detection.method;
      counts[src] = (counts[src] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: name.toUpperCase(), value }));
  }, [filteredIncidents]);

  const uniqueDistricts = Array.from(new Set(incidents.map(i => i.location.district)));

  return (
    <div className="flex flex-col h-full bg-[#F5F7F6] overflow-hidden rounded-3xl">
      <header className="px-6 py-5 shrink-0 flex justify-between items-center bg-white border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Operational Analytics</h1>
          <p className="text-sm text-gray-500 font-medium">System-wide intelligence and performance metrics.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mr-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-md border border-green-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">System Operational</span>
            </div>
            <span className="bg-orange-100 text-orange-800 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-orange-200">
              Demo Data
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
            <MapPin className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer"
            >
              <option value="All">All Districts (Chhattisgarh)</option>
              {uniqueDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Total Fires</span>
            </div>
            <div className="text-4xl font-black text-gray-900">{totalFires}</div>
            <div className="text-xs font-bold text-orange-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% from last period
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Active Fires</span>
            </div>
            <div className="text-4xl font-black text-red-600">{activeFires}</div>
            <div className="text-xs font-medium text-gray-500 mt-2">Currently requiring response</div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Burned Area</span>
            </div>
            <div className="text-4xl font-black text-gray-900">{burnedArea.toFixed(1)} <span className="text-lg text-gray-500">Ha</span></div>
            <div className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 rotate-180" /> -5% from last period
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Avg Response</span>
            </div>
            <div className="text-4xl font-black text-gray-900">{avgResponseTime} <span className="text-lg text-gray-500">min</span></div>
            <div className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 rotate-180" /> -8 mins from last period
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Verification Rate</span>
            </div>
            <div className="text-4xl font-black text-gray-900">{verificationRate}<span className="text-lg text-gray-500">%</span></div>
            <div className="text-xs font-medium text-gray-500 mt-2">True positive detections</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Timeline Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Incidents Over Time</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFires" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    itemStyle={{ color: '#0f172a' }}
                  />
                  <Area type="monotone" dataKey="fires" name="Fire Incidents" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorFires)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* District Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Incidents by District</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 'bold' }} width={80} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" name="Incidents" radius={[0, 4, 4, 0]}>
                    {districtData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Severity Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Severity Distribution</h3>
            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS] || COLORS[0]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-2xl font-black text-gray-900">{filteredIncidents.length}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Total</span>
              </div>
            </div>
          </div>

          {/* Source Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Detection Sources</h3>
            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-2xl font-black text-gray-900">{filteredIncidents.length}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Alerts</span>
              </div>
            </div>
          </div>

          {/* Area Burned Over Time */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Burned Area (Ha)</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSeriesData.slice(-14)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="area" name="Area (Ha)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
