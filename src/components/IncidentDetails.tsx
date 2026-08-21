import { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, AlertTriangle, Clock, 
  Wind, Droplets, ThermometerSun, ShieldAlert,
  Radio, Eye, Navigation, Truck, Users, Activity,
  CheckCircle, Shield, Droplet
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, ZoomControl, Circle, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { FireIncident, SpreadSimulation, WeatherSnapshot } from '../types';
import { WeatherService } from '../services/weatherService';
import { FireService } from '../services/fireService';
import { RiskService } from '../services/riskService';

interface Props {
  incident: FireIncident;
  onBack: () => void;
}

const LIFECYCLE_STAGES = ['detected', 'verifying', 'confirmed', 'responding', 'contained', 'extinguished'];

const createFireMarker = (severity: string) => {
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-50"></div>
        <div class="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/10 relative z-10"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function IncidentDetails({ incident, onBack }: Props) {
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [gisContext, setGisContext] = useState<any>(null);
  const [gisLoading, setGisLoading] = useState(true);

  const [simulations, setSimulations] = useState<SpreadSimulation[]>([]);
  const [activeSim, setActiveSim] = useState<number | null>(null);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);

  useEffect(() => {
    RiskService.getFireSpreadSimulation(incident).then(setSimulations);

    setGisLoading(true);
    fetch(`/api/gis/context?lat=${incident.location.coordinates.lat}&lng=${incident.location.coordinates.lng}`)
      .then(res => res.json())
      .then(data => {
        setGisContext(data);
        setGisLoading(false);
      })
      .catch(err => {
        console.error("GIS fetch error:", err);
        setGisLoading(false);
      });
    
    setWeather(null);
    WeatherService.getWeatherForLocation(incident.location.coordinates.lat, incident.location.coordinates.lng)
      .then(setWeather)
      .catch(err => {
        console.error("Failed to fetch weather for incident", err);
        setWeather({ error: true } as any);
      });
  }, [incident]);

  const handleAction = async (newStatus: any, actionDesc: string) => {
    setIsUpdating(true);
    await FireService.updateIncidentStatus(
      incident.id, 
      newStatus, 
      actionDesc,
      { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), description: actionDesc, type: 'response' }
    );
    setIsUpdating(false);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'satellite': return <Radio className="w-5 h-5 text-indigo-500" />;
      case 'iot': return <Activity className="w-5 h-5 text-blue-500" />;
      case 'camera': return <Eye className="w-5 h-5 text-gray-400" />;
      case 'field': return <Users className="w-5 h-5 text-green-500" />;
      case 'weather': return <Wind className="w-5 h-5 text-sky-500" />;
      default: return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const currentStageIndex = LIFECYCLE_STAGES.indexOf(incident.status);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-transparent hover:bg-white/5 border border-white/10 rounded-full transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">Incident {incident.id}</h1>
            <div className="text-sm text-gray-400 font-medium">{incident.location.district}, {incident.location.state}</div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-md border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">System Operational</span>
            </div>
            <span className="bg-orange-500/20 text-orange-300 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-orange-500/30">
              Demo Data
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          {incident.status === 'detected' && (
            <button onClick={() => handleAction('verifying', 'Started verification')} className="px-4 py-2 bg-yellow-500/10 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-500/20 shadow-sm">
              Verify Fire
            </button>
          )}
          {incident.status === 'verifying' && (
            <>
              <button onClick={() => handleAction('extinguished', 'Marked as False Alarm')} className="px-4 py-2 bg-white/5 text-gray-200 font-semibold rounded-lg hover:bg-gray-100 transition-colors border border-white/10 shadow-sm">
                False Alarm
              </button>
              <button onClick={() => handleAction('confirmed', 'Fire Confirmed via Command Center')} className="px-4 py-2 bg-red-500/10 text-red-400 font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-500/20 shadow-sm">
                Confirm Fire
              </button>
            </>
          )}
          {incident.status === 'confirmed' && (
            <button onClick={() => handleAction('responding', 'Dispatched Response Team')} className="px-4 py-2 bg-[#0F1E16] text-white font-semibold rounded-lg hover:bg-[#1C2C23] transition-colors shadow-sm">
              Dispatch Team
            </button>
          )}
          {incident.status === 'responding' && (
            <button onClick={() => handleAction('contained', 'Fire successfully contained')} className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/30 shadow-sm">
              Mark Contained
            </button>
          )}
          {incident.status === 'contained' && (
            <button onClick={() => handleAction('extinguished', 'Fire fully extinguished')} className="px-4 py-2 bg-green-500/10 text-green-400 font-semibold rounded-lg hover:bg-green-100 transition-colors border border-green-200 shadow-sm">
              Mark Extinguished
            </button>
          )}
        </div>
      </header>

      
          {/* Fire Confidence Engine */}
          <div className="bg-[#0f1912]/80 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Fire Confidence Engine</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Satellite (NASA)</div>
                <div className="font-bold text-white text-sm">{incident.latestConfidence || incident.detection.confidence || 'N/A'}% Confidence</div>
              </div>
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">IoT Sensors</div>
                <div className="font-bold text-yellow-400 text-sm">Elevated CO2</div>
              </div>
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">AI Camera</div>
                <div className="font-bold text-gray-400 text-sm">No Visual (Smoke)</div>
              </div>
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Weather Context</div>
                <div className="font-bold text-orange-400 text-sm">High Risk (VPD &gt; 1.5)</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Overall Synthesis</div>
              <div className="text-sm font-black text-red-400 bg-red-500/10 px-3 py-1 rounded border border-red-500/20">CONFIRMED FIRE EVENT (92%)</div>
            </div>
          </div>

          {/* Lifecycle Horizontal Bar */}
      <div className="bg-[#0f1912]/80 backdrop-blur-3xl rounded-2xl p-6 mb-6 shadow-sm border border-white/10 shrink-0">
        <div className="relative flex justify-between items-center">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full"></div>
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div key={stage} className="relative z-10 flex flex-col items-center gap-2 bg-transparent px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isCurrent ? 'border-green-600 bg-green-500/10 text-green-400' :
                  isCompleted ? 'border-green-500 bg-green-500 text-white' :
                  'border-white/10 bg-transparent text-gray-300'
                }`}>
                  {isCompleted && !isCurrent ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isCurrent ? 'text-green-400' : isCompleted ? 'text-white' : 'text-gray-400'
                }`}>{stage}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left Column (Details & Evidence) */}
        <div className="flex-1 overflow-y-auto space-y-6 pb-6 lg:pr-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0f1912]/80 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Location & Risk</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-400">Forest Coordinates</div>
                    <div className="font-medium text-white">{incident.location.coordinates.lat.toFixed(4)}, {incident.location.coordinates.lng.toFixed(4)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-400">Jurisdiction</div>
                    <div className="font-medium text-white">{incident.location.forestDivision} / {incident.location.range} / {incident.location.beat}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${incident.severity === 'critical' ? 'text-red-500' : incident.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'}`} />
                  <div>
                    <div className="text-sm text-gray-400">Risk Assessment</div>
                    <div className="font-medium text-white">{incident.risk.level} (Score: {incident.risk.score})</div>
                    <div className="text-xs text-gray-400 mt-1">Est Area: {incident.impact.areaAffectedHa} ha</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0f1912]/80 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Environment</h3>
                {weather && (
                  <span className="text-[10px] text-gray-400">
                    Source: {weather.source || 'Open-Meteo'} | Updated {Math.round((Date.now() - new Date(weather.retrievedAt || weather.timestamp).getTime()) / 60000)} mins ago
                  </span>
                )}
              </div>
              
              {!weather ? (
                 <div className="text-sm text-gray-400 italic text-center py-4">Weather data fetching...</div>
              ) : weather.error ? (
                 <div className="text-sm text-red-400 italic text-center py-4">Weather unavailable</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <ThermometerSun className="w-5 h-5 text-orange-500 mb-2" />
                    <div className="text-sm text-gray-400 mb-0.5">Temperature</div>
                    <div className="font-bold text-white">{weather.temperature !== undefined ? `${weather.temperature}°C` : '--'}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Droplets className="w-5 h-5 text-blue-500 mb-2" />
                    <div className="text-sm text-gray-400 mb-0.5">Humidity</div>
                    <div className="font-bold text-white">{weather.humidity !== undefined ? `${weather.humidity}%` : '--'}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Wind className="w-5 h-5 text-gray-400 mb-2" />
                    <div className="text-sm text-gray-400 mb-0.5">Wind</div>
                    <div className="font-bold text-white">{weather.windSpeed !== undefined ? `${weather.windSpeed} km/h` : '--'}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Navigation className="w-5 h-5 text-gray-400 mb-2" />
                    <div className="text-sm text-gray-400 mb-0.5">Direction</div>
                    <div className="font-bold text-white">{weather.windDirection !== undefined ? `${weather.windDirection}°` : '--'}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Droplet className="w-5 h-5 text-indigo-500 mb-2" />
                    <div className="text-sm text-gray-400 mb-0.5">Rainfall</div>
                    <div className="font-bold text-white">{weather.precipitation !== undefined ? `${weather.precipitation} mm` : '--'}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Activity className="w-5 h-5 text-green-500 mb-2" />
                    <div className="text-sm text-gray-400 mb-0.5">VPD</div>
                    <div className="font-bold text-white">{weather.vpd !== undefined ? `${weather.vpd} kPa` : '--'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          
          {/* Geographic Context */}
          <div className="bg-[#0f1912]/80 backdrop-blur-3xl p-6 rounded-2xl border border-white/10 shadow-sm flex flex-col z-0">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex justify-between items-center">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-green-500" /> Geographic Context</span>
              {gisContext?.source && (
                <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{gisContext.source}</span>
              )}
            </h3>
            
            {gisLoading ? (
              <div className="flex items-center justify-center p-6">
                <div className="w-6 h-6 border-2 border-white/20 border-t-green-500 rounded-full animate-spin"></div>
                <span className="ml-3 text-sm text-gray-400">Loading spatial data...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Nearest Road */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                    <Navigation className="w-4 h-4 text-gray-300" /> Nearest Road
                  </div>
                  {gisContext?.nearestRoad ? (
                    <>
                      <div className="font-medium text-lg text-white">{gisContext.nearestRoad.distance} km</div>
                      <div className="text-sm text-gray-400 mt-1 truncate" title={gisContext.nearestRoad.name}>{gisContext.nearestRoad.name}</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 italic mt-2">Data unavailable</div>
                  )}
                </div>

                {/* Nearest Water */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                    <Droplet className="w-4 h-4 text-blue-400" /> Nearest Water
                  </div>
                  {gisContext?.nearestWater ? (
                    <>
                      <div className="font-medium text-lg text-white">{gisContext.nearestWater.distance} km</div>
                      <div className="text-sm text-gray-400 mt-1 truncate" title={gisContext.nearestWater.name}>{gisContext.nearestWater.name}</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 italic mt-2">Data unavailable</div>
                  )}
                </div>

                {/* Nearest Settlement */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                    <Users className="w-4 h-4 text-orange-400" /> Nearest Settlement
                  </div>
                  {gisContext?.nearestSettlement ? (
                    <>
                      <div className="font-medium text-lg text-white">{gisContext.nearestSettlement.distance} km</div>
                      <div className="text-sm text-gray-400 mt-1 truncate" title={gisContext.nearestSettlement.name}>{gisContext.nearestSettlement.name}</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 italic mt-2">Data unavailable</div>
                  )}
                </div>
              </div>
            )}
          </div>

          
          {/* Provenance Panel */}
          <div className="bg-[#0f1912]/80 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex justify-between items-center">
              <span>Detection Provenance</span>
              <span className="bg-green-100 text-green-800 text-[10px] px-2.5 py-1 rounded-full font-bold">Confidence: {incident.latestConfidence || incident.detection.confidence}%</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Sources</div>
                <div className="font-bold text-white text-sm">{incident.satelliteSources?.join(', ') || 'N/A'}</div>
              </div>
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">First Detection</div>
                <div className="font-bold text-white text-sm">
                  {incident.firstDetectedAt ? new Date(incident.firstDetectedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                </div>
              </div>
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Max FRP</div>
                <div className="font-bold text-white text-sm">{incident.maximumFRP ? `${incident.maximumFRP} MW` : 'N/A'}</div>
              </div>
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Forest Screening</div>
                <div className="font-bold text-white text-sm">{incident.detection.forestScreening || 'UNKNOWN'}</div>
              </div>
            </div>

            {incident.satelliteDetections && incident.satelliteDetections.length > 0 && (
              <div className="mt-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Raw Detections ({incident.detectionCount})</div>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                  {incident.satelliteDetections.map((det, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                      <div>
                        <div className="text-xs font-bold text-white">{det.satellite} {det.instrument}</div>
                        <div className="text-[10px] text-gray-400">{det.acq_date} {det.acq_time} UTC</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-orange-400">{det.frp} MW</div>
                        <div className="text-[10px] text-gray-400">{det.confidence}% Conf</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
        {/* Right Column (Map & Timeline) */}
        <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0 h-auto">
          
          {/* Mini Map */}
          <div className="bg-[#0f1912]/80 backdrop-blur-3xl p-2 rounded-2xl border border-white/10 shadow-sm h-64 relative overflow-hidden flex flex-col z-0">
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-white/10 pointer-events-none">
              <span className="text-xs font-bold text-white">Impact Zone</span>
            </div>
            <MapContainer 
              center={[incident.location.coordinates.lat, incident.location.coordinates.lng]} 
              zoom={13} 
              zoomControl={false}
              className="w-full h-full rounded-xl z-0"
            >
              <ZoomControl position="bottomright" />
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
              
              {/* Predictions */}
              {activeSim !== null && simulations.slice(0, activeSim + 1).map((sim, idx) => (
                <Circle 
                  key={sim.timeHours}
                  center={[incident.location.coordinates.lat, incident.location.coordinates.lng]}
                  radius={sim.radiusMeters}
                  pathOptions={{ 
                    color: '#ef4444', 
                    fillColor: '#ef4444', 
                    fillOpacity: 0.2 - (idx * 0.05),
                    weight: 2,
                    dashArray: '5, 5'
                  }}
                />
              ))}

              <Marker
                position={[incident.location.coordinates.lat, incident.location.coordinates.lng]}
                icon={createFireMarker(incident.severity)}
              />
              
              {/* Context Layers */}
              {gisContext && (
                <>
                  {gisContext.nearestRoad?.geometry && (
                    <GeoJSON 
                      key={"road-" + incident.id}
                      data={{
                        type: "LineString",
                        coordinates: gisContext.nearestRoad.geometry
                      } as any}
                      style={{ color: '#facc15', weight: 4, opacity: 0.9 }}
                    />
                  )}
                  {gisContext.nearestWater?.geometry && (
                    <GeoJSON 
                      key={"water-" + incident.id}
                      data={{
                        type: "LineString",
                        coordinates: gisContext.nearestWater.geometry
                      } as any}
                      style={{ color: '#3b82f6', weight: 4, opacity: 0.9 }}
                    />
                  )}
                  {gisContext.nearestSettlement?.coordinates && (
                    <Marker 
                      key={"settlement-" + incident.id}
                      position={[gisContext.nearestSettlement.coordinates[0], gisContext.nearestSettlement.coordinates[1]]}
                      icon={L.divIcon({
                        className: 'bg-transparent border-0',
                        html: '<div class="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center"></div>',
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                      })}
                    />
                  )}
                </>
              )}

              
              
            </MapContainer>
          </div>

          {/* Fire Spread Prediction */}
          <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 shadow-sm flex flex-col shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider flex items-center gap-2">
                <ThermometerSun className="w-4 h-4" /> Predictive Simulation
              </h3>
              <div className="bg-red-200 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Escalating Risk</div>
            </div>
            <p className="text-xs text-red-400 mb-4 font-medium">Estimated affected area based on current wind, humidity, and terrain factors.</p>
            
            <div className="grid grid-cols-3 gap-2">
              {simulations.map((sim, idx) => (
                <button
                  key={sim.timeHours}
                  onClick={() => setActiveSim(idx === activeSim ? null : idx)}
                  className={`py-2 px-1 rounded-lg border flex flex-col items-center justify-center transition-colors ${
                    activeSim !== null && activeSim >= idx 
                      ? 'bg-red-600 text-white border-red-700' 
                      : 'bg-transparent text-red-400 border-red-500/20 hover:bg-red-100'
                  }`}
                >
                  <div className="text-xs font-bold">{sim.timeHours} HOUR</div>
                  <div className={`text-[10px] mt-0.5 ${activeSim !== null && activeSim >= idx ? 'text-red-100' : 'text-red-500'}`}>{sim.areaHa} ha</div>
                </button>
              ))}
            </div>
          </div>

          {/* Timeline & Actions */}
          <div className="bg-[#0f1912]/80 backdrop-blur-3xl p-6 rounded-2xl border border-white/10 shadow-sm flex-1 flex flex-col overflow-hidden">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 shrink-0">Incident Timeline</h3>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-6">
                {incident.history.map((event, index) => (
                  <div key={event.id} className="relative pl-6">
                    {/* Line */}
                    {index !== incident.history.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-[-24px] w-0.5 bg-gray-100"></div>
                    )}
                    {/* Dot */}
                    <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 border-white/10 shadow-sm flex items-center justify-center ${
                      event.type === 'detection' ? 'bg-orange-500' :
                      event.type === 'response' ? 'bg-purple-500' :
                      event.type === 'verification' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    
                    <div className="text-xs font-bold text-gray-400 mb-1">{event.timestamp}</div>
                    <div className="text-sm font-medium text-white">{event.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
