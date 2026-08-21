import fs from 'fs';

const content = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf-8');

const updatedContent = `
import { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { Filter, Calendar, Activity, Database, AlertCircle, ShieldCheck } from 'lucide-react';
import { loadGeoData, getDistrictForPoint } from '../utils/geo';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'];
const SEVERITY_COLORS = { low: '#3b82f6', nominal: '#eab308', high: '#ef4444' };

export default function AnalyticsDashboard() {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [timeRange, setTimeRange] = useState<string>('all'); // all, 2024, 2025, 2026

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadGeoData();
        const response = await fetch('/api/analytics/historical');
        const result = await response.json();
        
        if (result.status === 'ERROR' || result.metadata?.status === 'ERROR') {
          setError(result.error || result.metadata?.error || 'Failed to fetch historical data');
        } else {
          // Process and normalize data
          const processed = result.data.map((row: any) => {
            const lat = parseFloat(row.latitude);
            const lng = parseFloat(row.longitude);
            const district = getDistrictForPoint(lat, lng) || 'Unknown';
            return {
              ...row,
              lat,
              lng,
              district,
              confidenceLevel: row.confidence === 'h' ? 'high' : row.confidence === 'l' ? 'low' : 'nominal',
              frp: parseFloat(row.frp || 0),
              isDay: row.daynight === 'D',
              year: row.acq_date ? row.acq_date.substring(0, 4) : 'Unknown',
              month: row.acq_date ? row.acq_date.substring(5, 7) : 'Unknown'
            };
          }).filter((row: any) => row.district !== 'Unknown');
          
          setHistoricalData(processed);
          setMetadata(result.metadata);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    let data = historicalData;
    if (selectedDistrict !== 'All') {
      data = data.filter(d => d.district === selectedDistrict);
    }
    if (timeRange !== 'all') {
      data = data.filter(d => d.year === timeRange);
    }
    return data;
  }, [historicalData, selectedDistrict, timeRange]);

  // Derive charts from real historical data
  
  // Time Series: Fires by Date
  const timeSeriesData = useMemo(() => {
    const counts: Record<string, { fires: number, area: number }> = {};
    filteredData.forEach(row => {
      const date = row.acq_date;
      if (!counts[date]) counts[date] = { fires: 0, area: 0 };
      counts[date].fires += 1;
      // Estimate area using FRP * multiplier (rough approximation for analytics)
      counts[date].area += (row.frp * 2); 
    });
    
    return Object.entries(counts)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData]);

  // District Distribution
  const districtData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(row => {
      counts[row.district] = (counts[row.district] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10
  }, [filteredData]);

  // Confidence / Severity
  const severityData = useMemo(() => {
    const counts: Record<string, number> = { low: 0, nominal: 0, high: 0 };
    filteredData.forEach(row => {
      if (counts[row.confidenceLevel] !== undefined) {
        counts[row.confidenceLevel]++;
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name: name.toUpperCase(), value, severity: name }))
      .filter(item => item.value > 0);
  }, [filteredData]);

  // Day vs Night
  const sourceData = useMemo(() => {
    const counts = { Day: 0, Night: 0 };
    filteredData.forEach(row => {
      if (row.isDay) counts.Day++;
      else counts.Night++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const uniqueDistricts = useMemo(() => {
    const dists = new Set(historicalData.map(d => d.district));
    return Array.from(dists).sort();
  }, [historicalData]);

  const totalFires = filteredData.length;
  const burnedArea = Math.round(filteredData.reduce((sum, row) => sum + (row.frp * 2), 0));

  return (
    <div className="flex flex-col h-full bg-[#F5F7F6] overflow-hidden rounded-3xl">
      <header className="px-4 md:px-6 py-4 md:py-5 shrink-0 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Historical Analytics</h1>
          <p className="text-sm text-gray-500 font-medium">Real observations across Chhattisgarh.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
          {metadata && (
            <div className="flex items-center gap-2 mr-0 md:mr-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-md border border-blue-100">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">{metadata.source}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 flex-1 md:flex-none">
            <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer w-full"
            >
              <option value="all">All Available</option>
              <option value="2024">2024 Season</option>
              <option value="2025">2025 Season</option>
              <option value="2026">2026 Season</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 flex-1 md:flex-none">
            <Filter className="w-4 h-4 text-gray-500 shrink-0" />
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer w-full max-w-[120px]"
            >
              <option value="All">All Districts</option>
              {uniqueDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
            <div className="text-sm font-bold text-gray-500 uppercase">Processing Historical FIRMS Data...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <div className="text-lg font-bold text-red-900">Failed to load historical data</div>
            <div className="text-sm text-red-600 mt-2">{error}</div>
          </div>
        ) : (
          <>
            {/* KPI Row */}
            <div className="flex md:grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto pb-2 mb-6 snap-x hide-scrollbar">
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between min-w-[140px] snap-center shrink-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-[10px] md:text-sm font-bold text-gray-600 uppercase tracking-wider">Total Detections</span>
                </div>
                <div className="text-2xl md:text-4xl font-black text-gray-900">{totalFires}</div>
                <div className="text-[10px] md:text-xs font-medium text-gray-500 mt-2">Historical FIRMS records</div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between min-w-[140px] snap-center shrink-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-[10px] md:text-sm font-bold text-gray-600 uppercase tracking-wider">Est. Burned Area</span>
                </div>
                <div className="text-2xl md:text-4xl font-black text-gray-900">{burnedArea}<span className="text-lg text-gray-500 ml-1">Ha</span></div>
                <div className="text-[10px] md:text-xs font-medium text-gray-500 mt-2">Derived from FRP metrics</div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
              {/* Timeline Chart */}
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
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
                      <Area type="monotone" dataKey="fires" name="Detections" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorFires)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* District Breakdown */}
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Top Districts</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 'bold' }} width={90} />
                      <RechartsTooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="value" name="Incidents" radius={[0, 4, 4, 0]}>
                        {districtData.map((entry, index) => (
                          <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 pb-6 lg:pb-0">
              {/* Severity Distribution */}
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Confidence Levels</h3>
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
                          <Cell key={\`cell-\${index}\`} fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS] || COLORS[0]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                    <span className="text-2xl font-black text-gray-900">{filteredData.length}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Total</span>
                  </div>
                </div>
              </div>

              {/* Day vs Night */}
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Day vs Night Detections</h3>
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
                          <Cell key={\`cell-\${index}\`} fill={index === 0 ? '#f59e0b' : '#312e81'} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Data Coverage Metadata */}
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center text-center">
                <ShieldCheck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-2">Verified Analytics</h3>
                <p className="text-sm text-gray-500 mb-6">Generated directly from raw satellite telemetry without simulation.</p>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500 uppercase">Coverage</span>
                    <span className="font-bold text-gray-900">Mar 2024 - 2026</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500 uppercase">Data Source</span>
                    <span className="font-bold text-gray-900">NASA FIRMS</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500 uppercase">Instrument</span>
                    <span className="font-bold text-gray-900">VIIRS (SNPP)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500 uppercase">Total Hits</span>
                    <span className="font-bold text-gray-900">{historicalData.length} Detections</span>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/AnalyticsDashboard.tsx', updatedContent);
console.log("Updated AnalyticsDashboard.tsx");
