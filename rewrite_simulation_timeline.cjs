const fs = require('fs');
const file = 'src/components/SimulationDashboard.tsx';

const code = `
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Activity, 
  MapPin, Flame, Cpu, Radio, Eye, Satellite, Crosshair, 
  Bell, Truck, CheckCircle, Navigation, AlertTriangle, 
  Wind, Droplets, ShieldAlert, Zap, Server, ChevronRight,
  Battery, Thermometer, Camera, Map as MapIcon, TreePine
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TIMELINE_EVENTS = [
  { step: 1, time: "10:18:00", icon: TreePine, title: "Normal Forest", desc: "System initialized. Normal conditions.", comment: "Monitoring forest conditions...", detail: "All sensors reporting baseline metrics." },
  { step: 2, time: "10:18:42", icon: Flame, title: "Possible Ignition", desc: "Small flame detected beneath dry leaves.", comment: "Abnormal temperature detected.", detail: "A tiny ignition point has formed. Smoke is beginning to rise, but still below critical threshold." },
  { step: 3, time: "10:19:05", icon: Cpu, title: "IoT Sensor Triggered", desc: "Sensor SN-12 detected abnormal temperature and smoke.", comment: "Nearby sensors automatically activated.", detail: "Temperature increased from 29°C to 46°C. Particulate matter spiking." },
  { step: 4, time: "10:19:17", icon: Radio, title: "LoRa Mesh Activated", desc: "Sensor transmitted data through LoRa network.", comment: "Gateway successfully received the packet.", detail: "Mesh routing path established. Signal strength -85dBm." },
  { step: 5, time: "10:19:34", icon: Camera, title: "AI Camera Verification", desc: "Forest camera detected smoke plume.", comment: "Smoke verified by AI.", detail: "Camera CAM-07 detected dense smoke. YOLO model identified smoke with 96% confidence. Bounding box generated. Awaiting satellite confirmation." },
  { step: 6, time: "10:20:08", icon: Satellite, title: "Satellite Confirmation", desc: "VIIRS hotspot received. Heat signature confirmed.", comment: "Satellite hotspot received.", detail: "NASA FIRMS data confirms thermal anomaly matching exact sensor coordinates." },
  { step: 7, time: "10:20:25", icon: Crosshair, title: "Fire Confidence Updated", desc: "Confidence increased to 96%. Incident classified as Critical.", comment: "Fire Confidence reached 96%.", detail: "Multi-modal verification complete. Automated incident FIRMS-CG-881 generated." },
  { step: 8, time: "10:20:36", icon: Bell, title: "Officer Alert Sent", desc: "Forest Control Room notified. Nearest Beat informed.", comment: "Officer response initiated.", detail: "Automated dispatch protocols activated. Notification delivered to Cmdr. Verma's device." },
  { step: 9, time: "10:21:18", icon: Truck, title: "Patrol Dispatched", desc: "Patrol Unit 03 started navigation. ETA 12 minutes.", comment: "Response teams en route.", detail: "Drone launched from Ranger Station for aerial overwatch. Ground units navigating via shortest path." },
  { step: 10, time: "10:32:14", icon: CheckCircle, title: "Fire Contained", desc: "Fire spread successfully stopped.", comment: "Containment successful.", detail: "Mission status changed to Recovery. 1,200 Hectares of forest saved." }
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
    } else if (step === 1) {
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
  drone: \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>\`,
  satellite: \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2.05v3M13 18.95v3M2.05 13h3M18.95 13h3M21.18 5.64l-2.12 2.12M4.94 17.66l-2.12 2.12M21.18 20.36l-2.12-2.12M4.94 8.34l-2.12-2.12M13 13m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0"/></svg>\`
};

export default function SimulationDashboard() {
  const [step, setStep] = useState(0); // 0 is Intro
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Animated locations
  const [puPos, setPuPos] = useState<[number, number]>([18.820, 81.910]);
  const [drPos, setDrPos] = useState<[number, number]>(GATEWAY_LOC);
  const [satPos, setSatPos] = useState<[number, number]>([20, 78]);

  useEffect(() => {
    if (isPlaying) {
      const scheduleNext = (currentStep: number) => {
        if (currentStep >= 10) {
          setIsPlaying(false);
          return;
        }
        let delay = 4000;
        if (currentStep === 0) delay = 7000;
        else if (currentStep === 6) delay = 5000;
        else if (currentStep === 9) delay = 6000;

        timerRef.current = setTimeout(() => {
          setStep(prev => {
            const next = prev + 1;
            scheduleNext(next);
            return next;
          });
        }, delay / speed);
      };

      // Start the chain
      scheduleNext(step);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, speed]); // Run only when play state or speed changes

  // Auto-scroll timeline
  useEffect(() => {
    if (timelineRef.current && step > 0) {
      const activeElement = timelineRef.current.querySelector(\`[data-step="\${step}"]\`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [step]);

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
  
  // Data variables
  const temp = step < 2 ? 29 : step === 2 ? 33 : step < 10 ? 46 : 35;
  const hum = step < 2 ? 52 : step === 2 ? 44 : step < 10 ? 31 : 45;
  const smoke = step < 2 ? 0 : step === 2 ? 18 : step < 10 ? 310 : 50;
  const co = step < 2 ? 400 : step === 2 ? 600 : step < 10 ? 1200 : 500;
  
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

  const currentEvent = TIMELINE_EVENTS.find(e => e.step === step) || TIMELINE_EVENTS[0];

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

      {/* LEFT PANEL: Environmental Base & Sensor */}
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

      {/* RIGHT PANEL: Live Mission Timeline */}
      <div className="absolute top-6 right-6 bottom-6 w-[400px] flex flex-col gap-4 z-[1000] pointer-events-none">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 pointer-events-auto shadow-2xl flex-1 flex flex-col overflow-hidden">
          
          <div className="mb-6 shrink-0">
            <h2 className="text-white font-bold text-xl leading-tight mb-1">Live Mission Timeline</h2>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">Real-Time Event Progress</p>
          </div>

          {/* Live Commentary */}
          <div className="mb-6 shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 animate-pulse"></div>
            <div className="text-[10px] font-bold text-blue-400 uppercase mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Live Commentary
            </div>
            <div className="text-sm font-medium text-white italic animate-fade-in-up" key={step}>
              "{currentEvent?.comment || "Monitoring conditions..."}"
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
                 className="w-full bg-green-500 transition-all duration-1000 ease-in-out z-10 relative shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                 style={{ height: \`\${(Math.max(1, step) / 10) * 100}%\` }}
               ></div>
            </div>

            {TIMELINE_EVENTS.map((event, index) => {
              const isPast = event.step < step;
              const isCurrent = event.step === step;
              const isFuture = event.step > step;
              
              let Icon = event.icon;
              
              return (
                <div key={event.step} data-step={event.step} className="relative z-10 flex gap-4 pb-6 last:pb-0">
                  {/* Timeline Node */}
                  <div className="relative shrink-0 mt-1">
                     <div className={\`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 
                       \${isPast ? 'bg-green-500 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 
                         isCurrent ? 'bg-black border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse' : 
                         'bg-black border-white/20'}\`}
                     >
                       {isPast ? (
                         <CheckCircle className="w-5 h-5 text-black" />
                       ) : (
                         <Icon className={\`w-5 h-5 \${isCurrent ? 'text-blue-400' : 'text-gray-600'}\`} />
                       )}
                     </div>
                  </div>

                  {/* Content Card */}
                  <div className={\`flex-1 rounded-2xl transition-all duration-500 
                    \${isCurrent ? 'bg-white/10 border border-blue-500/30 p-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'pt-2'}
                    \${isFuture ? 'opacity-40' : 'opacity-100'}
                  \`}>
                     <div className="flex justify-between items-center mb-1">
                        <span className={\`text-[10px] font-bold uppercase tracking-wider \${isPast ? 'text-green-400' : isCurrent ? 'text-blue-400' : 'text-gray-500'}\`}>
                          {event.time}
                        </span>
                     </div>
                     <h3 className={\`font-bold \${isCurrent ? 'text-white text-base mb-2' : 'text-gray-300 text-sm mb-1'}\`}>
                       {event.title}
                     </h3>
                     <p className={\`text-xs leading-relaxed \${isCurrent ? 'text-gray-300 mb-3' : 'text-gray-500'}\`}>
                       {event.desc}
                     </p>

                     {/* Expanded details for current step */}
                     {isCurrent && event.detail && (
                       <div className="mt-3 pt-3 border-t border-white/10 animate-fade-in-up">
                         <div className="text-xs text-blue-300">
                           {event.detail}
                         </div>
                       </div>
                     )}
                  </div>
                </div>
              );
            })}
          </div>

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

fs.writeFileSync(file, code);
console.log("Rewritten SimulationDashboard.tsx timeline");
