import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, FastForward, Activity, 
  MapPin, Flame, Cpu, Radio, Eye, Satellite, Crosshair, Bell, Truck, CheckCircle, Clock, Navigation, AlertTriangle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SCENARIO_STEPS = [
  { id: 1, title: 'Normal Forest', icon: Activity, desc: 'Sensors online. Normal conditions.' },
  { id: 2, title: 'Fire Starts', icon: Flame, desc: 'Ignition detected by nearest sensor.' },
  { id: 3, title: 'Adaptive Sensor Network', icon: Cpu, desc: 'Nearby nodes enter High Alert.' },
  { id: 4, title: 'LoRa Communication', icon: Radio, desc: 'Alert transmitted via mesh.' },
  { id: 5, title: 'AI Verification', icon: Eye, desc: 'Camera detects smoke (95%).' },
  { id: 6, title: 'Satellite Confirmation', icon: Satellite, desc: 'VIIRS hotspot confirmed.' },
  { id: 7, title: 'Fire Confidence Engine', icon: Crosshair, desc: 'Multi-modal confidence 96%.' },
  { id: 8, title: 'Incident Created', icon: AlertTriangle, desc: 'Critical severity assigned.' },
  { id: 9, title: 'Officer Alert', icon: Bell, desc: 'Command center notified.' },
  { id: 10, title: 'Response Dispatched', icon: Truck, desc: 'Patrol unit routed to scene.' },
  { id: 11, title: 'Fire Spread Simulation', icon: Navigation, desc: 'Spread vector calculated.' },
  { id: 12, title: 'Containment', icon: CheckCircle, desc: 'Fire contained. Recovery phase.' }
];

const LOGS_DB = [
  { step: 1, time: '08:00:00', msg: 'System initialized. All sensors reporting normal.' },
  { step: 2, time: '08:32:15', msg: 'Smoke detected by Sensor S-104.' },
  { step: 2, time: '08:32:21', msg: 'Temperature exceeded threshold (55°C).' },
  { step: 3, time: '08:32:29', msg: 'Nearby sensors S-105, S-106 entering Fire Mode.' },
  { step: 4, time: '08:32:38', msg: 'LoRa transmission successful via Gateway G-02.' },
  { step: 5, time: '08:33:04', msg: 'AI verification completed. Smoke confirmed.' },
  { step: 6, time: '08:33:40', msg: 'NASA VIIRS satellite hotspot received.' },
  { step: 7, time: '08:34:01', msg: 'Confidence reached 96%.' },
  { step: 8, time: '08:34:15', msg: 'Incident ID: FIRMS-CG-881 created.' },
  { step: 9, time: '08:34:20', msg: 'Officer notified on EOC dashboard.' },
  { step: 10, time: '08:36:10', msg: 'Patrol Unit PU-01 deployed.' },
  { step: 11, time: '08:45:00', msg: 'Fire spread mapped. Wind spreading NE.' },
  { step: 12, time: '09:20:00', msg: 'Fire successfully contained.' }
];

// Reusable icons
const createIcon = (color: string, html: string) => L.divIcon({
  className: 'bg-transparent border-0',
  html: `<div class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center ${color} text-white font-bold text-xs border-2 border-white">${html}</div>`,
  iconSize: [32, 32], iconAnchor: [16, 16]
});

