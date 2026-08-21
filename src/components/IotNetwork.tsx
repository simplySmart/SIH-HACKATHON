import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, MapPin, ThermometerSun, Droplets, Wind, ShieldAlert, Activity, Wifi, Battery, BatteryLow, CheckCircle, XCircle, AlertTriangle, Link as LinkIcon, Radio, Signal, Power, CloudRain, Clock, WifiOff, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, ZoomControl, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

import { IotSensor, IotGateway, FireIncident } from '../types';
import { IotService } from '../services/iotService';
import { FireService } from '../services/fireService';

const getSensorColor = (status: string) => {
  switch(status) {
    case 'Normal': return 'bg-green-500';
    case 'High Alert': return 'bg-yellow-500';
    case 'Fire Mode': return 'bg-red-500 animate-pulse';
    case 'Offline': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

const createSensorIcon = (status: string) => {
  const colorClass = getSensorColor(status);
  return L.divIcon({
    className: 'custom-icon',
    html: `<div class="w-5 h-5 rounded-full border-2 border-white shadow-md ${colorClass} flex items-center justify-center"><div class="w-1.5 h-1.5 bg-white rounded-full opacity-80"></div></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export default function IotNetwork() {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<IotSensor[]>([]);
  const [gateways, setGateways] = useState<IotGateway[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<IotSensor | null>(null);

  useEffect(() => {
    IotService.getSensors().then(setSensors);
    IotService.getGateways().then(setGateways);
  }, []);

  const connectedCount = sensors.filter(s => s.status === 'Normal').length;
  const warningCount = sensors.filter(s => s.status === 'High Alert').length;
  const anomalyCount = sensors.filter(s => s.status === 'Fire Mode').length;
  const offlineCount = sensors.filter(s => s.status === 'Offline').length;

  const handleCreateIncident = async () => {
    if (!selectedSensor) return;
    const newIncident = await FireService.createIncident({
      severity: 'critical',
      location: {
        state: 'Chhattisgarh',
        district: selectedSensor.district,
        forestDivision: 'Unknown',
        range: 'Unknown',
        beat: 'Unknown',
        coordinates: selectedSensor.coordinates
      },
      title: `IoT Anomaly Detected - ${selectedSensor.id}`,
      environment: {
        temperature: selectedSensor.temperature,
        humidity: selectedSensor.humidity,
        windSpeed: 10,
        windDirection: 'N'
      },
      detection: {
        method: 'sensor',
        confidence: 95,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      evidence: {
        images: [],
        sources: {
          iot: 98,
          weather: 85,
          satellite: 50
        }
      }
    });
    navigate(`/incidents/${newIncident.id}`);
  };

  const getGatewayForSensor = (gatewayId: string) => {
    return gateways.find(g => g.id === gatewayId);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] bg-slate-50 overflow-hidden rounded-3xl">
      <header className="px-4 md:px-6 py-4 md:py-5 shrink-0 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-tight">Adaptive Sensor Network</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Tactical Ground Sensing: Sleeping, Monitoring, Alert, Fire Mode, Offline.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-md border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">System Operational</span>
          </div>
          <span className="bg-orange-500/10 text-orange-600 border border-orange-500/20 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-orange-200">
            Demo Data
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        {/* Summary Metrics */}
        <div className="flex md:grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-w-[140px] snap-center shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-slate-400">Monitoring</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{connectedCount}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-w-[140px] snap-center shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-slate-400">High Alert</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{warningCount}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm flex flex-col justify-between min-w-[140px] snap-center shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-red-600" />
              <span className="text-sm font-bold text-red-700">Fire Mode</span>
            </div>
            <div className="text-3xl font-bold text-red-900">{anomalyCount}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-w-[140px] snap-center shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-400">Offline</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{offlineCount}</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[650px]">
          {/* Map Section */}
          <div className="flex-1 w-full h-[400px] lg:h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative z-0">
            <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-slate-200 pointer-events-none">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ground Sensor Nodes</span>
            </div>
            
            <MapContainer 
              center={[18.7, 81.2]} 
              zoom={9} 
              zoomControl={false}
              className="w-full h-full z-0"
            >
              <ZoomControl position="bottomright" />
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
              {/* Add a light overlay to make markers pop on satellite */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
              />

              {sensors.map(sensor => (
                <Marker 
                  key={sensor.id}
                  position={[sensor.coordinates.lat, sensor.coordinates.lng]}
                  icon={createSensorIcon(sensor.status)}
                  eventHandlers={{
                    click: () => setSelectedSensor(sensor)
                  }}
                >
                  <Tooltip>{sensor.id} - {sensor.status}</Tooltip>
                </Marker>
              ))}
            </MapContainer>
            
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur px-4 py-3 rounded-xl shadow-sm border border-slate-200 pointer-events-none flex flex-col gap-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Node Status</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs">Normal</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span className="text-xs">High Alert</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs">Anomaly</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-400"></div><span className="text-xs">Offline</span></div>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          {selectedSensor ? (
            <div className="w-full lg:w-[420px] fixed lg:relative bottom-[calc(env(safe-area-inset-bottom)+60px)] lg:bottom-auto left-0 right-0 z-[2000] lg:z-auto bg-white rounded-t-3xl lg:rounded-2xl border-t lg:border border-slate-200 shadow-[0_-10px_40px_rgb(0,0,0,0.1)] lg:shadow-sm flex flex-col shrink-0 overflow-hidden max-h-[50vh] lg:max-h-none lg:h-full">
              
              <div className={`p-5 border-b border-slate-200 flex justify-between items-start sticky top-0 z-10 ${selectedSensor.status === 'Fire Mode' ? 'bg-red-50' : 'bg-gray-50'}`}>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedSensor.id}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400 font-medium">{selectedSensor.district} District</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-right flex flex-col items-end hidden lg:flex">
                    <div className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-1 ${
                      selectedSensor.status === 'Fire Mode' ? 'bg-red-200 text-red-800' :
                      selectedSensor.status === 'High Alert' ? 'bg-yellow-200 text-yellow-800' :
                      selectedSensor.status === 'Normal' ? 'bg-green-100 text-green-800' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {selectedSensor.status}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Updated {selectedSensor.lastUpdate}</div>
                  </div>
                  <button 
                    onClick={() => setSelectedSensor(null)}
                    className="p-1.5 text-slate-400 hover:text-gray-700 bg-white border border-slate-200 rounded-full transition-colors shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-5 space-y-6">
                  {/* Current Readings */}
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Live Telemetry</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-3 rounded-xl border flex flex-col ${selectedSensor.temperature > 45 ? 'bg-red-50 border-red-100 text-red-900' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                          <ThermometerSun className="w-4 h-4" /> Temp
                        </div>
                        <div className="text-2xl font-black">{selectedSensor.temperature}°C</div>
                      </div>
                      <div className={`p-3 rounded-xl border flex flex-col ${selectedSensor.humidity < 20 && selectedSensor.status !== 'Offline' ? 'bg-orange-50 border-orange-100 text-orange-900' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                          <Droplets className="w-4 h-4" /> Humidity
                        </div>
                        <div className="text-2xl font-black">{selectedSensor.humidity}%</div>
                      </div>
                      <div className={`p-3 rounded-xl border flex flex-col ${selectedSensor.smoke > 100 ? 'bg-red-50 border-red-100 text-red-900' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                          <Wind className="w-4 h-4" /> Smoke (PM)
                        </div>
                        <div className="text-2xl font-black">{selectedSensor.smoke} <span className="text-sm font-medium opacity-60">μg/m³</span></div>
                      </div>
                      <div className={`p-3 rounded-xl border flex flex-col ${selectedSensor.co > 50 ? 'bg-red-50 border-red-100 text-red-900' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                          <Activity className="w-4 h-4" /> CO Level
                        </div>
                        <div className="text-2xl font-black">{selectedSensor.co} <span className="text-sm font-medium opacity-60">ppm</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Sensor Health */}
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Hardware Health</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-slate-200">
                        <Battery className={`w-5 h-5 ${selectedSensor.battery === 'Good' ? 'text-emerald-600' : selectedSensor.battery === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`} />
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Battery</div>
                          <div className="text-sm font-bold text-slate-900">{selectedSensor.battery}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-slate-200">
                        <Signal className={`w-5 h-5 ${selectedSensor.signalStrength === 'Good' ? 'text-emerald-600' : selectedSensor.signalStrength === 'Weak' ? 'text-yellow-500' : 'text-slate-400'}`} />
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Signal</div>
                          <div className="text-sm font-bold text-slate-900">{selectedSensor.signalStrength}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Series */}
                  {selectedSensor.history.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Trends (Last Hour)</h3>
                      <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={selectedSensor.history} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorSmoke" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
                            <Area type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorHum)" />
                            <Area type="monotone" dataKey="smoke" stroke="#64748b" strokeWidth={2} fillOpacity={1} fill="url(#colorSmoke)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Gateway Connection */}
                  {selectedSensor.gatewayId && (
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Gateway Node</h3>
                      {getGatewayForSensor(selectedSensor.gatewayId) && (
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Radio className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{getGatewayForSensor(selectedSensor.gatewayId)!.location}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase">LoRa Gateway • {getGatewayForSensor(selectedSensor.gatewayId)!.connectedSensors} nodes</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-green-600 flex items-center gap-1 justify-end">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Online
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{getGatewayForSensor(selectedSensor.gatewayId)!.lastHeartbeat}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Incident Correlation */}
                  {selectedSensor.status === 'Fire Mode' && (
                    <div className="bg-white border-2 border-red-500 rounded-xl overflow-hidden shadow-lg mt-6">
                      <div className="bg-red-500 px-4 py-2 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-slate-900" />
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Automated Threat Analysis</span>
                      </div>
                      <div className="p-4 space-y-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900 mb-1">Anomaly Detected</div>
                          <div className="text-xs text-slate-400">Smoke + temperature spike crossed critical threshold.</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-medium flex items-center gap-1"><Cpu className="w-3 h-3" /> IoT Confidence</span>
                            <span className="font-bold text-slate-900">98%</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-medium flex items-center gap-1"><Wifi className="w-3 h-3" /> Satellite Correlation</span>
                            <span className="font-bold text-slate-900">50%</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-medium flex items-center gap-1"><CloudRain className="w-3 h-3" /> Weather Risk Factor</span>
                            <span className="font-bold text-slate-900">85%</span>
                          </div>
                          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-900 uppercase">Overall Confidence</span>
                            <span className="text-sm font-black text-red-600">95%</span>
                          </div>
                        </div>

                        <button 
                          onClick={handleCreateIncident}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                          <ShieldAlert className="w-5 h-5" />
                          Create Incident
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ) : (
            <div className="w-[420px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-8 shrink-0 text-center">
              <Cpu className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Sensor Selected</h3>
              <p className="text-sm text-slate-400 font-medium">Click on a ground sensor node on the map to view live telemetry, health status, and gateway connections.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
