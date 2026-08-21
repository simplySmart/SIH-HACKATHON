import { useState, useEffect } from 'react';
import { 
  AlertTriangle, ThermometerSun, Droplets, Wind, 
  CloudRain, Flame, Activity, ArrowUpRight, ArrowDownRight, ArrowRight,
  Info
} from 'lucide-react';
import { MapContainer, TileLayer, Rectangle, Tooltip, LayersControl, ZoomControl } from 'react-leaflet';
import { DistrictRisk } from '../types';
import { RiskService } from '../services/riskService';
import { FireService } from '../services/fireService';

const getRiskColor = (riskClass: string) => {
  switch(riskClass) {
    case 'Extreme': return 'bg-red-900 text-white';
    case 'Very High': return 'bg-red-600 text-white';
    case 'High': return 'bg-orange-500 text-white';
    case 'Moderate': return 'bg-yellow-500 text-white';
    case 'Low': return 'bg-green-500 text-white';
    default: return 'bg-white/50 text-white';
  }
};

const getRiskBorderColor = (riskClass: string) => {
  switch(riskClass) {
    case 'Extreme': return 'border-red-900';
    case 'Very High': return 'border-red-600';
    case 'High': return 'border-orange-500';
    case 'Moderate': return 'border-yellow-500';
    case 'Low': return 'border-green-500';
    default: return 'border-gray-500';
  }
};

const getRiskTextColor = (riskClass: string) => {
  switch(riskClass) {
    case 'Extreme': return 'text-red-900';
    case 'Very High': return 'text-red-600';
    case 'High': return 'text-orange-600';
    case 'Moderate': return 'text-yellow-600';
    case 'Low': return 'text-green-600';
    default: return 'text-gray-300';
  }
};

const getRiskHexColor = (riskClass: string) => {
  switch(riskClass) {
    case 'Extreme': return '#7f1d1d';
    case 'Very High': return '#dc2626';
    case 'High': return '#f97316';
    case 'Moderate': return '#eab308';
    case 'Low': return '#22c55e';
    default: return '#6b7280';
  }
}

// Generate demo grid data for Chhattisgarh
const generateDemoGrid = () => {
  const grid = [];
  const baseLat = 18.5; // Southern tip of CG approx
  const baseLng = 80.5; // Western edge approx
  const latSteps = 10;
  const lngSteps = 8;
  const stepSize = 0.4; // approx degrees

  for (let i = 0; i < latSteps; i++) {
    for (let j = 0; j < lngSteps; j++) {
      // Shape rough CG boundary loosely by ignoring some corners
      if ((i < 2 && j > 5) || (i > 8 && j < 2)) continue;
      
      const lat = baseLat + (i * stepSize);
      const lng = baseLng + (j * stepSize);
      
      // Assign random risk skewed towards south/south-west being higher for demo
      let riskVal = Math.random() * 100;
      if (i < 4 && j < 4) riskVal += 30; // Boost risk in south-west (Bijapur/Sukma)
      riskVal = Math.min(riskVal, 100);

      let rClass = 'Low';
      if (riskVal > 90) rClass = 'Extreme';
      else if (riskVal > 80) rClass = 'Very High';
      else if (riskVal > 60) rClass = 'High';
      else if (riskVal > 40) rClass = 'Moderate';

      grid.push({
        bounds: [[lat, lng], [lat + stepSize, lng + stepSize]] as [[number, number], [number, number]],
        riskClass: rClass,
        score: Math.round(riskVal)
      });
    }
  }
  return grid;
};

const demoGrid = generateDemoGrid();

