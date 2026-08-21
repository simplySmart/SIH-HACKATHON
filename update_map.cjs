const fs = require('fs');
let content = fs.readFileSync('src/components/CommandCenter.tsx', 'utf8');

const oldMap = `<TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />`;

const newMap = `<LayersControl position="topright">
                  <LayersControl.BaseLayer checked name="Satellite View">
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution='Tiles &copy; Esri'
                    />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer name="Street View">
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>`;

content = content.replace(oldMap, newMap);

fs.writeFileSync('src/components/CommandCenter.tsx', content);
