import fs from 'fs';

let content = fs.readFileSync('src/components/IncidentDetails.tsx', 'utf-8');

const mapMarker = `              <Marker
                position={[incident.location.coordinates.lat, incident.location.coordinates.lng]}
                icon={createFireMarker(incident.severity)}
              />`;

const mapLayers = `              <Marker
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
                      style={{ color: '#facc15', weight: 4, opacity: 0.9 }}
                    />
                  )}
                  {gisContext.nearestWater?.geometry && (
                    <GeoJSON 
                      key={"water-" + incident.id}
                      data={{
                        type: "LineString",
                        coordinates: gisContext.nearestWater.geometry
                      } as any}
                      style={{ color: '#3b82f6', weight: 4, opacity: 0.9 }}
                    />
                  )}
                  {gisContext.nearestSettlement?.coordinates && (
                    <Marker 
                      key={"settlement-" + incident.id}
                      position={[gisContext.nearestSettlement.coordinates[0], gisContext.nearestSettlement.coordinates[1]]}
                      icon={L.divIcon({
                        className: 'bg-transparent border-0',
                        html: '<div class="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center"></div>',
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                      })}
                    />
                  )}
                </>
              )}
`;

if (content.includes(mapMarker)) {
  content = content.replace(mapMarker, mapLayers);
  fs.writeFileSync('src/components/IncidentDetails.tsx', content);
  console.log("Successfully added map layers!");
} else {
  console.log("Could not find map marker to replace.");
}

