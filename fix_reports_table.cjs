const fs = require('fs');

let content = fs.readFileSync('src/components/ReportsDashboard.tsx', 'utf8');

const tableStart = content.indexOf('<table className="w-full text-left border-collapse">');
const tableEnd = content.indexOf('</table>', tableStart) + '</table>'.length;

const before = content.substring(0, tableStart);
const after = content.substring(tableEnd);

const newTableCode = `
<div className="w-full">
  {/* Desktop Table View */}
  <table className="hidden md:table w-full text-left border-collapse">
    <thead>
      <tr className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
        <th className="p-3 border-b border-gray-300">ID</th>
        <th className="p-3 border-b border-gray-300">District</th>
        <th className="p-3 border-b border-gray-300">Status</th>
        <th className="p-3 border-b border-gray-300">Severity</th>
        <th className="p-3 border-b border-gray-300">Time</th>
      </tr>
    </thead>
    <tbody>
      {filtered.map(inc => (
        <tr key={inc.id} className="hover:bg-slate-50 transition-colors border-b border-gray-200">
          <td className="p-3 font-bold">{inc.id}</td>
          <td className="p-3 text-slate-600">{inc.location.district}</td>
          <td className="p-3 text-sm">{inc.status}</td>
          <td className="p-3 text-sm">{inc.severity}</td>
          <td className="p-3 text-slate-500 text-xs">{new Date(inc.timestamp).toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Mobile Cards View */}
  <div className="md:hidden flex flex-col gap-3">
    {filtered.map(inc => (
      <div key={inc.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-bold text-slate-900">{inc.id}</div>
            <div className="text-slate-500 text-xs">{inc.location.district}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold uppercase">{inc.severity}</div>
            <div className="text-[10px] text-slate-500">{new Date(inc.timestamp).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100">
          <span className="text-xs uppercase text-slate-500 font-bold mr-2">Status:</span>
          <span className="text-sm">{inc.status}</span>
        </div>
      </div>
    ))}
  </div>
</div>
`;

let beforeReplaced = before;
if (beforeReplaced.endsWith('<div className="overflow-x-auto">          ')) {
  beforeReplaced = beforeReplaced.substring(0, beforeReplaced.lastIndexOf('<div className="overflow-x-auto">'));
}
let afterReplaced = after;
if (afterReplaced.startsWith('        </div>')) {
  afterReplaced = afterReplaced.substring(afterReplaced.indexOf('</div>') + 6);
}

fs.writeFileSync('src/components/ReportsDashboard.tsx', beforeReplaced + newTableCode + afterReplaced);
console.log("Fixed ReportsDashboard table");
