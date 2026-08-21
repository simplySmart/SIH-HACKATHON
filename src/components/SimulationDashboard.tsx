import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, Pause, SkipForward, RotateCcw, Activity, 
  MapPin, Flame, Cpu, Radio, Camera, Satellite, Crosshair, 
  Bell, Truck, CheckCircle, Wind, Thermometer, Map as MapIcon, TreePine, 
  Battery, Zap, Signal, Clock, AlertTriangle, ShieldCheck, Droplets
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ------------------------------------------------------------------
// CONFIGURATION & CONSTANTS
// ------------------------------------------------------------------
const DURATION = 32000; 

const LOC_INDIA: [number, number] = [22, 80];
const LOC_KANGER: [number, number] = [18.885, 81.955];

const FIRE_LOC: [number, number] = [18.885, 81.955];
const S1_LOC: [number, number] = [18.885, 81.955]; 
const S2_LOC: [number, number] = [18.887, 81.953];
const S3_LOC: [number, number] = [18.882, 81.958];
const GATEWAY_LOC: [number, number] = [18.875, 81.940];
const CAM_LOC: [number, number] = [18.890, 81.960];
const VILLAGE_LOC: [number, number] = [18.900, 81.970];

const TIMELINE_EVENTS = [
  { step: 1, startTime: 0, icon: TreePine, title: "Forest Monitoring", desc: "Sensors reporting baseline metrics. Wildlife activity normal.", comment: "Monitoring forest conditions." },
  { step: 2, startTime: 4000, icon: Flame, title: "Early Detection", desc: "Sensor SN-12 detected abnormal temperature and smoke.", comment: "Abnormal environmental conditions detected." },
  { step: 3, startTime: 9000, icon: Radio, title: "Verification", desc: "LoRa, AI Camera, and Satellite verification complete.", comment: "Multiple systems successfully verified the fire." },
  { step: 4, startTime: 15000, icon: AlertTriangle, title: "Incident Formation", desc: "Critical wildfire incident FIRMS-CG-881 generated.", comment: "Critical wildfire incident confirmed." },
  { step: 5, startTime: 19000, icon: Truck, title: "Emergency Response", desc: "Response teams and drone deployed to coordinates.", comment: "Emergency response teams deployed." },
  { step: 6, startTime: 26000, icon: CheckCircle, title: "Containment & Recovery", desc: "Fire spread stopped. Area secured.", comment: "Mission completed successfully." }
];

const lerp = (start: number, end: number, t: number) => start + (end - start) * Math.max(0, Math.min(1, t));
const getProgress = (time: number, startT: number, endT: number) => Math.max(0, Math.min(1, (time - startT) / (endT - startT)));

