import { useState, useEffect } from 'react';
import { Bell, Maximize, Thermometer, Droplets, Wind, Navigation, X, TreePine, Flame, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, ZoomControl, FeatureGroup, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { SystemService } from '../services/systemService';
import { FireService } from '../services/fireService';
import { WeatherSnapshot, FireIncident, IncidentSeverity } from '../types';

import { config } from '../config';
import { getGeoJSON, getForestsGeoJSON } from '../utils/geo';
import { WeatherService } from '../services/weatherService';

const getMarkerIcon = (severity: IncidentSeverity) => {
  const isCritical = severity === 'critical';
  const colorMap = {
    low: 'bg-green-500',
    moderate: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
  };
  const color = colorMap[severity] || 'bg-slate-500';
  const shadowColor = severity === 'critical' ? 'rgba(239,68,68,0.8)' : severity === 'high' ? 'rgba(249,115,22,0.6)' : 'transparent';
  
  return L.divIcon({
    className: 'custom-fire-marker bg-transparent border-0',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        ${isCritical ? `<div class="absolute -inset-4 bg-red-100 rounded-full animate-pulse"></div>
        <div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30 scale-150"></div>` : ''}
        <div class="w-8 h-8 ${color} rounded-full flex items-center justify-center shadow-lg border-2 border-white" style="box-shadow: 0 0 15px ${shadowColor};">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

function MapResetControl({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  return (
    <div className="leaflet-top leaflet-left" style={{ top: '80px' }}>
      <div className="leaflet-control leaflet-bar">
        <a 
          href="#" 
          role="button"
          title="Reset Map View" 
          onClick={(e) => {
            e.preventDefault();
            map.setView(center, zoom);
          }}
          className="flex items-center justify-center bg-transparent hover:bg-slate-50 text-slate-600 w-[34px] h-[34px]"
        >
          <Crosshair className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default function LiveMonitoring() {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [selectedIncidentWeather, setSelectedIncidentWeather] = useState<WeatherSnapshot | null>(null);
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIncident, setSelectedIncident] = useState<FireIncident | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    SystemService.getWeather().then(setWeather);
    FireService.getIncidents().then(setIncidents);
    const unsubscribe = FireService.subscribe((updatedIncidents) => {
      setIncidents(updatedIncidents);
      setSelectedIncident(prev => prev ? updatedIncidents.find(i => i.id === prev.id) || null : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedIncident) {
      setSelectedIncidentWeather(null); // Show loading state briefly or clear old data
      WeatherService.getWeatherForLocation(selectedIncident.location.coordinates.lat, selectedIncident.location.coordinates.lng)
        .then(setSelectedIncidentWeather)
        .catch(err => {
          console.error("Failed to fetch incident weather", err);
          setSelectedIncidentWeather({ error: true } as any);
        });
    } else {
      setSelectedIncidentWeather(null);
    }
  }, [selectedIncident]);

  const filteredIncidents = incidents.filter(incident => {
    // 1. Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!incident.location.district.toLowerCase().includes(q)) {
        return false;
      }
    }

    // 2. Status/Severity Filter
    if (filter === 'All') return true;
    if (['critical', 'high', 'moderate', 'low'].includes(filter.toLowerCase())) {
      return incident.severity === filter.toLowerCase();
    }
    if (filter === 'Verified') {
      return incident.status === 'confirmed' || incident.status === 'responding';
    }
    if (filter === 'Unverified') {
      return incident.status === 'detected' || incident.status === 'verifying';
    }
    
    // Forest Screening Filters
    if (filter === 'Forest') {
      return incident.detection.forestScreening === 'FOREST';
    }
    if (filter === 'Near Forest') {
      return incident.detection.forestScreening === 'NEAR FOREST';
    }
    if (filter === 'Non-Forest') {
      return incident.detection.forestScreening === 'NON-FOREST';
    }

    return true;
  });

  const mapCenter = [21.2514, 81.6296] as [number, number];
  const defaultZoom = 7;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-transparent">
      {/* Header */}
      <header className="flex flex-col gap-2 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-tight">Live Forest Map</h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 ml-0 md:ml-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-md border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">System Operational</span>
              </div>
              {config.DEMO_MODE ? (
                <span className="bg-orange-100 text-orange-300 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-orange-500/30">
                  Demo Data
                </span>
              ) : (
                <span className="bg-blue-100 text-blue-300 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-blue-500/30 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                  Live Data Connected
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-4 self-end md:self-auto hidden md:flex">
            <button className="p-2 bg-transparent hover:bg-slate-50 border border-slate-200 rounded-full transition-colors shadow-sm">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>
            <button className="p-2 bg-transparent hover:bg-slate-50 border border-slate-200 rounded-full transition-colors shadow-sm">
              <Maximize className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
        <div className="px-4 py-2.5 mt-2 bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-amber-300 rounded-xl flex items-start gap-3 shadow-sm">
          <span className="text-amber-600 mt-0.5"><Flame className="w-4 h-4" /></span>
          <span className="text-xs text-yellow-300 font-medium leading-relaxed">
            <strong>Note:</strong> Satellite thermal anomaly does not necessarily indicate a forest fire. Detections are screened against forest boundaries.
          </span>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden relative">
        {/* Left Sidebar (Telemetry & Filters) - Desktop Only */}
        <div className="hidden lg:flex w-72 flex-col gap-6 overflow-y-auto pb-4 shrink-0">
          
          {/* Telemetry Card */}
          <div className="bg-gradient-to-br from-[#111c16] to-[#0a120d] rounded-3xl p-6 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
            <h3 className="text-sm font-semibold text-slate-600 mb-5 tracking-wide uppercase">{selectedIncident ? 'Incident Weather' : 'Regional Telemetry'}</h3>
            {(() => {
              const displayWeather = selectedIncident ? selectedIncidentWeather : weather;
              
              if (selectedIncident && !selectedIncidentWeather) {
                 return <div className="text-sm text-slate-500 italic">Fetching weather...</div>;
              }
              
              if (!displayWeather || (displayWeather as any).error) {
                 return <div className="text-sm text-slate-500 italic">Weather unavailable</div>;
              }
              
              return (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider">
                      <Thermometer className="w-3.5 h-3.5" /> Temperature & Humidity
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-light">{displayWeather.temperature !== undefined ? `${displayWeather.temperature}°C` : '--°C'}</span>
                      <span className="text-lg text-slate-600">{displayWeather.humidity !== undefined ? `${displayWeather.humidity}%` : '--%'}</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-slate-100"></div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Navigation className="w-3.5 h-3.5" /> Wind
                      </div>
                      <div className="text-sm font-medium">{displayWeather.windSpeed !== undefined ? `${displayWeather.windSpeed} km/h` : '--'}</div>
                      <div className="text-xs text-slate-500">{displayWeather.windDirection !== undefined ? `${displayWeather.windDirection}°` : ''} {displayWeather.windGust !== undefined ? `(Gusts: ${displayWeather.windGust} km/h)` : ''}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Droplets className="w-3.5 h-3.5" /> Rainfall
                      </div>
                      <div className="text-sm font-medium">{displayWeather.precipitation !== undefined ? `${displayWeather.precipitation} mm` : '--'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        VPD
                      </div>
                      <div className="text-sm font-medium">{displayWeather.vpd !== undefined ? `${displayWeather.vpd} kPa` : '--'}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        Soil Moisture
                      </div>
                      <div className="text-sm font-medium">{displayWeather.soilMoisture !== undefined ? `${displayWeather.soilMoisture} m³/m³` : '--'}</div>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-slate-100"></div>
                  
                  <div className="flex flex-col gap-1 text-[10px] text-slate-500 pt-1">
                    <div>Updated {Math.round((Date.now() - new Date(displayWeather.retrievedAt || displayWeather.timestamp).getTime()) / 60000)} minutes ago</div>
                    <div>Source: {displayWeather.source || 'Open-Meteo'}</div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-3xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Map Controls</h3>
            
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Search District</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. Raipur..." 
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-slate-100 mb-4"></div>

            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Severity & Status</h4>
            <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
              {['All', 'Critical', 'High', 'Moderate', 'Low', 'Verified', 'Unverified', 'Forest', 'Near Forest', 'Non-Forest'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                    filter === f ? 'bg-slate-100 shadow-sm border border-slate-300 text-emerald-600' : 'text-slate-500 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {f}
                  {filter === f && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative rounded-3xl overflow-hidden shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-slate-200 bg-transparent flex flex-col z-0">
          
          {/* Mobile Filter Button */}
          <button 
            className="absolute top-4 right-4 z-[1000] lg:hidden bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg text-slate-900"
            onClick={() => {
              // Simple native prompt for now, or just leave it for demo
              const newFilter = window.prompt("Enter filter (All, Critical, High, Moderate, Low, Verified, Unverified, Forest, Near Forest, Non-Forest):", filter);
              if (newFilter) setFilter(newFilter);
            }}
          >
            <Thermometer className="w-5 h-5 text-slate-600" />
          </button>

          <MapContainer 
            center={mapCenter} 
            zoom={defaultZoom} 
            zoomControl={false}
            className="w-full h-full z-0"
          >
            <ZoomControl position="topleft" />
            <MapResetControl center={mapCenter} zoom={defaultZoom} />
            
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite (Demo)">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles &copy; Esri"
                />
              </LayersControl.BaseLayer>

              <LayersControl.Overlay checked name="Active Fires">
                <FeatureGroup>
                  {filteredIncidents.map(incident => (
                    <Marker
                      key={incident.id}
                      position={[incident.location.coordinates.lat, incident.location.coordinates.lng]}
                      icon={getMarkerIcon(incident.severity)}
                      eventHandlers={{
                        click: () => {
                          setSelectedIncident(incident);
                        }
                      }}
                    >
                      <Popup className="custom-popup" closeButton={false}>
                        <div className="p-1 min-w-[240px]">
                          <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">{incident.id}</div>
                          <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{incident.title}</h3>
                          
                          <div className="flex flex-col gap-1 text-xs mb-3 text-slate-600">
                            <div><span className="font-semibold">Coords:</span> {incident.location.coordinates.lat.toFixed(4)}, {incident.location.coordinates.lng.toFixed(4)}</div>
                            <div><span className="font-semibold">District:</span> {incident.location.district}</div>
                            {incident.detection.forestScreening && (
                                <div><span className="font-semibold">Screening:</span> <span className={`font-medium ${incident.detection.forestScreening === 'FOREST' ? 'text-emerald-600' : incident.detection.forestScreening === 'NEAR FOREST' ? 'text-yellow-600' : 'text-slate-500'}`}>{incident.detection.forestScreening}</span></div>
                            )}
                            <div><span className="font-semibold">Satellite:</span> {incident.title.replace('Satellite Detection (', '').replace(')', '')}</div>
                            <div><span className="font-semibold">Detection:</span> {new Date(incident.detection.time).toLocaleString()}</div>
                            <div><span className="font-semibold">Confidence:</span> {incident.detection.confidence}%</div>
                            <div><span className="font-semibold">FRP:</span> {incident.impact.areaAffectedHa} MW</div>
                            <div><span className="font-semibold">Source:</span> NASA FIRMS</div>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/incidents/${incident.id}`);
                            }}
                            className="w-full py-2 bg-[#0F1E16] text-slate-900 rounded-lg text-sm font-medium hover:bg-[#1C2C23] transition-colors shadow-sm"
                          >
                            Open Incident
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </FeatureGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="State Boundary" checked>
                 <FeatureGroup>
                   {getGeoJSON() && (
                     <GeoJSON 
                       data={getGeoJSON()} 
                       style={{ fillColor: 'transparent', color: '#166534', weight: 2 }} 
                       filter={() => true} // State outline would ideally be dissolved, but we use district outer bounds with a solid color
                     />
                   )}
                 </FeatureGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Districts" checked>
                 <FeatureGroup>
                   {getGeoJSON() && (
                     <GeoJSON 
                       data={getGeoJSON()} 
                       style={{ fillColor: 'rgba(34, 197, 94, 0.05)', color: '#15803d', weight: 1, opacity: 0.5 }} 
                     />
                   )}
                 </FeatureGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Forest Areas" checked>
                 <FeatureGroup>
                   {getForestsGeoJSON() && (
                     <GeoJSON 
                       data={getForestsGeoJSON()} 
                       style={{ fillColor: 'rgba(22, 101, 52, 0.2)', color: '#14532d', weight: 1.5 }} 
                     />
                   )}
                 </FeatureGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Fire Risk (Demo)">
                 <FeatureGroup></FeatureGroup>
              </LayersControl.Overlay>
            </LayersControl>
            
            {/* Legend inside map container */}
            <div className="absolute bottom-6 left-6 z-[1000] pointer-events-auto">
              <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 flex flex-col gap-2 shadow-lg">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Legend</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-600 text-xs font-medium">Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-slate-600 text-xs font-medium">Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-slate-600 text-xs font-medium">High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 relative flex items-center justify-center">
                      <div className="absolute -inset-1 bg-red-500/30 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-slate-600 text-xs font-medium ml-1">Critical</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  Data sources:<br/>
                  Fire detections: NASA FIRMS<br/>
                  Administrative boundaries: Hindustan Times Labs<br/>
                  Forest boundaries: OpenStreetMap Contributors
                </div>
              </div>
            </div>

          </MapContainer>
        </div>

        {/* Selected Incident Right Panel / Bottom Sheet */}
        {selectedIncident && (
           <div className="w-full lg:w-80 fixed lg:relative bottom-[calc(env(safe-area-inset-bottom)+60px)] lg:bottom-auto left-0 right-0 z-[2000] lg:z-auto bg-white/95 lg:bg-white backdrop-blur-3xl rounded-t-3xl lg:rounded-3xl p-6 shadow-[0_-10px_40px_rgb(0,0,0,0.2)] lg:shadow-[0_12px_40px_rgb(0,0,0,0.08)] border-t lg:border border-slate-200 overflow-y-auto max-h-[50vh] lg:max-h-none lg:shrink-0 flex flex-col">
             <button 
               onClick={() => setSelectedIncident(null)} 
               className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
             >
               <X className="w-5 h-5" />
             </button>
             
             <div className="mb-6 pr-8">
               <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">{selectedIncident.id}</div>
               <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2">{selectedIncident.title}</h3>
               <p className="text-sm text-slate-500">{selectedIncident.location.district}, {selectedIncident.location.state}</p>
             </div>

             <div className="space-y-4 mb-6 flex-1">
               <div className="flex justify-between items-center py-2 border-b border-slate-200">
                 <span className="text-sm text-slate-500">Coordinates</span>
                 <span className="text-sm font-medium text-slate-900">{selectedIncident.location.coordinates.lat.toFixed(4)}, {selectedIncident.location.coordinates.lng.toFixed(4)}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-200">
                 <span className="text-sm text-slate-500">Forest Screening</span>
                 <span className={`text-sm font-medium ${selectedIncident.detection.forestScreening === 'FOREST' ? 'text-emerald-600' : selectedIncident.detection.forestScreening === 'NEAR FOREST' ? 'text-yellow-600' : 'text-slate-500'}`}>
                   {selectedIncident.detection.forestScreening || 'UNKNOWN'}
                 </span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-200">
                 <span className="text-sm text-slate-500">Satellite</span>
                 <span className="text-sm font-medium text-slate-900">{selectedIncident.title.replace('Satellite Detection (', '').replace(')', '')}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-200">
                 <span className="text-sm text-slate-500">Severity</span>
                 <span className={`text-sm font-bold capitalize ${
                    selectedIncident.severity === 'critical' ? 'text-red-600' : 
                    selectedIncident.severity === 'high' ? 'text-orange-600' : 
                    selectedIncident.severity === 'moderate' ? 'text-yellow-600' : 'text-green-600'
                  }`}>{selectedIncident.severity}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-200">
                 <span className="text-sm text-slate-500">Confidence</span>
                 <span className="text-sm font-medium text-slate-900">{selectedIncident.detection.confidence}%</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-200">
                 <span className="text-sm text-slate-500">FRP (MW)</span>
                 <span className="text-sm font-medium text-slate-900">{selectedIncident.impact.areaAffectedHa}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-200">
                 <span className="text-sm text-slate-500">Time Detected</span>
                 <span className="text-sm font-medium text-slate-900">{new Date(selectedIncident.detection.time).toLocaleString([], {hour: '2-digit', minute:'2-digit', day: '2-digit', month: 'short', year: 'numeric'})}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-200">
                 <span className="text-sm text-slate-500">Data Source</span>
                 <span className="text-sm font-medium text-slate-900">NASA FIRMS</span>
               </div>
             </div>

             <button 
                onClick={() => navigate(`/incidents/${selectedIncident.id}`)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-b from-gray-800 to-gray-900 text-slate-900 rounded-xl text-sm font-semibold tracking-wide hover:from-gray-700 hover:to-gray-800 transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] mt-auto"
              >
                View Full Details
              </button>
           </div>
        )}
      </div>
    </div>
  );
}
