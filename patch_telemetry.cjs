const fs = require('fs');
let code = fs.readFileSync('src/components/LiveMonitoring.tsx', 'utf8');

const target = `
          {/* Telemetry Card */}
          <div className="bg-[#1C2721] rounded-2xl p-5 text-white shadow-md">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Regional Telemetry</h3>
            <div className="space-y-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Thermometer className="w-4 h-4" /> Temperature
                </div>
                <div className="text-3xl font-light">{weather ? \`\${weather.temperature}°C\` : '--°C'}</div>
              </div>
              
              <div className="w-full h-px bg-white/10"></div>
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Droplets className="w-4 h-4" /> Humidity
                </div>
                <div className="text-xl font-medium">{weather ? \`\${weather.humidity}%\` : '--%'}</div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Wind className="w-4 h-4" /> Smoke Level
                </div>
                <div className="text-xl font-medium text-red-400">High</div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Navigation className="w-4 h-4" /> Wind Speed
                </div>
                <div className="text-xl font-medium">{weather ? \`\${weather.windSpeed} km/h\` : '12 km/h'}</div>
              </div>
              
              <div className="w-full h-px bg-white/10"></div>
              
              <div className="text-xs text-gray-500 pt-1">
                Updated: {weather ? new Date(weather.timestamp).toLocaleTimeString('en-US') : '--'}
              </div>
            </div>
          </div>
`;

const replacement = `
          {/* Telemetry Card */}
          <div className="bg-[#1C2721] rounded-2xl p-5 text-white shadow-md">
            <h3 className="text-sm font-medium text-gray-300 mb-4">{selectedIncident ? 'Incident Weather' : 'Regional Telemetry'}</h3>
            {(() => {
              const displayWeather = selectedIncident ? selectedIncidentWeather : weather;
              
              if (selectedIncident && !selectedIncidentWeather) {
                 return <div className="text-sm text-gray-400 italic">Fetching weather...</div>;
              }
              
              if (!displayWeather) {
                 return <div className="text-sm text-gray-400 italic">Weather unavailable</div>;
              }
              
              return (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider">
                      <Thermometer className="w-3.5 h-3.5" /> Temperature & Humidity
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-light">{displayWeather.temperature !== undefined ? \`\${displayWeather.temperature}°C\` : '--°C'}</span>
                      <span className="text-lg text-gray-300">{displayWeather.humidity !== undefined ? \`\${displayWeather.humidity}%\` : '--%'}</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-white/10"></div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Navigation className="w-3.5 h-3.5" /> Wind
                      </div>
                      <div className="text-sm font-medium">{displayWeather.windSpeed !== undefined ? \`\${displayWeather.windSpeed} km/h\` : '--'}</div>
                      <div className="text-xs text-gray-400">{displayWeather.windDirection !== undefined ? \`\${displayWeather.windDirection}°\` : ''} {displayWeather.windGust !== undefined ? \`(Gusts: \${displayWeather.windGust} km/h)\` : ''}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Droplets className="w-3.5 h-3.5" /> Rainfall
                      </div>
                      <div className="text-sm font-medium">{displayWeather.precipitation !== undefined ? \`\${displayWeather.precipitation} mm\` : '--'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        VPD
                      </div>
                      <div className="text-sm font-medium">{displayWeather.vpd !== undefined ? \`\${displayWeather.vpd} kPa\` : '--'}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        Soil Moisture
                      </div>
                      <div className="text-sm font-medium">{displayWeather.soilMoisture !== undefined ? \`\${displayWeather.soilMoisture} m³/m³\` : '--'}</div>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-white/10"></div>
                  
                  <div className="flex flex-col gap-1 text-[10px] text-gray-500 pt-1">
                    <div>Updated {Math.round((Date.now() - new Date(displayWeather.retrievedAt || displayWeather.timestamp).getTime()) / 60000)} minutes ago</div>
                    <div>Source: {displayWeather.source || 'Open-Meteo'}</div>
                  </div>
                </div>
              );
            })()}
          </div>
`;

if (code.includes(target.trim())) {
  code = code.replace(target.trim(), replacement.trim());
  fs.writeFileSync('src/components/LiveMonitoring.tsx', code);
  console.log('Telemetry updated successfully.');
} else {
  console.log('Target not found.');
}
