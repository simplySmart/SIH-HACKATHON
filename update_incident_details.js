import fs from 'fs';

let content = fs.readFileSync('src/components/IncidentDetails.tsx', 'utf-8');

// Add imports
if (!content.includes('import { GeoJSON } from')) {
  content = content.replace("import { MapContainer, TileLayer, Marker, ZoomControl, Circle } from 'react-leaflet';", "import { MapContainer, TileLayer, Marker, ZoomControl, Circle, GeoJSON } from 'react-leaflet';");
}
if (!content.includes('import { Navigation,')) {
  content = content.replace("import { \n  ArrowLeft", "import { \n  ArrowLeft"); // Fix later if needed, we'll just inject the icons we need.
  // wait, the icons are already imported: ArrowLeft, MapPin, AlertTriangle, Clock, Wind, Droplets, ThermometerSun, ShieldAlert, Radio, Eye, Navigation, Truck, Users, Activity, CheckCircle, Shield, Droplet
}

// 1. Add state for gisContext
const stateStr = `
  const [isUpdating, setIsUpdating] = useState(false);
  const [gisContext, setGisContext] = useState<any>(null);
  const [gisLoading, setGisLoading] = useState(true);
`;
content = content.replace("const [isUpdating, setIsUpdating] = useState(false);", stateStr);

// 2. Fetch GIS context in useEffect
const useEffectStart = `  useEffect(() => {
    RiskService.getFireSpreadSimulation(incident).then(setSimulations);
`;
const fetchGisStr = `
    setGisLoading(true);
    fetch(\`/api/gis/context?lat=\${incident.location.coordinates.lat}&lng=\${incident.location.coordinates.lng}\`)
      .then(res => res.json())
      .then(data => {
        setGisContext(data);
        setGisLoading(false);
      })
      .catch(err => {
        console.error("GIS fetch error:", err);
        setGisLoading(false);
      });
`;
content = content.replace(useEffectStart, useEffectStart + fetchGisStr);

// 3. Replace the "Response Plan" block
const responsePlanRegex = /\{\/\* Response Plan \*\/\}.*?\{incident\.status \!\=\= 'detected' \&\& \(/s;
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

// It seems there is a conditional block:
/*
          {incident.status !== 'detected' && (
            <div className="bg-[#1C2721] p-6 rounded-2xl shadow-md text-white">
...
            </div>
          )}
*/
// Let's replace that specific block.

const toReplace = `          {incident.status !== 'detected' && (
            <div className="bg-[#1C2721] p-6 rounded-2xl shadow-md text-white">
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-4">Response Plan</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Truck className="w-4 h-4" /> Team Assigned
                  </div>
                  <div className="font-medium text-lg">{incident.response.teamAssigned}</div>
                  <div className="text-sm text-gray-400 mt-1">{incident.response.personnel} Personnel</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Clock className="w-4 h-4" /> Distance & ETA
                  </div>
                  <div className="font-medium text-lg">{incident.response.distanceKm} km</div>
                  <div className="text-sm text-gray-400 mt-1">~ {incident.response.etaMins} mins away</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Droplet className="w-4 h-4" /> Nearest water resource
                  </div>
                  <div className="font-medium text-lg">{incident.response.nearestWater}</div>
                  <div className="text-sm text-gray-400 mt-1">Road: {incident.response.nearestRoad}</div>
                </div>
              </div>
            </div>
          )}`;

if (content.includes(toReplace)) {
  content = content.replace(toReplace, replacementJSX);
} else {
  console.log("Could not find response block to replace. Here is what exists:");
  console.log(content.substring(content.indexOf("Evidence Sources") - 1000, content.indexOf("Evidence Sources")));
}

// 4. Update the Map to add GeoJSON layers
const mapMarker = `
              <Marker
                position={[incident.location.coordinates.lat, incident.location.coordinates.lng]}
                icon={createFireMarker(incident.severity)}
              />
`;
const mapLayers = `
              <Marker
                position={[incident.location.coordinates.lat, incident.location.coordinates.lng]}
                icon={createFireMarker(incident.severity)}
              />
              
              {/* Context Layers */}
              {gisContext && (
                <>
                  {gisContext.nearestRoad?.geometry && (
                    <GeoJSON 
                      key={"road-" + incident.id}
                      data={{
                        type: "LineString",
                        coordinates: gisContext.nearestRoad.geometry
                      } as any}
                      style={{ color: '#d1d5db', weight: 4, opacity: 0.8 }}
                    />
                  )}
                  {gisContext.nearestWater?.geometry && (
                    <GeoJSON 
                      key={"water-" + incident.id}
                      data={{
                        type: "LineString", // It might be a polygon or line, Turf gives us coords. Wait, if it's polygon, LineString will render the outline, which is fine!
                        coordinates: gisContext.nearestWater.geometry
                      } as any}
                      style={{ color: '#3b82f6', weight: 4, opacity: 0.8 }}
                    />
                  )}
                  {gisContext.nearestSettlement?.coordinates && (
                    <Marker 
                      key={"settlement-" + incident.id}
                      position={[gisContext.nearestSettlement.coordinates[0], gisContext.nearestSettlement.coordinates[1]]}
                      icon={L.divIcon({
                        className: 'bg-transparent border-0',
                        html: '<div class="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-sm"></div>',
                        iconSize: [12, 12],
                        iconAnchor: [6, 6]
                      })}
                    />
                  )}
                </>
              )}
`;
content = content.replace(mapMarker, mapLayers);


fs.writeFileSync('src/components/IncidentDetails.tsx', content);
console.log("Updated IncidentDetails.tsx");

