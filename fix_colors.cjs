const fs = require('fs');
let content = fs.readFileSync('src/components/LiveMonitoring.tsx', 'utf8');

// Fix telemetry card
content = content.replace(
  /className="bg-gradient-to-br from-\[\#111c16\] to-\[\#0a120d\] rounded-3xl p-6 text-slate-900 shadow-\[0_8px_30px_rgb\(0,0,0,0\.12\)\] border border-slate-200 relative overflow-hidden"/,
  'className="bg-gradient-to-br from-[#111c16] to-[#0a120d] rounded-3xl p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#1f2e24] relative overflow-hidden"'
);

// We should replace text-slate-900 with text-white, text-slate-600 with text-emerald-100, text-slate-500 with text-emerald-400, bg-slate-100 with bg-[#1f2e24] WITHIN the telemetry card ONLY.
