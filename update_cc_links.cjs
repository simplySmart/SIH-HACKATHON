const fs = require('fs');
let content = fs.readFileSync('src/components/CommandCenter.tsx', 'utf8');

const ccStatus = `          {/* COMMUNICATION STATUS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm shrink-0 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/communication')}>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><Radio className="w-4 h-4 text-cyan-600" /> Communication Status</div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600">LoRa Mesh</span>
                <span className="text-[10px] font-bold text-emerald-600">98% UP</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600">Gateway</span>
                <span className="text-[10px] font-bold text-emerald-600">5/5 Online</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600">Cellular</span>
                <span className="text-[10px] font-bold text-orange-600">Degraded</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600">Satellite Uplink</span>
                <span className="text-[10px] font-bold text-emerald-600">Active</span>
              </div>
            </div>
          </div>`;

const mapLink = `
          {/* LIVE FOREST MAP LINK */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm shrink-0 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/monitoring')}>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-600" /> Full Live Forest Map</div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </h3>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-emerald-800">Explore Interactive Map</div>
                  <div className="text-[10px] text-emerald-600">View real-time satellite telemetry, weather overlays, and spatial analytics</div>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600">
                  <Activity className="w-5 h-5" />
                </div>
            </div>
          </div>
`;

content = content.replace(ccStatus, ccStatus + mapLink);
fs.writeFileSync('src/components/CommandCenter.tsx', content);
