const fs = require('fs');
const file = 'src/components/SimulationDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the auto-play useEffect
content = content.replace(
  /useEffect\(\(\) => \{\s+if \(\!isPlaying\) return;\s+let delay = 4000;[\s\S]*?return \(\) => clearTimeout\(timer\);\s+\}, \[step, isPlaying, speed\]\);/,
  `const timerRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [isPlaying, speed]); // Run only when play state or speed changes`
);

// Fix the MapController step === 1 && !isPlaying
content = content.replace(
  /\} else if \(step === 1 && \!isPlaying\) \{/g,
  `} else if (step === 1) {`
);

fs.writeFileSync(file, content);
console.log("Patched SimulationDashboard.tsx");
