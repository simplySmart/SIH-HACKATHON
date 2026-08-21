import fs from 'fs';

const content = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf-8');

const mapLogic = `
  // Spatial Grid / Density Layer
  const spatialGrid = useMemo(() => {
    const grid: any[] = [];
    if (filteredData.length === 0) return grid;
    
    // CG Bounds approx
    const minLat = 17.5; const maxLat = 24.5;
    const minLng = 80.0; const maxLng = 84.5;
    const step = 0.2; // 0.2 degree grid cells (~22km)
    
    for (let lat = minLat; lat <= maxLat; lat += step) {
      for (let lng = minLng; lng <= maxLng; lng += step) {
        let count = 0;
        for (let i = 0; i < filteredData.length; i++) {
          const d = filteredData[i];
          if (d.lat >= lat && d.lat < lat + step && d.lng >= lng && d.lng < lng + step) {
            count++;
          }
        }
        if (count > 0) {
          // Normalize color
          let fillOpacity = 0.2;
          let color = '#facc15'; // yellow
          if (count > 5) { fillOpacity = 0.4; color = '#f97316'; } // orange
          if (count > 15) { fillOpacity = 0.6; color = '#ef4444'; } // red
          if (count > 30) { fillOpacity = 0.8; color = '#7f1d1d'; } // dark red
          
          grid.push({
            bounds: [[lat, lng], [lat + step, lng + step]],
            count,
            color,
            fillOpacity
          });
        }
      }
    }
    return grid;
  }, [filteredData]);
`;

const mapJSX = `
            {/* Spatial Density Map */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm col-span-1 lg:col-span-3 mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                Historical Hotspot Density Layer
              </h3>
              <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-200 relative z-0">
                <MapContainer 
                  center={[21.25, 81.62]} 
                  zoom={6} 
                  className="w-full h-full"
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <ZoomControl position="bottomright" />
                  {spatialGrid.map((cell: any, idx: number) => (
                    <Rectangle
                      key={idx}
                      bounds={cell.bounds}
                      pathOptions={{
                        color: cell.color,
                        weight: 1,
                        fillColor: cell.color,
                        fillOpacity: cell.fillOpacity
                      }}
                    >
                      <LeafletTooltip>
                        <div className="font-bold text-gray-900">{cell.count} historical detections</div>
                        <div className="text-xs text-gray-500 mt-1">Grid Cell: {cell.bounds[0][0].toFixed(2)}, {cell.bounds[0][1].toFixed(2)}</div>
                      </LeafletTooltip>
                    </Rectangle>
                  ))}
                </MapContainer>
              </div>
            </div>
`;

let newContent = content.replace("const burnedArea =", mapLogic + "\n  const burnedArea =");
newContent = newContent.replace("            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 pb-6 lg:pb-0\">", mapJSX + "\n            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 pb-6 lg:pb-0\">");

fs.writeFileSync('src/components/AnalyticsDashboard.tsx', newContent);
console.log("Added map to Analytics Dashboard.");
