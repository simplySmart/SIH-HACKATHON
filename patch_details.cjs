const fs = require('fs');
let code = fs.readFileSync('src/components/IncidentDetails.tsx', 'utf8');

// 1. Add WeatherSnapshot to types imports
code = code.replace(/import \{ FireIncident, SpreadSimulation \} from '\.\.\/types';/, "import { FireIncident, SpreadSimulation, WeatherSnapshot } from '../types';\nimport { WeatherService } from '../services/weatherService';");

// 2. Add weather state
const hookTarget = `const [activeSim, setActiveSim] = useState<number | null>(null);`;
code = code.replace(hookTarget, `${hookTarget}\n  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);`);

// 3. Fetch weather
const useEffectTarget = `  useEffect(() => {
    RiskService.getFireSpreadSimulation(incident).then(setSimulations);
  }, [incident]);`;
const newUseEffect = `  useEffect(() => {
    RiskService.getFireSpreadSimulation(incident).then(setSimulations);
    
    setWeather(null);
    WeatherService.getWeatherForLocation(incident.location.coordinates.lat, incident.location.coordinates.lng)
      .then(setWeather)
      .catch(console.error);
  }, [incident]);`;
code = code.replace(useEffectTarget, newUseEffect);

// 4. Update the UI
const uiTarget = `
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Environment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <ThermometerSun className="w-5 h-5 text-orange-500 mb-2" />
                  <div className="text-sm text-gray-500 mb-0.5">Temperature</div>
                  <div className="font-bold text-gray-900">{incident.environment.temperature}°C</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Droplets className="w-5 h-5 text-blue-500 mb-2" />
                  <div className="text-sm text-gray-500 mb-0.5">Humidity</div>
                  <div className="font-bold text-gray-900">{incident.environment.humidity}%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Wind className="w-5 h-5 text-gray-500 mb-2" />
                  <div className="text-sm text-gray-500 mb-0.5">Wind</div>
                  <div className="font-bold text-gray-900">{incident.environment.windSpeed} km/h</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Navigation className="w-5 h-5 text-gray-500 mb-2" />
                  <div className="text-sm text-gray-500 mb-0.5">Direction</div>
                  <div className="font-bold text-gray-900">{incident.environment.windDirection}</div>
                </div>
              </div>
            </div>
`;

const newUi = `
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Environment</h3>
                {weather && (
                  <span className="text-[10px] text-gray-400">
                    Source: {weather.source || 'Open-Meteo'} | Updated {Math.round((Date.now() - new Date(weather.retrievedAt || weather.timestamp).getTime()) / 60000)} mins ago
                  </span>
                )}
              </div>
              
              {!weather ? (
                 <div className="text-sm text-gray-400 italic text-center py-4">Weather data fetching...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <ThermometerSun className="w-5 h-5 text-orange-500 mb-2" />
                    <div className="text-sm text-gray-500 mb-0.5">Temperature</div>
                    <div className="font-bold text-gray-900">{weather.temperature !== undefined ? \`\${weather.temperature}°C\` : '--'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Droplets className="w-5 h-5 text-blue-500 mb-2" />
                    <div className="text-sm text-gray-500 mb-0.5">Humidity</div>
                    <div className="font-bold text-gray-900">{weather.humidity !== undefined ? \`\${weather.humidity}%\` : '--'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Wind className="w-5 h-5 text-gray-500 mb-2" />
                    <div className="text-sm text-gray-500 mb-0.5">Wind</div>
                    <div className="font-bold text-gray-900">{weather.windSpeed !== undefined ? \`\${weather.windSpeed} km/h\` : '--'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Navigation className="w-5 h-5 text-gray-500 mb-2" />
                    <div className="text-sm text-gray-500 mb-0.5">Direction</div>
                    <div className="font-bold text-gray-900">{weather.windDirection !== undefined ? \`\${weather.windDirection}°\` : '--'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Droplet className="w-5 h-5 text-indigo-500 mb-2" />
                    <div className="text-sm text-gray-500 mb-0.5">Rainfall</div>
                    <div className="font-bold text-gray-900">{weather.precipitation !== undefined ? \`\${weather.precipitation} mm\` : '--'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Activity className="w-5 h-5 text-green-500 mb-2" />
                    <div className="text-sm text-gray-500 mb-0.5">VPD</div>
                    <div className="font-bold text-gray-900">{weather.vpd !== undefined ? \`\${weather.vpd} kPa\` : '--'}</div>
                  </div>
                </div>
              )}
            </div>
`;

if (code.includes(uiTarget.trim())) {
  code = code.replace(uiTarget.trim(), newUi.trim());
  fs.writeFileSync('src/components/IncidentDetails.tsx', code);
  console.log('IncidentDetails patched successfully.');
} else {
  console.log('UI target not found.');
  fs.writeFileSync('debug_target.txt', uiTarget);
}