export default function RiskDashboard() {
  const [districts, setDistricts] = useState<DistrictRisk[]>([]);
  const [activeFiresCount, setActiveFiresCount] = useState(0);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictRisk | null>(null);

  useEffect(() => {
    RiskService.getDistrictRisks().then(data => {
      setDistricts(data);
      if (data.length > 0) setSelectedDistrict(data[0]);
    });
    
    FireService.getIncidents().then(incidents => {
      const active = incidents.filter(i => ['detected', 'verifying', 'confirmed', 'responding'].includes(i.status)).length;
      setActiveFiresCount(active);
    });
  }, []);

  const extremeCount = districts.filter(d => d.riskClass === 'Extreme').length;
  const veryHighCount = districts.filter(d => d.riskClass === 'Very High').length;
  const highCount = districts.filter(d => d.riskClass === 'High').length;

  const getForecastIcon = (now: number, future: number) => {
    if (future > now + 5) return <ArrowUpRight className="w-5 h-5 text-red-500" />;
    if (future < now - 5) return <ArrowDownRight className="w-5 h-5 text-green-500" />;
    return <ArrowRight className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden rounded-3xl">
      <header className="px-6 py-5 shrink-0 flex justify-between items-center bg-white border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Risk & Forecast Intelligence</h1>
          <p className="text-sm text-gray-400 font-medium">Operational Fire Risk Assessment</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-md border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">System Operational</span>
          </div>
          <span className="bg-orange-500/20 text-orange-300 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-orange-500/30">
            Demo Data
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        
        {/* Top Cards */}
        <div className="flex lg:grid grid-cols-5 gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
          <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 flex flex-col justify-between min-w-[160px] snap-center shrink-0">
            <div className="text-sm font-medium text-red-400 mb-2">Extreme Risk Zones</div>
            <div className="text-3xl font-bold text-red-900">{extremeCount}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex flex-col justify-between min-w-[160px] snap-center shrink-0">
            <div className="text-sm font-medium text-orange-700 mb-2">Very High Risk Zones</div>
            <div className="text-3xl font-bold text-orange-900">{veryHighCount}</div>
          </div>
          <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20 flex flex-col justify-between min-w-[160px] snap-center shrink-0">
            <div className="text-sm font-medium text-yellow-400 mb-2">High Risk Zones</div>
            <div className="text-3xl font-bold text-yellow-900">{highCount}</div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-between min-w-[160px] snap-center shrink-0">
            <div className="text-sm font-medium text-gray-300 mb-2">Active Fires</div>
            <div className="text-3xl font-bold text-white">{activeFiresCount}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col justify-between min-w-[160px] snap-center shrink-0">
            <div className="text-sm font-medium text-blue-700 mb-2">Forecast Trend</div>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-8 h-8 text-red-500" />
              <span className="text-sm font-bold text-red-400 uppercase tracking-wider">Escalating</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[600px]">
          {/* Map Column */}
          <div className="w-full h-[400px] lg:h-full flex-1 bg-[#0f1912]/80 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-sm overflow-hidden flex flex-col relative z-0 shrink-0 lg:shrink">
            <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-md border border-white/10 pointer-events-none">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Regional Risk Heatmap</span>
            </div>
            
            <MapContainer 
              center={[21.25, 81.62]} 
              zoom={6} 
              zoomControl={false}
              className="w-full h-full z-0"
            >
              <ZoomControl position="bottomright" />
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Light Map">
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite">
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              {demoGrid.map((cell, idx) => (
                <Rectangle 
                  key={idx} 
                  bounds={cell.bounds} 
                  pathOptions={{ 
                    color: getRiskHexColor(cell.riskClass), 
                    fillColor: getRiskHexColor(cell.riskClass), 
                    fillOpacity: 0.4,
                    weight: 1
                  }}
                >
                  <Tooltip sticky>
                    <div className="font-bold">Risk Score: {cell.score}</div>
                    <div className="text-sm">{cell.riskClass}</div>
                  </Tooltip>
                </Rectangle>
              ))}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur px-4 py-3 rounded-xl shadow-md border border-white/10 pointer-events-none flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 mr-2 uppercase">Risk Level</span>
              {['Low', 'Moderate', 'High', 'Very High', 'Extreme'].map(level => (
                <div key={level} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getRiskHexColor(level) }}></div>
                  <span className="text-xs font-medium text-gray-200">{level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* District Rankings & Details Column */}
          <div className="w-full lg:w-[450px] flex flex-col gap-6 shrink-0 h-auto">
            {/* District Rankings */}
            <div className="bg-[#0f1912]/80 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-sm p-5 flex flex-col h-[400px] lg:h-1/2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">District Risk Ranking</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {districts.map(dist => (
                  <div 
                    key={dist.id}
                    onClick={() => setSelectedDistrict(dist)}
                    className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                      selectedDistrict?.id === dist.id ? 'bg-white/5 border-gray-300' : 'border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-8 rounded-full ${getRiskColor(dist.riskClass).split(' ')[0]}`}></div>
                      <div>
                        <div className="font-bold text-white">{dist.district}</div>
                        <div className={`text-xs font-semibold uppercase ${getRiskTextColor(dist.riskClass)}`}>{dist.riskClass}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-white">{dist.riskScore}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected District Details */}
            {selectedDistrict && (
              <div className="bg-[#0f1912]/80 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-sm p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedDistrict.district} Analysis</h3>
                    <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mt-2 ${getRiskColor(selectedDistrict.riskClass)}`}>
                      {selectedDistrict.riskClass} RISK
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-white">{selectedDistrict.riskScore}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Score</div>
                  </div>
                </div>

                {/* 48h Forecast */}
                <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">48-Hour Forecast</h4>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Now</div>
                      <div className="font-bold text-lg text-white">{selectedDistrict.forecast.now}</div>
                    </div>
                    {getForecastIcon(selectedDistrict.forecast.now, selectedDistrict.forecast.plus24h)}
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">+24h</div>
                      <div className="font-bold text-lg text-white">{selectedDistrict.forecast.plus24h}</div>
                    </div>
                    {getForecastIcon(selectedDistrict.forecast.plus24h, selectedDistrict.forecast.plus48h)}
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">+48h</div>
                      <div className="font-bold text-lg text-white">{selectedDistrict.forecast.plus48h}</div>
                    </div>
                  </div>
                </div>

                {/* Why is this area high risk? */}
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Risk Drivers
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg border ${selectedDistrict.drivers.temperature > 40 ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                        <ThermometerSun className="w-4 h-4" /> Temp
                      </div>
                      <div className={`font-bold ${selectedDistrict.drivers.temperature > 40 ? 'text-red-400' : 'text-white'}`}>
                        {selectedDistrict.drivers.temperature}°C
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-lg border ${selectedDistrict.drivers.humidity < 20 ? 'bg-orange-50 border-orange-100' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                        <Droplets className="w-4 h-4" /> Humidity
                      </div>
                      <div className={`font-bold ${selectedDistrict.drivers.humidity < 20 ? 'text-orange-700' : 'text-white'}`}>
                        {selectedDistrict.drivers.humidity}%
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border ${selectedDistrict.drivers.fuelDryness === 'Extreme' ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                        <Flame className="w-4 h-4" /> Fuel Dryness
                      </div>
                      <div className={`font-bold ${selectedDistrict.drivers.fuelDryness === 'Extreme' ? 'text-red-400' : 'text-white'}`}>
                        {selectedDistrict.drivers.fuelDryness}
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border ${selectedDistrict.drivers.recentRainfall < 5 ? 'bg-orange-50 border-orange-100' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                        <CloudRain className="w-4 h-4" /> Recent Rain
                      </div>
                      <div className={`font-bold ${selectedDistrict.drivers.recentRainfall < 5 ? 'text-orange-700' : 'text-white'}`}>
                        {selectedDistrict.drivers.recentRainfall} mm
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border bg-white/5 border-white/10">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                        <Wind className="w-4 h-4" /> Wind
                      </div>
                      <div className="font-bold text-white">
                        {selectedDistrict.drivers.windSpeed} km/h
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border ${selectedDistrict.drivers.historicalFreq === 'High' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                        <Activity className="w-4 h-4" /> Hist. Freq.
                      </div>
                      <div className={`font-bold ${selectedDistrict.drivers.historicalFreq === 'High' ? 'text-yellow-400' : 'text-white'}`}>
                        {selectedDistrict.drivers.historicalFreq}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
