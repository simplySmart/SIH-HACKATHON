import fs from 'fs';

let content = fs.readFileSync('src/components/IncidentDetails.tsx', 'utf-8');

const replacementJSX = `
          {/* Geographic Context */}
          <div className="bg-[#0f1912]/80 backdrop-blur-3xl p-6 rounded-2xl border border-white/10 shadow-sm flex flex-col z-0">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex justify-between items-center">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-green-500" /> Geographic Context</span>
              {gisContext?.source && (
                <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{gisContext.source}</span>
              )}
            </h3>
            
            {gisLoading ? (
              <div className="flex items-center justify-center p-6">
                <div className="w-6 h-6 border-2 border-white/20 border-t-green-500 rounded-full animate-spin"></div>
                <span className="ml-3 text-sm text-gray-400">Loading spatial data...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Nearest Road */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                    <Navigation className="w-4 h-4 text-gray-300" /> Nearest Road
                  </div>
                  {gisContext?.nearestRoad ? (
                    <>
                      <div className="font-medium text-lg text-white">{gisContext.nearestRoad.distance} km</div>
                      <div className="text-sm text-gray-400 mt-1 truncate" title={gisContext.nearestRoad.name}>{gisContext.nearestRoad.name}</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 italic mt-2">Data unavailable</div>
                  )}
                </div>

                {/* Nearest Water */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                    <Droplet className="w-4 h-4 text-blue-400" /> Nearest Water
                  </div>
                  {gisContext?.nearestWater ? (
                    <>
                      <div className="font-medium text-lg text-white">{gisContext.nearestWater.distance} km</div>
                      <div className="text-sm text-gray-400 mt-1 truncate" title={gisContext.nearestWater.name}>{gisContext.nearestWater.name}</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 italic mt-2">Data unavailable</div>
                  )}
                </div>

                {/* Nearest Settlement */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                    <Users className="w-4 h-4 text-orange-400" /> Nearest Settlement
                  </div>
                  {gisContext?.nearestSettlement ? (
                    <>
                      <div className="font-medium text-lg text-white">{gisContext.nearestSettlement.distance} km</div>
                      <div className="text-sm text-gray-400 mt-1 truncate" title={gisContext.nearestSettlement.name}>{gisContext.nearestSettlement.name}</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 italic mt-2">Data unavailable</div>
                  )}
                </div>
              </div>
            )}
          </div>
`;

const startStr = "{/* Response Information */}";
const endStr = "{/* Evidence Sources */}";
const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + replacementJSX + "\n          " + content.substring(endIndex);
  fs.writeFileSync('src/components/IncidentDetails.tsx', content);
  console.log("Successfully replaced block!");
} else {
  console.log("Could not find start/end.");
}
