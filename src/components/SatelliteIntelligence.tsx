import { useState, useEffect } from 'react';
import { Satellite, Radio, CheckCircle, Clock, MapPin, Activity, ShieldAlert, ExternalLink, Filter } from 'lucide-react';
import { MapContainer, TileLayer, Marker, ZoomControl, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { SatelliteDetection, SatellitePass, SatelliteStatus, FireIncident } from '../types';
import { SatelliteService } from '../services/satelliteService';
import { FireService } from '../services/fireService';
import { useNavigate } from 'react-router-dom';

const viirsIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div class="w-4 h-4 bg-purple-600 border-2 border-white rounded-full shadow-md"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const modisIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-md"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const incidentIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div class="w-5 h-5 bg-red-600 border-2 border-white rounded-md shadow-md flex items-center justify-center animate-pulse"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const getScreeningColor = (status: string) => {
  switch(status) {
    case 'FOREST': return 'bg-red-50 text-red-700 border-red-200';
    case 'NEAR FOREST': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'NON-FOREST': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'UNKNOWN': return 'bg-gray-50 text-gray-700 border-gray-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export default function SatelliteIntelligence() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<SatelliteStatus[]>([]);
  const [passes, setPasses] = useState<SatellitePass[]>([]);
  const [detections, setDetections] = useState<SatelliteDetection[]>([]);
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  
  const [filters, setFilters] = useState({
    viirs: true,
    modis: true,
    incidents: true,
    historical: false,
    forest: true,
    nearForest: true,
    nonForest: true,
    unknown: true
  });

  const [selectedDetection, setSelectedDetection] = useState<SatelliteDetection | null>(null);

  useEffect(() => {
    SatelliteService.getStatus().then(setStatus);
    SatelliteService.getPasses().then(setPasses);
    SatelliteService.getDetections().then(setDetections);
    FireService.getIncidents().then(setIncidents);
  }, []);

  const visibleDetections = detections.filter(d => {
    if (d.satelliteName === 'VIIRS' && !filters.viirs) return false;
    if (d.satelliteName === 'MODIS' && !filters.modis) return false;
    
    // Screening filters
    if (d.forestScreening === 'FOREST' && !filters.forest) return false;
    if (d.forestScreening === 'NEAR FOREST' && !filters.nearForest) return false;
    if (d.forestScreening === 'NON-FOREST' && !filters.nonForest) return false;
    if (d.forestScreening === 'UNKNOWN' && !filters.unknown) return false;

    return true;
  });

  const visibleIncidents = filters.incidents ? incidents : [];

  // A hardcoded visually structured timeline for demo based on requested example
  const timelineEvents = [
    { time: '10:42', label: 'VIIRS pass', type: 'pass', active: true },
    { time: '10:48', label: 'New detections (3)', type: 'detection', active: true },
    { time: '11:07', label: 'MODIS update', type: 'pass', active: true },
    { time: '11:10', label: 'New detection', type: 'detection', active: true },
    { time: '14:15', label: 'VIIRS upcoming', type: 'scheduled', active: false }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F5F7F6] overflow-hidden rounded-3xl">
      <header className="px-6 py-5 shrink-0 flex justify-between items-center bg-white border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Satellite Intelligence</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Near-real-time fire detection and satellite evidence.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-md border border-green-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">System Operational</span>
          </div>
          <span className="bg-orange-100 text-orange-800 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-orange-200">
            Demo Data
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        {/* Status Cards & Filters */}
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {status.map(s => (
              <div key={s.name} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${s.name === 'VIIRS' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                      <Satellite className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{s.name}</div>
                      <div className="text-xs font-semibold text-green-600 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        {s.status}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{s.latestPass}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Latest Pass</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Detections</div>
                    <div className="font-bold text-gray-900">{s.detectionCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Resolution</div>
                    <div className="font-bold text-gray-900">{s.resolution}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Updated</div>
                    <div className="font-bold text-gray-900">{s.lastUpdate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full xl:w-[450px] bg-white rounded-xl border border-gray-200 p-4 shadow-sm shrink-0">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Map Filters
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button 
                onClick={() => setFilters(f => ({...f, viirs: !f.viirs}))}
                className={`py-2 px-3 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${filters.viirs ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                <div className={`w-3 h-3 rounded-full ${filters.viirs ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                VIIRS
              </button>
              <button 
                onClick={() => setFilters(f => ({...f, modis: !f.modis}))}
                className={`py-2 px-3 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${filters.modis ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                <div className={`w-3 h-3 rounded-full ${filters.modis ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                MODIS
              </button>
              <button 
                onClick={() => setFilters(f => ({...f, incidents: !f.incidents}))}
                className={`py-2 px-3 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${filters.incidents ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                <div className={`w-3 h-3 rounded-md ${filters.incidents ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                Incidents
              </button>
              <button 
                onClick={() => setFilters(f => ({...f, historical: !f.historical}))}
                className={`py-2 px-3 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${filters.historical ? 'bg-gray-800 border-gray-900 text-white' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                Historical (Demo)
              </button>
            </div>
            
            <div className="h-[1px] w-full bg-gray-100 my-3"></div>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setFilters(f => ({...f, forest: !f.forest}))}
                className={`py-1.5 px-2 rounded-md border text-[11px] font-bold flex items-center gap-1.5 transition-colors ${filters.forest ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
              >
                <div className={`w-2 h-2 rounded-full ${filters.forest ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                FOREST
              </button>
              <button 
                onClick={() => setFilters(f => ({...f, nearForest: !f.nearForest}))}
                className={`py-1.5 px-2 rounded-md border text-[11px] font-bold flex items-center gap-1.5 transition-colors ${filters.nearForest ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
              >
                <div className={`w-2 h-2 rounded-full ${filters.nearForest ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                NEAR FOREST
              </button>
              <button 
                onClick={() => setFilters(f => ({...f, nonForest: !f.nonForest}))}
                className={`py-1.5 px-2 rounded-md border text-[11px] font-bold flex items-center gap-1.5 transition-colors ${filters.nonForest ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
              >
                <div className={`w-2 h-2 rounded-full ${filters.nonForest ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                NON-FOREST
              </button>
              <button 
                onClick={() => setFilters(f => ({...f, unknown: !f.unknown}))}
                className={`py-1.5 px-2 rounded-md border text-[11px] font-bold flex items-center gap-1.5 transition-colors ${filters.unknown ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
              >
                <div className={`w-2 h-2 rounded-full ${filters.unknown ? 'bg-gray-500' : 'bg-gray-300'}`}></div>
                UNKNOWN
              </button>
            </div>
            
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-100 flex items-start gap-2">
               <ShieldAlert className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
               <p className="text-[9px] text-blue-800 font-medium leading-tight">
                 Satellite thermal anomaly does not necessarily indicate a forest fire. Screened against GIS datasets.
               </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 h-auto xl:h-[550px]">
          
          {/* Timeline - Hidden on mobile for space, or made small */}
          <div className="hidden xl:flex w-full xl:w-56 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex-col shrink-0">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6">Pass Timeline</h3>
            <div className="relative pl-6 flex-1">
              <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
              <div className="space-y-6">
                {timelineEvents.map((ev, idx) => (
                  <div key={idx} className="relative z-10">
                    <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                      ev.active ? (ev.type === 'pass' ? 'bg-blue-500' : 'bg-red-500') : 'bg-gray-300'
                    }`}></div>
                    <div className={`text-sm font-bold ${ev.active ? 'text-gray-900' : 'text-gray-400'}`}>{ev.time}</div>
                    <div className={`text-xs ${ev.active ? 'text-gray-600' : 'text-gray-400'}`}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 w-full h-[400px] xl:h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative z-0">
            <MapContainer 
              center={[19.5, 81.0]} 
              zoom={7} 
              zoomControl={false}
              className="w-full h-full z-0"
            >
              <ZoomControl position="bottomright" />
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
              
              {/* Detections */}
              {visibleDetections.map(det => (
                <Marker 
                  key={det.id}
                  position={[det.coordinates.lat, det.coordinates.lng]}
                  icon={det.satelliteName === 'VIIRS' ? viirsIcon : modisIcon}
                  eventHandlers={{
                    click: () => setSelectedDetection(det)
                  }}
                >
                  <Tooltip>{det.satelliteName} Det: {det.confidence}%</Tooltip>
                </Marker>
              ))}

              {/* Incidents */}
              {visibleIncidents.map(inc => (
                <Marker 
                  key={inc.id}
                  position={[inc.location.coordinates.lat, inc.location.coordinates.lng]}
                  icon={incidentIcon}
                >
                  <Tooltip>{inc.id} - {inc.status}</Tooltip>
                </Marker>
              ))}
              <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-gray-200 shadow-sm text-[10px] text-gray-600 font-medium">
                Data Provenance: Forest screening relies on publicly available open geospatial forest datasets. 
              </div>
            </MapContainer>
          </div>

          {/* Side Panel */}
          {selectedDetection && (
            <div className="w-full xl:w-[400px] fixed xl:relative bottom-[calc(env(safe-area-inset-bottom)+60px)] xl:bottom-auto left-0 right-0 z-[2000] xl:z-auto bg-white rounded-t-3xl xl:rounded-2xl border-t xl:border border-gray-200 shadow-[0_-10px_40px_rgb(0,0,0,0.1)] xl:shadow-sm flex flex-col shrink-0 overflow-y-auto max-h-[50vh] xl:max-h-none xl:h-full">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{selectedDetection.id}</h3>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{selectedDetection.satelliteName} Detection</div>
                </div>
                <button 
                  onClick={() => setSelectedDetection(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Core Meta */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Timestamp
                    </div>
                    <div className="text-sm font-bold text-gray-900">{selectedDetection.timestamp}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Coordinates
                    </div>
                    <div className="text-sm font-bold text-gray-900">{selectedDetection.coordinates.lat.toFixed(4)}, {selectedDetection.coordinates.lng.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> District
                    </div>
                    <div className="text-sm font-bold text-gray-900">{selectedDetection.district}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> FRP
                    </div>
                    <div className="text-sm font-bold text-gray-900">{selectedDetection.frp ? `${selectedDetection.frp} MW` : 'N/A'}</div>
                  </div>
                </div>

                {/* Confidence & Screening */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="text-[10px] font-bold text-gray-500 uppercase">Detection Confidence</div>
                      <div className="text-sm font-bold text-gray-900">{selectedDetection.confidence}%</div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${selectedDetection.confidence > 85 ? 'bg-red-500' : selectedDetection.confidence > 60 ? 'bg-orange-500' : 'bg-yellow-500'}`} style={{ width: `${selectedDetection.confidence}%` }}></div>
                    </div>
                  </div>

                  <div className={`p-3 border rounded-xl flex items-start gap-3 ${getScreeningColor(selectedDetection.forestScreening || 'UNKNOWN')}`}>
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-70">Screening Result</div>
                      <div className="text-sm font-bold">{selectedDetection.forestScreening || 'UNKNOWN'}</div>
                      <div className="text-xs mt-1 opacity-80">
                        Context: {selectedDetection.landContext || 'Unknown'}<br/>
                        {selectedDetection.screeningDistance != null && selectedDetection.screeningDistance > 0 && 
                          `Distance to nearest forest: ${selectedDetection.screeningDistance.toFixed(2)} km`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lifecycle Relationship */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Detection → Incident Flow</h4>
                  <div className="flex flex-col space-y-3 relative">
                    <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gray-100"></div>
                    {[
                      { label: 'Satellite Detection', active: true },
                      { label: 'Forest mask verification', active: true },
                      { label: 'Risk evaluation', active: true },
                      { label: 'Incident creation', active: selectedDetection.linkedIncidentId != null },
                      { label: 'Multi-source confirmation', active: selectedDetection.linkedIncidentId != null }
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 relative z-10">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step.active ? 'bg-green-500 border-white text-white shadow-sm' : 'bg-gray-100 border-white text-gray-300'}`}>
                          <CheckCircle className="w-3 h-3" />
                        </div>
                        <span className={`text-xs font-bold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {selectedDetection.linkedIncidentId && (
                <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                  <button 
                    onClick={() => navigate(`/incidents/${selectedDetection.linkedIncidentId}`)}
                    className="w-full py-3 px-4 bg-[#193F27] hover:bg-[#2B7A41] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    Open Linked Incident
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