// Hack to re-center map
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export default function SimulationDashboard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= 12) {
            setIsPlaying(false);
            return 12;
          }
          return prev + 1;
        });
      }, 3000 / speed);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleRestart = () => { setIsPlaying(false); setCurrentStep(1); };
  const handleNext = () => setCurrentStep(prev => Math.min(12, prev + 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(1, prev - 1));

  // Derived state based on step
  const activeLogs = LOGS_DB.filter(l => l.step <= currentStep);
  
  const temp = currentStep < 2 ? 39 : currentStep < 12 ? Math.min(65, 39 + (currentStep * 4)) : 42;
  const smoke = currentStep < 2 ? 'Normal' : currentStep < 12 ? 'High' : 'Clearing';
  const co = currentStep < 2 ? '400 ppm' : currentStep < 12 ? '1200 ppm' : '600 ppm';
  const confidence = currentStep < 5 ? 0 : currentStep === 5 ? 45 : currentStep === 6 ? 81 : currentStep >= 7 ? 96 : 0;
  const status = currentStep < 8 ? 'NORMAL' : currentStep < 12 ? 'CRITICAL' : 'RECOVERY';
  
  // Map elements
  const fireLoc = [20.27, 81.47];
  const gatewayLoc = [20.25, 81.45];
  const villageLoc = [20.29, 81.49];
  const unitLoc = currentStep >= 10 ? [20.275, 81.475] : [20.20, 81.40];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-gray-900 rounded-3xl overflow-hidden font-sans shadow-2xl absolute inset-0 z-50">
      
      {/* HEADER & CONTROLS */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">AFIRN Simulation Mode</h1>
            <p className="text-xs text-gray-500 font-medium">Smart India Hackathon Demonstration - Kanker Forest</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-lg">
            <button onClick={handleRestart} className="p-2 hover:bg-white rounded text-gray-600 shadow-sm transition"><SkipBack className="w-4 h-4" /></button>
            <button onClick={handlePrev} className="p-2 hover:bg-white rounded text-gray-600 shadow-sm transition"><SkipBack className="w-4 h-4 rotate-180" /></button>
            <button onClick={handlePlayPause} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded shadow-md transition">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button onClick={handleNext} className="p-2 hover:bg-white rounded text-gray-600 shadow-sm transition"><SkipForward className="w-4 h-4" /></button>
          </div>
          
          <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-lg text-sm font-bold text-gray-600">
            <button onClick={() => setSpeed(1)} className={`px-3 py-1.5 rounded ${speed === 1 ? 'bg-white shadow-sm text-gray-900' : ''}`}>1x</button>
            <button onClick={() => setSpeed(2)} className={`px-3 py-1.5 rounded ${speed === 2 ? 'bg-white shadow-sm text-gray-900' : ''}`}>2x</button>
            <button onClick={() => setSpeed(4)} className={`px-3 py-1.5 rounded ${speed === 4 ? 'bg-white shadow-sm text-gray-900' : ''}`}>4x</button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Live Sensor Data */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Mission Status</div>
            <div className={`p-3 rounded-xl font-black text-center text-lg uppercase tracking-widest ${status === 'NORMAL' ? 'bg-green-100 text-green-700' : status === 'CRITICAL' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
              {status}
            </div>
          </div>
          
          <div className="p-4 space-y-4 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Live Telemetry</div>
            
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="text-xs text-gray-500 font-medium mb-1 flex justify-between"><span>Temperature</span> <span>39°C Base</span></div>
              <div className={`text-2xl font-bold ${temp > 50 ? 'text-red-500' : 'text-gray-900'}`}>{temp}°C</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="text-xs text-gray-500 font-medium mb-1 flex justify-between"><span>Humidity</span> <span>22% Base</span></div>
              <div className="text-2xl font-bold text-orange-500">22%</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="text-xs text-gray-500 font-medium mb-1 flex justify-between"><span>Smoke Level</span></div>
              <div className={`text-xl font-bold ${smoke === 'High' ? 'text-red-500' : 'text-gray-900'}`}>{smoke}</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="text-xs text-gray-500 font-medium mb-1 flex justify-between"><span>CO Level</span></div>
              <div className={`text-xl font-bold ${co === '1200 ppm' ? 'text-red-500' : 'text-gray-900'}`}>{co}</div>
            </div>

            {currentStep >= 7 && (
              <div className="mt-6 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white shadow-lg border border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/20 blur-xl rounded-full"></div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 relative z-10">Confidence Engine</div>
                <div className="text-4xl font-black text-green-400 relative z-10 mb-2">{confidence}%</div>
                <div className="flex flex-wrap gap-1 relative z-10">
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">Satellite ✔</span>
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">IoT ✔</span>
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">AI ✔</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER PANEL: Map & Logs */}
        <div className="flex-1 flex flex-col">
          {/* MAP */}
          <div className="flex-1 relative bg-gray-200">
            <MapContainer center={fireLoc as [number, number]} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              <MapUpdater center={currentStep >= 10 ? fireLoc as [number, number] : fireLoc as [number, number]} zoom={currentStep >= 10 ? 14 : 12} />
              
              {/* Nodes */}
              <Marker position={[20.27, 81.47]} icon={createIcon(currentStep >= 2 ? 'bg-red-500' : 'bg-green-500', 'S1')} />
              <Marker position={[20.275, 81.475]} icon={createIcon(currentStep >= 3 ? 'bg-orange-500' : 'bg-green-500', 'S2')} />
              <Marker position={[20.265, 81.465]} icon={createIcon(currentStep >= 3 ? 'bg-orange-500' : 'bg-green-500', 'S3')} />
              
              {/* Gateway */}
              <Marker position={gatewayLoc as [number, number]} icon={createIcon('bg-blue-600', 'GW')} />
              
              {/* Village */}
              <Marker position={villageLoc as [number, number]} icon={createIcon('bg-purple-500', 'VL')} />
              
              {/* Animations / Connections */}
              {currentStep >= 4 && (
                <Polyline positions={[[20.27, 81.47], gatewayLoc as [number, number]]} color="#3b82f6" dashArray="5, 10" weight={3} className="animate-pulse" />
              )}
              
              {/* Fire Spread */}
              {currentStep >= 8 && (
                <Circle center={fireLoc as [number, number]} radius={currentStep >= 11 ? 800 : 400} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }} />
              )}
              
              {/* Patrol Unit */}
              {currentStep >= 10 && (
                <Marker position={unitLoc as [number, number]} icon={createIcon('bg-gray-800', 'PU')} />
              )}
              {currentStep >= 10 && currentStep < 12 && (
                <Polyline positions={[unitLoc as [number, number], fireLoc as [number, number]]} color="#1f2937" dashArray="4, 8" weight={2} />
              )}
            </MapContainer>
            
            {/* Top Overlay Indicator */}
            <div className="absolute top-4 left-4 right-4 flex justify-center z-[1000] pointer-events-none">
              <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-gray-200 flex items-center gap-3">
                {React.createElement(SCENARIO_STEPS[currentStep-1].icon, { className: "w-5 h-5 text-green-600" })}
                <span className="font-bold text-gray-900">Step {currentStep}: {SCENARIO_STEPS[currentStep-1].title}</span>
              </div>
            </div>
          </div>

          {/* LOGS */}
          <div className="h-48 bg-white border-t border-gray-200 p-0 flex flex-col shrink-0">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
              <span>Real-Time System Logs</span>
              <span>{activeLogs.length} Events</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm flex flex-col-reverse custom-scrollbar">
              {[...activeLogs].reverse().map((log, i) => (
                <div key={i} className="flex gap-4 items-start animate-fade-in-up">
                  <span className="text-gray-400 shrink-0">[{log.time}]</span>
                  <span className={`font-medium ${log.msg.includes('Critical') || log.msg.includes('Incident') ? 'text-red-600' : log.msg.includes('contained') ? 'text-green-600' : 'text-gray-700'}`}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Timeline */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100 bg-gray-50 shrink-0">
            <h3 className="font-bold text-gray-900">Simulation Timeline</h3>
            <p className="text-xs text-gray-500 mt-1">Hackathon Showcase Flow</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
            <div className="absolute left-[31px] top-8 bottom-8 w-0.5 bg-gray-100"></div>
            <div className="space-y-6 relative z-10">
              {SCENARIO_STEPS.map((step) => {
                const isActive = step.id === currentStep;
                const isPast = step.id < currentStep;
                return (
                  <div key={step.id} className={`flex gap-4 items-start transition-opacity duration-300 ${isPast || isActive ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 ${isActive ? 'bg-green-500 border-green-200 text-white shadow-lg shadow-green-500/30' : isPast ? 'bg-green-100 border-transparent text-green-600' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                      {isPast ? <CheckCircle className="w-4 h-4" /> : React.createElement(step.icon, { className: "w-4 h-4" })}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isActive ? 'text-green-600' : 'text-gray-900'}`}>{step.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
