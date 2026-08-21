const fs = require('fs');
let code = fs.readFileSync('src/components/LiveMonitoring.tsx', 'utf8');

const target1 = `        .then(setSelectedIncidentWeather)
        .catch(err => {
          console.error("Failed to fetch incident weather", err);
          // Don't fabricate values, let the UI handle null or show unavailable
        });`;

const replacement1 = `        .then(setSelectedIncidentWeather)
        .catch(err => {
          console.error("Failed to fetch incident weather", err);
          setSelectedIncidentWeather({ error: true } as any);
        });`;

const target2 = `              if (selectedIncident && !selectedIncidentWeather) {
                 return <div className="text-sm text-gray-400 italic">Fetching weather...</div>;
              }
              
              if (!displayWeather) {
                 return <div className="text-sm text-gray-400 italic">Weather unavailable</div>;
              }`;

const replacement2 = `              if (selectedIncident && !selectedIncidentWeather) {
                 return <div className="text-sm text-gray-400 italic">Fetching weather...</div>;
              }
              
              if (!displayWeather || (displayWeather as any).error) {
                 return <div className="text-sm text-gray-400 italic">Weather unavailable</div>;
              }`;

code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/LiveMonitoring.tsx', code);
console.log('LiveMonitoring error handling patched.');
