const fs = require('fs');
const file = 'src/components/SimulationDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace loop
content = content.replace(
  /useEffect\(\(\) => \{\s+const loop = \(now: number\) => \{[\s\S]*?return \(\) => cancelAnimationFrame\(requestRef\.current!\);\s+\}, \[isPlaying\]\);/,
  `useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      if (!isPlaying) {
        lastTime = now;
        animationFrameId = requestAnimationFrame(loop);
        return;
      }
      
      let dt = now - lastTime;
      
      // Cap dt to prevent massive jumps (e.g. tab switching)
      if (dt > 100) dt = 33; 
      
      if (dt >= 33) {
        lastTime = now;
        setTime(prev => {
          const next = prev + dt;
          if (next >= DURATION) {
            setIsPlaying(false);
            return DURATION;
          }
          return next;
        });
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);`
);

// Replace MapController
content = content.replace(
  /function MapController[\s\S]*?return null;\n\}/,
  `function MapController({ time, isPlaying }: { time: number, isPlaying: boolean }) {
  const map = useMap();
  const prevTime = useRef(0);

  useEffect(() => {
    if (!isPlaying && time === 0) {
      map.stop();
      map.setView([22, 80], 5, { animate: false });
      prevTime.current = 0;
    } else if (isPlaying) {
      const crossed = (t: number) => prevTime.current < t && time >= t;
      
      // Cinematic Camera Sequence
      // Adding map.stop() before flyTo prevents Leaflet animation queue crashes 
      if (crossed(100)) { map.stop(); map.flyTo(FIRE_LOC, 14, { duration: 3.5, easeLinearity: 0.25 }); }
      if (crossed(4000)) { map.stop(); map.flyTo(FIRE_LOC, 16, { duration: 4.5, easeLinearity: 0.1 }); }
      if (crossed(9000)) { map.stop(); map.flyTo([18.880, 81.945], 15, { duration: 3.5 }); }
      if (crossed(13000)) { map.stop(); map.flyTo([18.885, 81.955], 11, { duration: 3.5 }); }
      if (crossed(16000)) { map.stop(); map.flyTo([18.890, 81.960], 14, { duration: 3.5 }); }
      if (crossed(19000)) { map.stop(); map.flyTo(FIRE_LOC, 15, { duration: 4.5 }); }
      if (crossed(26000)) { map.stop(); map.flyTo(FIRE_LOC, 13, { duration: 3.5 }); }
      
      prevTime.current = time;
    }
  }, [time, isPlaying, map]);
  return null;
}`
);

// Fix lerp numbers
content = content.replace(
  /const temp = Math\.round\(29 \+ \(tIgnite \* 46\) \- \(tContain \* 32\)\);/,
  `const temp = Math.round(29 + (tIgnite * 17) - (tContain * 11));`
);
content = content.replace(
  /const co = Math\.round\(400 \+ \(tIgnite \* 1200\) \- \(tContain \* 1100\)\);/,
  `const co = Math.round(400 + (tIgnite * 800) - (tContain * 700));`
);


fs.writeFileSync(file, content);
console.log("Patched MapController and RequestAnimationFrame");
