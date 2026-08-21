const fs = require('fs');
let code = fs.readFileSync('src/components/IncidentDetails.tsx', 'utf8');

const target = `    setWeather(null);
    WeatherService.getWeatherForLocation(incident.location.coordinates.lat, incident.location.coordinates.lng)
      .then(setWeather)
      .catch(console.error);`;

const replacement = `    setWeather(null);
    WeatherService.getWeatherForLocation(incident.location.coordinates.lat, incident.location.coordinates.lng)
      .then(setWeather)
      .catch(err => {
        console.error("Failed to fetch weather for incident", err);
        setWeather({ error: true } as any);
      });`;

const uiTarget = `              {!weather ? (
                 <div className="text-sm text-gray-400 italic text-center py-4">Weather data fetching...</div>
              ) : (`;

const newUi = `              {!weather ? (
                 <div className="text-sm text-gray-400 italic text-center py-4">Weather data fetching...</div>
              ) : weather.error ? (
                 <div className="text-sm text-red-400 italic text-center py-4">Weather unavailable</div>
              ) : (`;

code = code.replace(target, replacement);
code = code.replace(uiTarget, newUi);

fs.writeFileSync('src/components/IncidentDetails.tsx', code);
console.log('Error handling patched.');