// Icons
const createIcon = (colorClass: string, iconHtml: string, pulse = false) => L.divIcon({
  className: 'bg-transparent border-0',
  html: `
    <div class="relative w-8 h-8 flex items-center justify-center transition-transform duration-300">
      ${pulse ? `<div class="absolute inset-0 ${colorClass} rounded-full opacity-60 animate-ping"></div>` : ''}
      <div class="absolute inset-0 ${colorClass} rounded-full shadow-lg border border-white/20 flex items-center justify-center">
        ${iconHtml}
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const svgIcons = {
  sensor: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  gateway: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20M17 7l-5-5-5 5M17 17l-5 5-5-5"/></svg>',
  fire: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  camera: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  satellite: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4 4-4-4"/><path d="m8 12 8 8"/><path d="m16 8-8-8"/><path d="m22 2-2 2"/><path d="M14 10l-4-4"/></svg>',
  patrol: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>',
  drone: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20M17 7l-5-5-5 5M17 17l-5 5-5-5"/></svg>',
  village: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
};

// ------------------------------------------------------------------
// MAP CONTROLLER (Handles cinematic fly-in)
// ------------------------------------------------------------------
function MapController({ time, isPlaying }: { time: number, isPlaying: boolean }) {
  const map = useMap();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && time > 0) {
      // Cinematic Fly In
      setTimeout(() => {
        map.flyTo(LOC_KANGER, 15, { duration: 3, easeLinearity: 0.25 });
      }, 500);
      hasInitialized.current = true;
    }
    if (time === 0) {
       map.setView(LOC_INDIA, 5);
       hasInitialized.current = false;
    }
  }, [time, map]);

  return null;
}

export default function SimulationDashboard() {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const reqRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  useEffect(() => {
    const tick = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = now - lastTimeRef.current;
      
      if (isPlaying) {
        setTime(prev => {
          const next = prev + (dt * speed);
          if (next >= DURATION) {
            setIsPlaying(false);
            return DURATION;
          }
          return next;
        });
      }
      lastTimeRef.current = now;
      reqRef.current = requestAnimationFrame(tick);
    };
    reqRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(reqRef.current!);
  }, [isPlaying, speed]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const restart = () => { setIsPlaying(false); setTime(0); };
  const skipNext = () => {
    const nextEvent = TIMELINE_EVENTS.find(e => e.startTime > time + 500);
    if (nextEvent) {
      setTime(nextEvent.startTime);
    } else {
      setTime(DURATION);
      setIsPlaying(false);
    }
  };

  // ------------------------------------------------------------------
  // COMPUTED STATE
  // ------------------------------------------------------------------
  const currentStep = TIMELINE_EVENTS.slice().reverse().find(e => time >= e.startTime)?.step || 1;
  const activeEvent = TIMELINE_EVENTS.find(e => e.step === currentStep);

  const phaseProgress = (time / DURATION) * 100;
  
  // Dynamic Map Entities
  const satProgress = getProgress(time, 9000, 15000);
  const satPos: [number, number] = [lerp(18.895, 18.875, satProgress), lerp(81.945, 81.965, satProgress)];
  
  const drProgress = getProgress(time, 19000, 26000);
  const drPos: [number, number] = [lerp(GATEWAY_LOC[0], FIRE_LOC[0], drProgress), lerp(GATEWAY_LOC[1], FIRE_LOC[1], drProgress)];
  
  const puProgress = getProgress(time, 19000, 26000);
  const puPos: [number, number] = [lerp(GATEWAY_LOC[0], FIRE_LOC[0], puProgress), lerp(GATEWAY_LOC[1], FIRE_LOC[1], puProgress)];

  const fireRadius = time >= 4000 && time < 26000 ? lerp(0, 150, getProgress(time, 4000, 26000)) : 
                     time >= 26000 ? lerp(150, 0, getProgress(time, 26000, 30000)) : 0;
  
  const dangerRadius = time >= 15000 && time < 26000 ? lerp(0, 400, getProgress(time, 15000, 26000)) : 
                       time >= 26000 ? lerp(400, 0, getProgress(time, 26000, 30000)) : 0;

  let sensorColor = 'bg-emerald-500';
  if (time >= 4000) sensorColor = 'bg-orange-500';
  if (time >= 8000) sensorColor = 'bg-red-500';
  if (time >= 26000) sensorColor = 'bg-emerald-500';

  let missionStatus = "NORMAL";
  let statusColor = "text-emerald-400";
  if (time >= 4000) { missionStatus = "INVESTIGATING"; statusColor = "text-orange-400"; }
  if (time >= 15000) { missionStatus = "CRITICAL"; statusColor = "text-red-500"; }
  if (time >= 26000) { missionStatus = "RECOVERY"; statusColor = "text-blue-400"; }

  return (
    <div className="flex flex-col h-screen bg-slate-900 font-sans text-slate-100 relative overflow-hidden z-50">
      
      {/* TOP BAR - CONTROLS */}
      <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-indigo-500/20 rounded flex items-center justify-center">
            <Play className="w-4 h-4 text-indigo-400" />
          </div>
          <h1 className="font-bold text-lg tracking-wide">AFIRN Live Simulation</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={restart} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={togglePlay} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition shadow-lg w-10 h-10 flex items-center justify-center">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
          <button onClick={skipNext} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition">
            <SkipForward className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-slate-700 mx-2"></div>
          
          <button onClick={() => setSpeed(1)} className={`px-2 py-1 text-xs font-bold rounded ${speed === 1 ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>1x</button>
          <button onClick={() => setSpeed(2)} className={`px-2 py-1 text-xs font-bold rounded ${speed === 2 ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>2x</button>
        </div>

        <div className="flex items-center gap-4 w-64">
          <div className="flex-1">
             <input 
               type="range" 
               min="0" max={DURATION} 
               value={time} 
               onChange={(e) => setTime(Number(e.target.value))}
               className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
             />
          </div>
        </div>
        <div className="flex flex-col items-end w-32">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mission Timer</span>
          <span className="font-mono font-bold text-lg text-indigo-400">
            00:{Math.floor(time / 1000).toString().padStart(2, '0')}.{Math.floor((time % 1000) / 10).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* CENTER MAP (70%) */}
        <div className="w-[70%] h-full relative bg-slate-950 border-r border-slate-700">
          <MapContainer center={LOC_INDIA} zoom={5} style={{ height: '100%', width: '100%', background: '#020617' }} zoomControl={false} attributionControl={false} fadeAnimation={true}>
            <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                keepBuffer={8}
            />
            <MapController time={time} isPlaying={isPlaying} />
            
            {/* GATEWAY & VILLAGE */}
            {time > 3000 && (
              <>
                <Marker position={GATEWAY_LOC} icon={createIcon('bg-blue-600', svgIcons.gateway)} />
                <Marker position={VILLAGE_LOC} icon={createIcon(time >= 15000 && time < 26000 ? 'bg-orange-500' : 'bg-purple-600', svgIcons.village, time >= 15000 && time < 26000)} />
              </>
            )}

            {/* SENSORS */}
            {time > 3000 && (
              <>
                <Marker position={S1_LOC} icon={createIcon(sensorColor, svgIcons.sensor, time >= 4000 && time < 26000)} />
                <Marker position={S2_LOC} icon={createIcon(time >= 6000 ? 'bg-orange-500' : 'bg-emerald-500', svgIcons.sensor)} />
                <Marker position={S3_LOC} icon={createIcon(time >= 6000 ? 'bg-orange-500' : 'bg-emerald-500', svgIcons.sensor)} />
              </>
            )}

            {/* FIRE IGNITION & DANGER ZONES */}
            {time >= 4000 && time < 30000 && (
              <Marker position={FIRE_LOC} icon={createIcon(`bg-red-500 border-none transition-transform ${time > 26000 ? 'scale-50 opacity-50' : ''}`, svgIcons.fire, time < 26000)} />
            )}
            {fireRadius > 0 && (
              <Circle center={FIRE_LOC} radius={fireRadius} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, weight: 1 }} className="transition-all duration-100" />
            )}
            {dangerRadius > 0 && (
              <Circle center={FIRE_LOC} radius={dangerRadius} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.1, dashArray: '5,5', weight: 1 }} className="transition-all duration-100" />
            )}

            {/* LORA COMMUNICATION (9s - 15s) */}
            {time >= 9000 && time < 15000 && (
              <Polyline positions={[S1_LOC, GATEWAY_LOC]} color="#3b82f6" weight={3} dashArray="5, 10" className="animated-dash" opacity={0.8} />
            )}

            {/* AI CAMERA (11s+) */}
            {time > 3000 && (
              <Marker position={CAM_LOC} icon={createIcon('bg-indigo-500', svgIcons.camera)}>
                {time >= 11000 && time < 16000 && (
                  <Popup className="cinematic-popup" autoPan={false} closeButton={false}>
                    <div className="w-56 bg-slate-900 overflow-hidden text-white rounded-lg border border-slate-700 shadow-xl">
                      <div className="px-3 py-1.5 bg-slate-800 text-[10px] font-bold flex justify-between">
                          <span>CAM-07 (Live AI)</span>
                          <span className="text-red-500 animate-pulse">● REC</span>
                      </div>
                      <div className="h-32 bg-[url('https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=400')] bg-cover bg-center relative">
                          <div className="absolute top-4 left-6 w-20 h-14 border-2 border-red-500 bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                            <div className="absolute -top-4 left-0 text-[8px] bg-red-500 text-white px-1 font-bold">SMOKE: 96%</div>
                          </div>
                      </div>
                    </div>
                  </Popup>
                )}
              </Marker>
            )}

            {/* SATELLITE (12s - 16s) */}
            {time >= 12000 && time < 16000 && (
              <>
                <Marker position={satPos} icon={createIcon('bg-slate-800', svgIcons.satellite)} />
                <Polyline positions={[satPos, FIRE_LOC]} color="#ef4444" weight={1} dashArray="5,5" opacity={0.5} />
              </>
            )}

            {/* RESPONSE DRONE & PATROL (19s+) */}
            {time >= 19000 && time < 27000 && (
              <>
                <Marker position={drPos} icon={createIcon('bg-slate-600', svgIcons.drone)} />
                <Marker position={puPos} icon={createIcon('bg-slate-800', svgIcons.patrol)} />
                {time < 26000 && (
                  <>
                    <Polyline positions={[puPos, FIRE_LOC]} color="#94a3b8" weight={3} dashArray="4, 8" opacity={0.6} className="animated-dash"/>
                    <Polyline positions={[drPos, FIRE_LOC]} color="#cbd5e1" weight={2} dashArray="4, 8" opacity={0.6} className="animated-dash"/>
                  </>
                )}
              </>
            )}
          </MapContainer>

          {/* VIGNETTE OVERLAY */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-10"></div>
          
          {/* CRITICAL ALARM FLASH (15s - 19s) */}
          <div className={`absolute inset-0 pointer-events-none z-[900] transition-opacity duration-1000 ${time >= 15000 && time < 19000 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute inset-0 border-[10px] border-red-500/30 animate-pulse"></div>
          </div>

          {/* PROGRESS BAR BOTTOM */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800 z-[1000]">
            <div className="h-full bg-indigo-500 transition-all duration-100 ease-linear" style={{ width: `${phaseProgress}%` }}></div>
          </div>

          {/* SENSOR TELEMETRY OVERLAY */}
          <div className={`absolute bottom-6 left-6 w-64 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl p-4 z-[1000] shadow-2xl transition-all duration-700 ${time >= 4000 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-400">SENSOR SN-12</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${time >= 4000 && time < 26000 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {time >= 4000 && time < 26000 ? 'HIGH ALERT' : 'MONITORING'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-1"><Thermometer className="w-3 h-3"/> Temp</span>
                <span className={`font-bold transition-colors ${time >= 4000 && time < 26000 ? 'text-red-400' : 'text-slate-100'}`}>
                  {time >= 8000 && time < 26000 ? '46.2°C' : time >= 4000 ? '39.4°C' : '29.1°C'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-1"><Droplets className="w-3 h-3"/> Hum</span>
                <span className={`font-bold transition-colors ${time >= 4000 && time < 26000 ? 'text-orange-400' : 'text-slate-100'}`}>
                  {time >= 8000 && time < 26000 ? '37%' : time >= 4000 ? '49%' : '58%'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-1"><Wind className="w-3 h-3"/> Smoke</span>
                <span className={`font-bold transition-colors ${time >= 4000 && time < 26000 ? 'text-red-400' : 'text-slate-100'}`}>
                  {time >= 8000 && time < 26000 ? '192 AQI' : time >= 4000 ? '84 AQI' : '18 AQI'}
                </span>
              </div>
            </div>
          </div>

          {/* INCIDENT CARD OVERLAY */}
          <div className={`absolute top-6 right-6 w-72 bg-slate-900/90 backdrop-blur border border-red-500/30 rounded-xl p-4 z-[1000] shadow-2xl transition-all duration-700 ${time >= 15000 && time < 30000 ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-red-400 font-black tracking-wide">FIRMS-CG-881</h3>
                <p className="text-[10px] text-slate-400">Kanger Valley National Park</p>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${time >= 26000 ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                {time >= 26000 ? 'CONTAINED' : 'CRITICAL'}
              </span>
            </div>
            
            <div className="bg-slate-950 p-2 rounded mb-3">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>FIRE CONFIDENCE</span>
                <span className="text-emerald-400">96%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[96%]"></div>
              </div>
              <div className="flex gap-1 mt-2">
                <span className="px-1 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold rounded">IOT ✔</span>
                <span className="px-1 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold rounded">CAM ✔</span>
                <span className="px-1 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold rounded">SAT ✔</span>
              </div>
            </div>

            {time >= 19000 && time < 26000 && (
              <div className="space-y-2 mt-3 pt-3 border-t border-slate-700">
                <button className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded transition">
                  NAVIGATE DRONE
                </button>
                <button className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold rounded transition">
                  ASSIGN ADDITIONAL UNITS
                </button>
              </div>
            )}
          </div>

          {/* END SUMMARY OVERLAY */}
          {time >= 26000 && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-[2000] flex items-center justify-center animate-in fade-in duration-1000">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-xl w-full shadow-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Simulation Complete</h2>
                <p className="text-slate-400 mb-8">AFIRN enhances the existing forest fire monitoring system with earlier detection, multi-source verification, resilient offline communication and intelligent decision support.</p>
                
                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-left">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Detection Time</span>
                    <span className="text-xl font-bold text-white">4.2 Seconds</span>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-left">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Verification</span>
                    <span className="text-xl font-bold text-white">Multi-modal</span>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-left">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Response Triggered</span>
                    <span className="text-xl font-bold text-white">&lt; 15 Seconds</span>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-left">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Forest Saved</span>
                    <span className="text-xl font-bold text-emerald-400">1,200 Hectares</span>
                  </div>
                </div>
                
                <button onClick={restart} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition">
                  Run Simulation Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL (30%) */}
        <div className="w-[30%] bg-slate-900 border-l border-slate-700 flex flex-col h-full relative z-20">
          
          <div className="p-6 border-b border-slate-800 bg-slate-950 shrink-0">
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Live Mission Status</div>
             <div className="flex items-center gap-3">
               <div className={`w-3 h-3 rounded-full animate-pulse ${time >= 15000 && time < 26000 ? 'bg-red-500' : time >= 4000 && time < 15000 ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
               <span className={`text-xl font-black tracking-wide ${statusColor}`}>{missionStatus}</span>
             </div>
             
             {activeEvent && (
                <div className="mt-4 p-3 bg-slate-800 border border-slate-700 rounded-lg animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-300">SYSTEM COMMENTARY</span>
                  </div>
                  <p className="text-sm text-indigo-200">{activeEvent.comment}</p>
                </div>
             )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Mission Timeline</h3>
            <div className="relative border-l-2 border-slate-700 ml-4 space-y-8">
              {TIMELINE_EVENTS.map((event) => {
                const isPast = time >= event.startTime && event.step < currentStep;
                const isCurrent = event.step === currentStep;
                const isFuture = event.step > currentStep;
                const Icon = event.icon;

                return (
                  <div key={event.step} className="relative pl-6">
                    <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-900 transition-colors duration-500
                      ${isPast ? 'bg-emerald-500' : isCurrent ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}
                    `}>
                      {isPast ? <CheckCircle className="w-4 h-4 text-slate-900" /> : <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />}
                    </div>
                    
                    <div className={`transition-all duration-500 ${isFuture ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                      <h4 className={`text-sm font-bold mb-1 ${isCurrent ? 'text-indigo-400' : 'text-slate-200'}`}>{event.title}</h4>
                      <p className={`text-xs ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>{event.desc}</p>
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
