const fs = require('fs');
const file = 'src/components/SimulationDashboard.tsx';

const code = `
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, Pause, SkipBack, Activity, 
  MapPin, Flame, Cpu, Radio, Camera, Satellite, Crosshair, 
  Bell, Truck, CheckCircle, Wind, Thermometer, Map as MapIcon, TreePine, 
  Battery, Zap, Signal, Clock, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ------------------------------------------------------------------
// CONFIGURATION & CONSTANTS
// ------------------------------------------------------------------
const DURATION = 30000; // 30 Seconds Total

const FIRE_LOC: [number, number] = [18.885, 81.955];
const S1_LOC: [number, number] = [18.885, 81.955]; // SN-12
const S2_LOC: [number, number] = [18.887, 81.953];
const S3_LOC: [number, number] = [18.882, 81.958];
const GATEWAY_LOC: [number, number] = [18.875, 81.940];
const CAM_LOC: [number, number] = [18.890, 81.960];
const VILLAGE_LOC: [number, number] = [18.900, 81.970];

const TIMELINE_EVENTS = [
  { step: 1, startTime: 0, timeStr: "10:18:00", icon: TreePine, title: "Normal Forest", desc: "System initialized. Normal conditions.", comment: "Monitoring forest conditions...", detail: "All sensors reporting baseline metrics. Wildlife activity normal." },
  { step: 2, startTime: 4000, timeStr: "10:18:42", icon: Flame, title: "Possible Ignition", desc: "Small flame detected beneath dry leaves.", comment: "Abnormal temperature detected.", detail: "A tiny ignition point has formed. Smoke is beginning to rise, but still below critical threshold." },
  { step: 3, startTime: 6000, timeStr: "10:19:05", icon: Cpu, title: "IoT Sensor Triggered", desc: "Sensor SN-12 detected abnormal temperature and smoke.", comment: "Nearby sensors automatically activated.", detail: "Temperature increased from 29°C to 46°C. Particulate matter spiking." },
  { step: 4, startTime: 9000, timeStr: "10:19:17", icon: Radio, title: "LoRa Mesh Activated", desc: "Sensor transmitted data through LoRa network.", comment: "Gateway successfully received the packet.", detail: "Mesh routing path established. Signal strength -85dBm." },
  { step: 5, startTime: 11000, timeStr: "10:19:34", icon: Camera, title: "AI Camera Verification", desc: "Forest camera detected smoke plume.", comment: "Smoke verified by AI.", detail: "Camera CAM-07 detected dense smoke. YOLO model identified smoke with 96% confidence. Bounding box generated." },
  { step: 6, startTime: 13000, timeStr: "10:20:08", icon: Satellite, title: "Satellite Confirmation", desc: "VIIRS hotspot received. Heat signature confirmed.", comment: "Satellite hotspot received.", detail: "NASA FIRMS data confirms thermal anomaly matching exact sensor coordinates." },
  { step: 7, startTime: 15000, timeStr: "10:20:25", icon: Crosshair, title: "Fire Confidence Updated", desc: "Confidence increased to 96%. Incident classified as Critical.", comment: "Fire Confidence reached 96%.", detail: "Multi-modal verification complete. Automated incident FIRMS-CG-881 generated." },
  { step: 8, startTime: 17000, timeStr: "10:20:36", icon: Bell, title: "Officer Alert Sent", desc: "Forest Control Room notified. Nearest Beat informed.", comment: "Officer response initiated.", detail: "Automated dispatch protocols activated. Notification delivered to Cmdr. Verma's device." },
  { step: 9, startTime: 19000, timeStr: "10:21:18", icon: Truck, title: "Patrol Dispatched", desc: "Patrol Unit 03 started navigation. ETA 12 minutes.", comment: "Response teams en route.", detail: "Drone launched from Ranger Station for aerial overwatch. Ground units navigating via shortest path." },
  { step: 10, startTime: 26000, timeStr: "10:32:14", icon: CheckCircle, title: "Fire Contained", desc: "Fire spread successfully stopped.", comment: "Containment successful.", detail: "Mission status changed to Recovery. 1,200 Hectares of forest saved." }
];

// ------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------
const lerp = (start: number, end: number, t: number) => start + (end - start) * Math.max(0, Math.min(1, t));
const getProgress = (time: number, startT: number, endT: number) => Math.max(0, Math.min(1, (time - startT) / (endT - startT)));

// Icons
const createIcon = (colorClass: string, iconHtml: string, pulse = false) => L.divIcon({
  className: 'bg-transparent border-0',
  html: \`
    <div class="relative w-8 h-8 flex items-center justify-center transition-transform duration-300">
      \${pulse ? \`<div class="absolute inset-0 \${colorClass} rounded-full opacity-60 animate-ping"></div>\` : ''}
      <div class="absolute w-8 h-8 \${colorClass} rounded-full shadow-[0_0_20px_rgba(0,0,0,0.7)] flex items-center justify-center text-white border-2 border-white/50 backdrop-blur-md z-10 transition-colors duration-500">
        \${iconHtml}
      </div>
    </div>\`,
  iconSize: [32, 32], iconAnchor: [16, 16]
});

const svgIcons = {
  sensor: \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>\`,
  gateway: \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>\`,
  camera: \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>\`,
  village: \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>\`,
  fire: \`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>\`,
  patrol: \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>\`,
  drone: \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>\`,
  satellite: \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2.05v3M13 18.95v3M2.05 13h3M18.95 13h3M21.18 5.64l-2.12 2.12M4.94 17.66l-2.12 2.12M21.18 20.36l-2.12-2.12M4.94 8.34l-2.12-2.12M13 13m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0"/></svg>\`
};

// ------------------------------------------------------------------
// MAP CONTROLLER (Handles smooth cinematic camera moves)
// ------------------------------------------------------------------
function MapController({ time, isPlaying }: { time: number, isPlaying: boolean }) {
  const map = useMap();
  const prevTime = useRef(0);

  useEffect(() => {
    if (!isPlaying && time === 0) {
      map.setView([22, 80], 5, { animate: false });
      prevTime.current = 0;
    } else if (isPlaying) {
      const crossed = (t: number) => prevTime.current < t && time >= t;
      
      // Cinematic Camera Sequence
      if (crossed(100)) map.flyTo(FIRE_LOC, 14, { duration: 4, easeLinearity: 0.25 }); // 0s: Dive into forest
      if (crossed(4000)) map.flyTo(FIRE_LOC, 16, { duration: 5, easeLinearity: 0.1 }); // 4s: Zoom into ignition
      if (crossed(9000)) map.flyTo([18.880, 81.945], 15, { duration: 4 }); // 9s: Pan to LoRa gateway
      if (crossed(13000)) map.flyTo([18.885, 81.955], 11, { duration: 4 }); // 13s: Zoom out for satellite pass
      if (crossed(16000)) map.flyTo([18.890, 81.960], 14, { duration: 4 }); // 16s: Pan to village / camera
      if (crossed(19000)) map.flyTo(FIRE_LOC, 15, { duration: 5 }); // 19s: Track back to fire for response
      if (crossed(26000)) map.flyTo(FIRE_LOC, 13, { duration: 4 }); // 26s: Containment zoom out
      
      prevTime.current = time;
    }
  }, [time, isPlaying, map]);
  return null;
}

// ------------------------------------------------------------------
// MAIN DASHBOARD COMPONENT
// ------------------------------------------------------------------
export default function SimulationDashboard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0); // 0 to 30000 ms
  const timelineRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastTickRef = useRef<number>(0);

  // Core Simulation Loop (30fps state updates to keep React fast)
  useEffect(() => {
    const loop = (now: number) => {
      if (!isPlaying) {
        lastTickRef.current = now;
        requestRef.current = requestAnimationFrame(loop);
        return;
      }
      
      const dt = now - lastTickRef.current;
      
      // Throttle React state updates to ~30fps (33ms) for performance, 
      // while Leaflet CSS/Transforms stay smooth.
      if (dt > 33) {
        lastTickRef.current = now;
        setTime(prev => {
          const next = prev + dt;
          if (next >= DURATION) {
            setIsPlaying(false);
            return DURATION;
          }
          return next;
        });
      }
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isPlaying]);

  // Derived State (Calculated on the fly for perfect synchronization)
  const stepObj = [...TIMELINE_EVENTS].reverse().find(e => time >= e.startTime) || TIMELINE_EVENTS[0];
  const step = stepObj.step;
  
  const tIgnite = getProgress(time, 4000, 9000);
  const tContain = getProgress(time, 26000, 29000);
  
  // Interpolated Telemetry
  const temp = Math.round(29 + (tIgnite * 46) - (tContain * 32));
  const smoke = Math.round(0 + (tIgnite * 310) - (tContain * 290));
  const co = Math.round(400 + (tIgnite * 1200) - (tContain * 1100));
  const hum = Math.round(52 - (tIgnite * 21) + (tContain * 15));
  const pressure = Math.round(1012 - (tIgnite * 5) + (tContain * 3));
  
  const confidence = time < 11000 ? 0 : time < 13000 ? 45 : time < 15000 ? 72 : 96;

  // Interpolated Positions
  const tPatrol = getProgress(time, 19000, 26000);
  const puPos: [number, number] = [lerp(GATEWAY_LOC[0], FIRE_LOC[0], tPatrol), lerp(GATEWAY_LOC[1], FIRE_LOC[1], tPatrol)];
  
  const tDrone = getProgress(time, 19000, 23000);
  const drPos: [number, number] = [lerp(GATEWAY_LOC[0], FIRE_LOC[0], tDrone), lerp(GATEWAY_LOC[1], FIRE_LOC[1], tDrone)];
  
  const tSat = getProgress(time, 12000, 16000);
  const satPos: [number, number] = [lerp(22, 16, tSat), lerp(76, 84, tSat)];

  // Visual Radii
  const fireRadius = lerp(0, 400, getProgress(time, 4000, 15000)) * (1 - getProgress(time, 26000, 29000));
  const dangerRadius = lerp(0, 1500, getProgress(time, 15000, 19000)) * (1 - getProgress(time, 26000, 29000));

  // Dynamic States
  const sensorState = time < 4000 ? 'Monitoring' : time < 9000 ? 'High Alert' : time < 26000 ? 'Fire Mode' : 'Recovery';
  const sensorColor = time < 4000 ? 'bg-green-500' : time < 9000 ? 'bg-yellow-500' : time < 26000 ? 'bg-red-500' : 'bg-green-500';
  const statusColor = time < 15000 ? 'text-green-400' : time < 26000 ? 'text-red-500' : 'text-blue-400';

  // Auto-scroll timeline
  useEffect(() => {
    if (timelineRef.current && step > 0) {
      const activeElement = timelineRef.current.querySelector(\`[data-step="\${step}"]\`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [step]);

  return (
    <div className="flex flex-col h-full bg-black font-sans relative overflow-hidden rounded-3xl shadow-2xl absolute inset-0 z-50">
      <style>{\`
        .animated-dash { stroke-dasharray: 10; animation: dashanim 0.5s linear infinite; }
        @keyframes dashanim { to { stroke-dashoffset: -20; } }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: rgba(17, 24, 39, 0.9) !important;
          backdrop-filter: blur(12px) !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5) !important;
        }
        .leaflet-popup-content { margin: 12px !important; }
        .leaflet-container { background: #000 !important; }
        .smooth-marker { transition: transform 0.1s linear; }
      \`}</style>

      {/* TOP CONTROLS & PROGRESS */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[1000] w-full max-w-md pointer-events-none">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/20 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl pointer-events-auto">
          <button onClick={() => { setIsPlaying(false); setTime(0); }} className="hover:scale-110 transition-transform">
            <SkipBack className="w-5 h-5 text-white hover:text-green-400 transition-colors" />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.5)]">
             {isPlaying ? <Pause className="w-6 h-6 text-black" /> : <Play className="w-6 h-6 text-black ml-1" />}
          </button>
          <div className="text-sm font-bold text-white tracking-widest uppercase w-16 text-center">
            00:{(time / 1000).toFixed(1).padStart(4, '0')}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
           <div className="h-full bg-green-500 transition-all duration-75" style={{ width: \`\${(time / DURATION) * 100}%\` }}></div>
        </div>
      </div>

      {/* LEFT PANEL: Live Sensor Panel */}
      <div className="absolute top-6 left-6 bottom-6 w-[340px] flex flex-col gap-4 z-[1000] pointer-events-none">
        <div className="bg-black/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 pointer-events-auto shadow-2xl flex-1 flex flex-col overflow-y-auto custom-scrollbar relative">
          
          <div className="flex items-center gap-3 mb-6 shrink-0">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
               <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
               <h2 className="text-white font-bold text-xl leading-tight">Sensor SN-12</h2>
               <p className="text-[10px] text-gray-400 uppercase tracking-wider">Live Telemetry & Diagnostics</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6 shrink-0">
             <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col justify-center">
               <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><Battery className="w-3 h-3"/> Battery</div>
               <div className="text-white font-bold text-lg">98%</div>
             </div>
             <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col justify-center">
               <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500"/> Solar</div>
               <div className="text-white font-bold text-lg">12W <span className="text-xs font-normal text-gray-400">Charging</span></div>
             </div>
             <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col justify-center">
               <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><Signal className="w-3 h-3 text-blue-400"/> Signal</div>
               <div className="text-white font-bold text-lg">-85 <span className="text-xs font-normal text-gray-400">dBm</span></div>
             </div>
             <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col justify-center">
               <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Wake Int</div>
               <div className="text-white font-bold text-lg">{time > 6000 && time < 26000 ? '1s' : '15m'}</div>
             </div>
          </div>

          <div className="flex-1 space-y-3">
             <div className="text-[10px] font-bold text-gray-500 uppercase flex justify-between items-center mb-2">
               <span>Environmental Metrics</span>
               <span className={\`text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wider \${
                 sensorState === 'Monitoring' ? 'bg-green-500/20 text-green-400' :
                 sensorState === 'High Alert' ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' :
                 sensorState === 'Fire Mode' ? 'bg-red-500/20 text-red-400 animate-pulse' :
                 'bg-blue-500/20 text-blue-400'
               }\`}>{sensorState}</span>
             </div>

             {/* Live Graphs / Values */}
             {[
               { label: 'Core Temp', val: temp, unit: '°C', icon: Thermometer, max: 80, danger: 40 },
               { label: 'Smoke (PM2.5)', val: smoke, unit: ' ppm', icon: CloudIcon, max: 500, danger: 100 },
               { label: 'CO Gas', val: co, unit: ' ppm', icon: AlertTriangle, max: 2000, danger: 800 },
               { label: 'Humidity', val: hum, unit: '%', icon: DropletsIcon, max: 100, danger: 30, invert: true }
             ].map((m, i) => {
               const isDanger = m.invert ? m.val < m.danger : m.val > m.danger;
               const pct = Math.max(0, Math.min(100, (m.val / m.max) * 100));
               
               return (
                 <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden transition-colors duration-500">
                    <div className={\`absolute left-0 top-0 w-1 h-full transition-colors duration-500 \${isDanger ? 'bg-red-500' : 'bg-white/20'}\`}></div>
                    <div className="flex justify-between text-gray-400 text-xs mb-2">
                      <span className="flex items-center gap-1.5"><m.icon className="w-3.5 h-3.5"/> {m.label}</span>
                      <span className={\`font-black text-xl \${isDanger ? 'text-red-500' : 'text-white'}\`}>{m.val}<span className="text-[10px] font-normal text-gray-500 ml-1">{m.unit}</span></span>
                    </div>
                    {/* Visual sparkline/bar */}
                    <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                       <div className={\`h-full transition-all duration-75 \${isDanger ? 'bg-red-500' : 'bg-green-500'}\`} style={{ width: \`\${m.invert ? 100 - pct : pct}%\` }}></div>
                    </div>
                 </div>
               );
             })}
          </div>

          {/* AI Confidence Mini Panel */}
          <div className="mt-4 pt-4 border-t border-white/10 shrink-0">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-indigo-400"/> AI Confidence</span>
              <span className={\`font-black text-lg \${confidence > 80 ? 'text-indigo-400' : 'text-gray-500'}\`}>{confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Live Mission Timeline */}
      <div className="absolute top-6 right-6 bottom-6 w-[400px] flex flex-col gap-4 z-[1000] pointer-events-none">
        <div className="bg-black/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 pointer-events-auto shadow-2xl flex-1 flex flex-col overflow-hidden">
          
          <div className="mb-5 shrink-0">
            <h2 className="text-white font-bold text-xl leading-tight mb-1">Live Mission Timeline</h2>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">Real-Time Event Progress</p>
          </div>

          {/* Live Commentary */}
          <div className="mb-6 shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 animate-pulse"></div>
            <div className="text-[10px] font-bold text-blue-400 uppercase mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Live Commentary
            </div>
            <div className="text-sm font-medium text-white italic transition-opacity duration-300" key={step}>
              "{stepObj.comment}"
            </div>
          </div>

          {/* Timeline List */}
          <div 
            ref={timelineRef}
            className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-0 relative"
          >
            {/* The animated vertical line */}
            <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-white/10 z-0">
               <div 
                 className="w-full bg-green-500 transition-all duration-300 ease-linear z-10 relative shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                 style={{ height: \`\${(Math.max(1, step) / 10) * 100}%\` }}
               ></div>
            </div>

            {TIMELINE_EVENTS.map((event) => {
              const isPast = event.step < step;
              const isCurrent = event.step === step;
              const isFuture = event.step > step;
              const Icon = event.icon;
              
              return (
                <div key={event.step} data-step={event.step} className="relative z-10 flex gap-4 pb-6 last:pb-0">
                  <div className="relative shrink-0 mt-1">
                     <div className={\`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 
                       \${isPast ? 'bg-green-500 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 
                         isCurrent ? 'bg-black border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse' : 
                         'bg-black border-white/20'}\`}
                     >
                       {isPast ? <CheckCircle className="w-5 h-5 text-black" /> : <Icon className={\`w-5 h-5 \${isCurrent ? 'text-blue-400' : 'text-gray-600'}\`} />}
                     </div>
                  </div>

                  <div className={\`flex-1 rounded-2xl transition-all duration-500 
                    \${isCurrent ? 'bg-white/10 border border-blue-500/30 p-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'pt-2'}
                    \${isFuture ? 'opacity-40 grayscale' : 'opacity-100'}
                  \`}>
                     <div className="flex justify-between items-center mb-1">
                        <span className={\`text-[10px] font-bold uppercase tracking-wider \${isPast ? 'text-green-400' : isCurrent ? 'text-blue-400' : 'text-gray-500'}\`}>
                          {event.timeStr}
                        </span>
                     </div>
                     <h3 className={\`font-bold \${isCurrent ? 'text-white text-base mb-1' : 'text-gray-300 text-sm mb-1'}\`}>
                       {event.title}
                     </h3>
                     <p className={\`text-xs leading-relaxed \${isCurrent ? 'text-gray-300 mb-3' : 'text-gray-500'}\`}>
                       {event.desc}
                     </p>
                     
                     {/* Expanding Detail */}
                     <div className={\`overflow-hidden transition-all duration-500 \${isCurrent ? 'max-h-40 opacity-100 mt-3 pt-3 border-t border-white/10' : 'max-h-0 opacity-0'}\`}>
                         <div className="text-xs text-blue-200">
                           {event.detail}
                         </div>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FULLSCREEN MAP */}
      <div className="flex-1 relative z-0 w-full h-full bg-[#050505]">
        <MapContainer center={[22, 80]} zoom={5} style={{ height: '100%', width: '100%', background: '#050505' }} zoomControl={false} attributionControl={false} fadeAnimation={true}>
          <TileLayer 
             url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
             keepBuffer={8}
             updateWhenIdle={false}
             updateWhenZooming={false}
          />
          <MapController time={time} isPlaying={isPlaying} />
          
          {/* STATIC GATEWAY & VILLAGE */}
          <Marker position={GATEWAY_LOC} icon={createIcon('bg-blue-600', svgIcons.gateway)} />
          <Marker position={VILLAGE_LOC} icon={createIcon(time >= 15000 && time < 26000 ? 'bg-orange-500' : 'bg-purple-600', svgIcons.village, time >= 15000 && time < 26000)} />
          
          {/* SENSORS */}
          <Marker position={S1_LOC} icon={createIcon(sensorColor, svgIcons.sensor, time >= 4000 && time < 26000)} />
          <Marker position={S2_LOC} icon={createIcon(time >= 6000 ? 'bg-orange-500' : 'bg-green-500', svgIcons.sensor)} />
          <Marker position={S3_LOC} icon={createIcon(time >= 6000 ? 'bg-orange-500' : 'bg-green-500', svgIcons.sensor)} />
          
          {/* FIRE IGNITION & DANGER ZONES */}
          {time >= 4000 && time < 30000 && (
            <Marker position={FIRE_LOC} icon={createIcon(\`bg-red-500 border-none transition-transform \${time > 26000 ? 'scale-50 opacity-50' : ''}\`, svgIcons.fire, time < 26000)} />
          )}
          {fireRadius > 0 && (
            <Circle center={FIRE_LOC} radius={fireRadius} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, weight: 1 }} className="transition-all duration-100" />
          )}
          {dangerRadius > 0 && (
            <Circle center={FIRE_LOC} radius={dangerRadius} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.1, dashArray: '5,5', weight: 1 }} className="transition-all duration-100" />
          )}

          {/* LORA COMMUNICATION (9s - 13s) */}
          {time >= 9000 && time < 13000 && (
            <Polyline positions={[S1_LOC, GATEWAY_LOC]} color="#3b82f6" weight={3} className="animated-dash" opacity={0.6} />
          )}

          {/* AI CAMERA (11s+) */}
          <Marker position={CAM_LOC} icon={createIcon('bg-indigo-500', svgIcons.camera)}>
             {time >= 11000 && time < 16000 && (
               <Popup className="cinematic-popup" autoPan={false} closeButton={false}>
                 <div className="w-56 bg-gray-900 overflow-hidden text-white rounded-lg">
                   <div className="px-3 py-1.5 bg-gray-800 text-[10px] font-bold flex justify-between">
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
              <Marker position={drPos} icon={createIcon('bg-gray-700', svgIcons.drone)} />
              <Marker position={puPos} icon={createIcon('bg-gray-900', svgIcons.patrol)} />
              {time < 26000 && (
                <>
                  <Polyline positions={[puPos, FIRE_LOC]} color="#111827" weight={3} dashArray="4, 8" opacity={0.6} className="animated-dash"/>
                  <Polyline positions={[drPos, FIRE_LOC]} color="#374151" weight={2} dashArray="4, 8" opacity={0.6} className="animated-dash"/>
                </>
              )}
            </>
          )}
        </MapContainer>
        
        {/* VIGNETTE OVERLAY */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-10"></div>
        
        {/* CRITICAL ALARM FLASH (15s - 19s) */}
        <div className={\`absolute inset-0 pointer-events-none z-[900] transition-opacity duration-1000 \${time >= 15000 && time < 19000 ? 'opacity-100' : 'opacity-0'}\`}>
           <div className="absolute inset-0 border-[10px] border-red-500/30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Icon fallbacks (Not strictly needed if lucide-react works, but provided for completeness)
const CloudIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>;
const DropletsIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7 7 7 7s-2.29 2.06-2.29 2.06C3.57 10 3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>;
`

fs.writeFileSync(file, code);
console.log("Rewritten SimulationDashboard.tsx for 30s smooth playback");
