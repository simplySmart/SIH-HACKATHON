import fs from 'fs';
let content = fs.readFileSync('src/components/IncidentDetails.tsx', 'utf-8');

const replacementJSX = `
          {/* Provenance Panel */}
          <div className="bg-[#0f1912]/80 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex justify-between items-center">
              <span>Detection Provenance</span>
              <span className="bg-green-100 text-green-800 text-[10px] px-2.5 py-1 rounded-full font-bold">Confidence: {incident.latestConfidence || incident.detection.confidence}%</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Sources</div>
                <div className="font-bold text-white text-sm">{incident.satelliteSources?.join(', ') || 'N/A'}</div>
              </div>
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">First Detection</div>
                <div className="font-bold text-white text-sm">
                  {incident.firstDetectedAt ? new Date(incident.firstDetectedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                </div>
              </div>
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Max FRP</div>
                <div className="font-bold text-white text-sm">{incident.maximumFRP ? \`\${incident.maximumFRP} MW\` : 'N/A'}</div>
              </div>
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Forest Screening</div>
                <div className="font-bold text-white text-sm">{incident.detection.forestScreening || 'UNKNOWN'}</div>
              </div>
            </div>

            {incident.satelliteDetections && incident.satelliteDetections.length > 0 && (
              <div className="mt-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Raw Detections ({incident.detectionCount})</div>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                  {incident.satelliteDetections.map((det, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                      <div>
                        <div className="text-xs font-bold text-white">{det.satellite} {det.instrument}</div>
                        <div className="text-[10px] text-gray-400">{det.acq_date} {det.acq_time} UTC</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-orange-400">{det.frp} MW</div>
                        <div className="text-[10px] text-gray-400">{det.confidence}% Conf</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
`;

const startStr = "{/* Evidence Sources */}";
const endStr = "{/* Right Column (Map & Timeline) */}";
const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + replacementJSX + "\n        </div>\n        " + content.substring(endIndex);
  fs.writeFileSync('src/components/IncidentDetails.tsx', content);
  console.log("Replaced Evidence Sources with Provenance Panel");
} else {
  console.log("Could not find delimiters");
}
