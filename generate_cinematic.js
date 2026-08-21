import fs from 'fs';

const content = `
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Activity, 
  MapPin, Flame, Cpu, Radio, Eye, Satellite, Crosshair, 
  Bell, Truck, CheckCircle, Navigation, AlertTriangle, 
  Wind, Droplets, ShieldAlert, Zap, Server, ChevronRight,
  Battery, Thermometer, Camera, Map as MapIcon
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LOGS = [
  { step: 1, time: "08:00:00", text: "System initialized. Normal conditions." },
  { step: 2, time: "08:31:05", text: "Possible ignition detected in Kanger Valley Core." },
  { step: 3, time: "08:31:12", text: "Nearby sensors activated. High alert mode." },
  { step: 3, time: "08:31:25", text: "Temperature rising. Smoke levels increasing." },
  { step: 4, time: "08:31:38", text: "LoRa transmission successful via Gateway 1." },
  { step: 5, time: "08:32:45", text: "Forest Camera AI verification: 96% smoke probability." },
  { step: 6, time: "08:33:15", text: "NASA VIIRS satellite confirms heat signature." },
  { step: 7, time: "08:33:30", text: "CRITICAL: Multi-modal confidence reached 96%." },
  { step: 7, time: "08:34:00", text: "Incident FIRMS-CG-881 generated." },
  { step: 8, time: "08:34:30", text: "Fire spreading North-East due to wind." },
  { step: 9, time: "08:35:05", text: "Patrol Unit PU-01 and Drone dispatched." },
  { step: 9, time: "08:42:20", text: "Evacuation warning issued for nearest village." },
  { step: 10, time: "09:15:00", text: "Contained: Fire contained. Recovery operations initiated." },
];

const FIRE_LOC: [number, number] = [18.885, 81.955];
const S1_LOC: [number, number] = [18.885, 81.955];
const S2_LOC: [number, number] = [18.887, 81.953];
const S3_LOC: [number, number] = [18.882, 81.958];
const GATEWAY_LOC: [number, number] = [18.875, 81.940];
const CAM_LOC: [number, number] = [18.890, 81.960];
const VILLAGE_LOC: [number, number] = [18.900, 81.970];

function MapController({ step, isPlaying, speed }: { step: number, isPlaying: boolean, speed: number }) {
  const map = useMap();
  const introRef = useRef(false);

  useEffect(() => {
    if (step === 0 && !introRef.current && isPlaying) {
      introRef.current = true;
      map.setView([22, 80], 4, { animate: false });
      setTimeout(() => map.flyTo([21, 82], 6, { duration: 1.5 }), 1000 / speed);
      setTimeout(() => map.flyTo([19, 81.5], 9, { duration: 1.5 }), 2500 / speed);
      setTimeout(() => map.flyTo(FIRE_LOC, 15, { duration: 3 }), 4000 / speed);
    } else if (step === 1 && !isPlaying) {
      map.flyTo(FIRE_LOC, 15, { duration: 0.5 });
    } else if (step === 2 || step === 3) {
      map.flyTo(FIRE_LOC, 17, { duration: 1.5 });
    } else if (step === 4) {
      map.flyTo([18.880, 81.948], 15, { duration: 1.5 });
    } else if (step === 5) {
      map.flyTo(CAM_LOC, 16, { duration: 1.5 });
    } else if (step === 6) {
      map.flyTo(FIRE_LOC, 8, { duration: 2.5 });
    } else if (step === 7 || step === 8) {
      map.flyTo(FIRE_LOC, 14, { duration: 1.5 });
    } else if (step === 9) {
      map.flyTo([18.865, 81.930], 13, { duration: 2 });
    } else if (step === 10) {
      map.flyTo(FIRE_LOC, 15, { duration: 2 });
    }
  }, [step, isPlaying, speed, map]);
  return null;
}

const AnimatedNumber = ({ value, suffix = '' }: { value: number, suffix?: string }) => {
  const [current, setCurrent] = useState(value);
  useEffect(() => {
    const duration = 1000;
    const start = current;
    const end = value;
    if (start === end) return;
    let startTime: number | null = null;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      setCurrent(Math.floor(start + (end - start) * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span>{current}{suffix}</span>;
};

// Icons
const createIcon = (colorClass: string, iconHtml: string, pulse = false) => L.divIcon({
  className: 'bg-transparent border-0',
  html: \`
    <div class="relative w-8 h-8 flex items-center justify-center">
      \${pulse ? \`<div class="absolute inset-0 \${colorClass} rounded-full opacity-60 animate-ping"></div>\` : ''}
      <div class="absolute w-8 h-8 \${colorClass} rounded-full shadow-[0_0_20px_rgba(0,0,0,0.7)] flex items-center justify-center text-white border-2 border-white/50 backdrop-blur-md z-10">
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
  satellite: \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2.05v3M13 18.95v3M2.05 13h3M18.95 13h3M21.18 5.64l-2.12 2.12M4.94 17.66l-2.12 2.12M21.18 20.36l-2.12-2.12M4.94 8.34l-2.12-2.12M13 13m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0"/></svg>\`
};

export default function SimulationDashboard() {
  const [step, setStep] = useState(0); // 0 is Intro
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  // Animated locations
  const [puPos, setPuPos] = useState<[number, number]>([18.820, 81.910]);
  const [drPos, setDrPos] = useState<[number, number]>(GATEWAY_LOC);
  const [satPos, setSatPos] = useState<[number, number]>([20, 78]);

  useEffect(() => {
    if (!isPlaying) return;
    
    let delay = 4000;
    if (step === 0) delay = 7000; // Intro zoom takes longer
    else if (step === 6) delay = 5000; // Satellite pass
    else if (step === 9) delay = 6000; // Response driving
  
    const timer = setTimeout(() => {
      setStep(prev => {
        if (prev >= 10) {
          setIsPlaying(false);
          return 10;
        }
        return prev + 1;
      });
    }, delay / speed);
  
    return () => clearTimeout(timer);
  }, [step, isPlaying, speed]);

  useEffect(() => {
    if (step === 9) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.005 * speed;
        if (progress >= 1) progress = 1;
        setPuPos([18.820 + (FIRE_LOC[0] - 18.820) * progress, 81.910 + (FIRE_LOC[1] - 81.910) * progress]);
        setDrPos([GATEWAY_LOC[0] + (FIRE_LOC[0] - GATEWAY_LOC[0]) * progress, GATEWAY_LOC[1] + (FIRE_LOC[1] - GATEWAY_LOC[1]) * progress]);
        if (progress >= 1) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step, speed]);

  useEffect(() => {
    if (step === 6) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.005 * speed;
        setSatPos([20 - 5 * progress, 78 + 5 * progress]);
        if (progress >= 1) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step, speed]);

  const activeLogs = LOGS.filter(l => l.step <= step);
  
  // Data variables
  const temp = step < 2 ? 29 : step === 2 ? 33 : step < 10 ? 46 : 35;
  const hum = step < 2 ? 52 : step === 2 ? 44 : step < 10 ? 31 : 45;
  const smoke = step < 2 ? 0 : step === 2 ? 18 : step < 10 ? 310 : 50;
  const co = step < 2 ? 400 : step === 2 ? 600 : step < 10 ? 1200 : 500;
  const confidence = step < 5 ? 0 : step === 5 ? 38 : step === 6 ? 61 : step >= 7 ? 96 : 96;
  const status = step < 7 ? 'NORMAL' : step < 10 ? 'CRITICAL' : 'RECOVERY';

  const getSensorColor = (id: string, currentStep: number) => {
    if (currentStep < 2) return 'bg-green-500';
    if (id === 'S1') {
      if (currentStep === 2) return 'bg-yellow-500';
      if (currentStep === 3) return 'bg-orange-500';
      return 'bg-red-500';
    }
    if (currentStep >= 3) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex flex-col h-full bg-black font-sans relative overflow-hidden rounded-3xl shadow-2xl absolute inset-0 z-50">
      <style>{\`
        .animated-dash {
          stroke-dasharray: 10;
          animation: dashanim 1s linear infinite;
        }
        @keyframes dashanim {
          to { stroke-dashoffset: -20; }
        }
        .confidence-circle {
          stroke-dasharray: 283;
          stroke-dashoffset: \${283 - (283 * confidence) / 100};
          transition: stroke-dashoffset 1s ease-in-out;
        }
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
      \`}</style>

      {/* TOP CONTROLS */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-2xl border border-white/20 rounded-full px-6 py-3 flex items-center gap-6 z-[1000] shadow-2xl">
        <div className="flex items-center gap-4">
          <button onClick={() => { setIsPlaying(false); setStep(0); }}><SkipBack className="w-5 h-5 text-white hover:text-green-400 transition-colors" /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.5)]">
             {isPlaying ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 text-black ml-1" />}
          </button>
          <button onClick={() => setStep(p => Math.min(10, p + 1))}><SkipForward className="w-5 h-5 text-white hover:text-green-400 transition-colors" /></button>
        </div>
        <div className="w-px h-6 bg-white/20"></div>
        <div className="flex items-center gap-3">
           <span className="text-xs font-bold text-gray-400">SPEED</span>
           {[1,2,4].map(s => (
              <button key={s} onClick={() => setSpeed(s)} className={\`px-2 py-1 rounded text-xs font-bold transition-colors \${speed === s ? 'bg-white text-black' : 'text-white hover:bg-white/10'}\`}>{s}x</button>
           ))}
        </div>
      </div>

      {/* LEFT PANEL */}
      <div className="absolute top-6 left-6 bottom-6 w-80 flex flex-col gap-4 z-[1000] pointer-events-none">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 pointer-events-auto shadow-2xl flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
               <MapIcon className="w-5 h-5 text-white" />
            </div>
            <div>
               <h2 className="text-white font-bold text-lg leading-tight">Kanger Valley</h2>
               <p className="text-[10px] text-gray-400 uppercase tracking-wider">National Park, Bastar</p>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-3">Environmental Base</div>
            <div className="grid grid-cols-2 gap-2">
               <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center text-center">
                  <Wind className="w-4 h-4 text-blue-400 mb-1" />
                  <div className="text-sm font-bold text-white">18 km/h NE</div>
               </div>
               <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center text-center">
                  <Thermometer className="w-4 h-4 text-orange-400 mb-1" />
                  <div className="text-sm font-bold text-white">39°C</div>
               </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-3 flex justify-between items-center">
               <span>Live Sensor Panel (SN-12)</span>
               <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-[8px] animate-pulse">ONLINE</span>
            </div>
            <div className="space-y-3">
               <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                  <div className={\`absolute left-0 top-0 w-1 h-full transition-colors duration-500 \${temp > 40 ? 'bg-red-500' : 'bg-green-500'}\`}></div>
                  <div className="flex justify-between text-gray-400 text-xs mb-1"><span>Core Temp</span> <span><Thermometer className="w-3 h-3 inline"/></span></div>
                  <div className={\`text-3xl font-black \${temp > 40 ? 'text-red-500' : 'text-white'}\`}><AnimatedNumber value={temp} suffix="°C" /></div>
               </div>
               <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                  <div className={\`absolute left-0 top-0 w-1 h-full transition-colors duration-500 \${smoke > 100 ? 'bg-orange-500' : 'bg-green-500'}\`}></div>
                  <div className="flex justify-between text-gray-400 text-xs mb-1"><span>Particulates (PM2.5)</span> <span><Activity className="w-3 h-3 inline"/></span></div>
                  <div className={\`text-3xl font-black \${smoke > 100 ? 'text-orange-500' : 'text-white'}\`}><AnimatedNumber value={smoke} /></div>
               </div>
               <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                  <div className={\`absolute left-0 top-0 w-1 h-full transition-colors duration-500 \${co > 600 ? 'bg-yellow-500' : 'bg-green-500'}\`}></div>
                  <div className="flex justify-between text-gray-400 text-xs mb-1"><span>CO Concentration</span> <span><Activity className="w-3 h-3 inline"/></span></div>
                  <div className={\`text-3xl font-black \${co > 600 ? 'text-yellow-500' : 'text-white'}\`}><AnimatedNumber value={co} suffix=" ppm" /></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="absolute top-6 right-6 bottom-6 w-80 flex flex-col gap-4 z-[1000] pointer-events-none">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 pointer-events-auto shadow-2xl flex-1 flex flex-col overflow-y-auto custom-scrollbar transition-all duration-1000">
           
           {/* Mission Status Header */}
           <div className={\`p-4 rounded-2xl mb-6 border transition-colors duration-500 \${status === 'CRITICAL' ? 'bg-red-500/20 border-red-500/30' : status === 'RECOVERY' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-green-500/20 border-green-500/30'}\`}>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mission Status</div>
              <div className={\`text-xl font-black tracking-widest uppercase \${status === 'CRITICAL' ? 'text-red-500 animate-pulse' : status === 'RECOVERY' ? 'text-blue-500' : 'text-green-500'}\`}>
                 {status}
              </div>
           </div>

           {/* Fire Confidence Engine */}
           <div className={\`transition-opacity duration-1000 \${step >= 5 ? 'opacity-100' : 'opacity-0 hidden'}\`}>
              <div className="text-[10px] font-bold text-gray-500 uppercase mb-3">Confidence Engine</div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-6 flex flex-col items-center relative overflow-hidden">
                 <div className={\`absolute inset-0 bg-red-500/10 blur-xl transition-opacity duration-1000 \${step >= 7 ? 'opacity-100' : 'opacity-0'}\`}></div>
                 <div className="relative w-24 h-24 mb-4">
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                       <circle cx="50" cy="50" r="45" fill="none" stroke={confidence > 80 ? '#ef4444' : '#f59e0b'} strokeWidth="8" className="confidence-circle" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-2xl font-black text-white"><AnimatedNumber value={confidence}/>%</span>
                     </div>
                 </div>
                 <div className="w-full grid grid-cols-2 gap-1.5 text-[9px] font-bold uppercase">
                    <div className={\`p-1.5 rounded text-center border transition-colors duration-500 \${step >= 6 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-white/5 text-gray-500 border-white/10'}\`}>Satellite {step>=6&&'✔'}</div>
                    <div className={\`p-1.5 rounded text-center border transition-colors duration-500 \${step >= 3 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-white/5 text-gray-500 border-white/10'}\`}>IoT {step>=3&&'✔'}</div>
                    <div className={\`p-1.5 rounded text-center border transition-colors duration-500 \${step >= 5 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-white/5 text-gray-500 border-white/10'}\`}>Camera {step>=5&&'✔'}</div>
                    <div className="p-1.5 rounded text-center border bg-red-500/20 text-red-400 border-red-500/30">Forest ✔</div>
                 </div>
              </div>
           </div>
           
           {/* Officer Actions */}
           <div className={\`transition-all duration-1000 \${step >= 7 && step < 10 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'}\`}>
              <div className="text-[10px] font-bold text-red-400 uppercase mb-3 flex items-center gap-2"><AlertTriangle className="w-3 h-3"/> Officer Required</div>
              <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] mb-3 transition-colors text-sm uppercase tracking-wider">
                 Deploy Response
              </button>
              <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-colors text-xs uppercase tracking-wider">
                 Evacuate Village
              </button>
           </div>
           
           {/* Mission Stats */}
           <div className={\`transition-all duration-1000 \${step >= 10 ? 'opacity-100' : 'opacity-0 hidden'}\`}>
              <div className="text-[10px] font-bold text-blue-400 uppercase mb-3 flex items-center gap-2"><CheckCircle className="w-3 h-3"/> Mission Report</div>
              <div className="space-y-2">
                 <div className="bg-white/5 rounded-lg p-2.5 flex justify-between items-center text-xs border border-white/10"><span className="text-gray-400">Detection</span><span className="text-white font-bold">0m 45s</span></div>
                 <div className="bg-white/5 rounded-lg p-2.5 flex justify-between items-center text-xs border border-white/10"><span className="text-gray-400">Response</span><span className="text-white font-bold">8m 30s</span></div>
                 <div className="bg-blue-500/20 rounded-lg p-2.5 flex justify-between items-center text-xs border border-blue-500/30 mt-4"><span className="text-blue-300">Forest Saved</span><span className="text-blue-400 font-bold">1,200 Ha</span></div>
              </div>
           </div>

        </div>
      </div>

      {/* BOTTOM LOGS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col z-[1000] pointer-events-none shadow-2xl">
        <div className="text-[10px] font-bold text-gray-400 uppercase mb-2 flex justify-between">
          <span>Live Operational Log</span>
          <span className="text-green-400 animate-pulse">● RECORDING</span>
        </div>
        <div className="h-24 overflow-y-hidden flex flex-col-reverse text-xs font-mono">
          {activeLogs.slice().reverse().map((log, i) => (
             <div key={i} className="mb-1.5 flex gap-3 text-gray-300 animate-fade-in-up">
               <span className="text-gray-500 shrink-0">[{log.time}]</span>
               <span className={log.text.includes('CRITICAL') || log.text.includes('Evacuation') ? 'text-red-400 font-bold' : log.text.includes('Contained') ? 'text-blue-400 font-bold' : ''}>{log.text}</span>
             </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN MAP */}
      <div className="flex-1 relative z-0 w-full h-full bg-[#000]">
        <MapContainer center={[20, 80]} zoom={4} style={{ height: '100%', width: '100%', background: '#000' }} zoomControl={false} attributionControl={false}>
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          <MapController step={step} isPlaying={isPlaying} speed={speed} />
          
          {/* SENSORS */}
          <Marker position={S1_LOC} icon={createIcon(getSensorColor('S1', step), svgIcons.sensor, step >= 2)}>
            <Popup className="cinematic-popup" closeButton={false}>
              <div className="w-52">
                 <div className="text-xs font-bold text-gray-400 uppercase mb-2 border-b border-gray-700 pb-2">Sensor SN-12</div>
                 <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Battery</span> <span className="text-green-400">98%</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Temp</span> <span>{temp}°C</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Humidity</span> <span>{hum}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Smoke</span> <span>{smoke} ppm</span></div>
                 </div>
              </div>
            </Popup>
          </Marker>
          <Marker position={S2_LOC} icon={createIcon(getSensorColor('S2', step), svgIcons.sensor)} />
          <Marker position={S3_LOC} icon={createIcon(getSensorColor('S3', step), svgIcons.sensor)} />
          
          {/* GATEWAY */}
          <Marker position={GATEWAY_LOC} icon={createIcon('bg-blue-600', svgIcons.gateway)} />
          
          {/* VILLAGE */}
          <Marker position={VILLAGE_LOC} icon={createIcon(step >= 9 && step < 10 ? 'bg-orange-500' : 'bg-purple-600', svgIcons.village, step >= 9 && step < 10)} />
          
          {/* FIRE IGNITION & SPREAD */}
          {step >= 2 && step < 10 && (
            <Marker position={FIRE_LOC} icon={createIcon('bg-red-500 border-none', svgIcons.fire, true)} />
          )}
          {step >= 8 && step < 10 && (
            <>
              <Circle center={FIRE_LOC} radius={400} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, weight: 1 }} className="transition-all duration-1000" />
              <Circle center={FIRE_LOC} radius={800} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.1, dashArray: '5,5', weight: 1 }} className="transition-all duration-1000" />
            </>
          )}

          {/* LORA COMMUNICATION ANIMATION */}
          {step >= 4 && step < 7 && (
            <Polyline positions={[S1_LOC, GATEWAY_LOC]} color="#3b82f6" weight={3} className="animated-dash" opacity={0.6} />
          )}

          {/* AI CAMERA & POPUP */}
          <Marker position={CAM_LOC} icon={createIcon('bg-indigo-500', svgIcons.camera)}>
             {step >= 5 && (
               <Popup className="cinematic-popup" autoPan={false} closeButton={false}>
                 <div className="w-56 bg-gray-900 overflow-hidden text-white rounded-lg">
                   <div className="px-3 py-1.5 bg-gray-800 text-[10px] font-bold flex justify-between">
                      <span>CAM-04 (Live)</span>
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

          {/* SATELLITE ANIMATION */}
          {step === 6 && (
            <>
              <Marker position={satPos} icon={createIcon('bg-slate-800', svgIcons.satellite)} />
              <Polyline positions={[satPos, FIRE_LOC]} color="#ef4444" weight={1} dashArray="5,5" opacity={0.5} />
            </>
          )}

          {/* RESPONSE DRONE & PATROL */}
          {step >= 9 && (
            <>
              <Marker position={drPos} icon={createIcon('bg-gray-700', svgIcons.drone)} />
              <Marker position={puPos} icon={createIcon('bg-gray-900', svgIcons.patrol)} />
              {step < 10 && (
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
        
        {/* CRITICAL ALARM FLASH */}
        <div className={\`absolute inset-0 pointer-events-none z-[900] transition-opacity duration-1000 \${step === 7 || step === 8 ? 'opacity-100' : 'opacity-0'}\`}>
           <div className="absolute inset-0 border-[10px] border-red-500/30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
`

fs.writeFileSync('src/components/SimulationDashboard.tsx', content);

