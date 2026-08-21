import fs from 'fs';

let content = fs.readFileSync('src/components/IncidentDetails.tsx', 'utf-8');

const confidenceEngine = `
          {/* Fire Confidence Engine */}
          <div className="bg-[#0f1912]/80 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Fire Confidence Engine</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Satellite (NASA)</div>
                <div className="font-bold text-white text-sm">{incident.latestConfidence || incident.detection.confidence || 'N/A'}% Confidence</div>
              </div>
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">IoT Sensors</div>
                <div className="font-bold text-yellow-400 text-sm">Elevated CO2</div>
              </div>
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">AI Camera</div>
                <div className="font-bold text-gray-400 text-sm">No Visual (Smoke)</div>
              </div>
              <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Weather Context</div>
                <div className="font-bold text-orange-400 text-sm">High Risk (VPD &gt; 1.5)</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Overall Synthesis</div>
              <div className="text-sm font-black text-red-400 bg-red-500/10 px-3 py-1 rounded border border-red-500/20">CONFIRMED FIRE EVENT (92%)</div>
            </div>
          </div>
`;

const replaceTarget = `{/* Lifecycle Horizontal Bar */}`;
if (content.includes(replaceTarget)) {
  content = content.replace(replaceTarget, confidenceEngine + "\n          " + replaceTarget);
  fs.writeFileSync('src/components/IncidentDetails.tsx', content);
  console.log("Added Fire Confidence Engine");
}
