const fs = require('fs');

let content = fs.readFileSync('src/components/CommandCenter.tsx', 'utf8');

// Replace the table with responsive layout
// We find the table tag and replace the whole block up to </table>
const tableStart = content.indexOf('<table className="w-full text-left text-xs">');
const tableEnd = content.indexOf('</table>', tableStart) + '</table>'.length;

const before = content.substring(0, tableStart);
const after = content.substring(tableEnd);

const newTableCode = `
<div className="w-full">
  {/* Desktop Table */}
  <div className="hidden md:block">
    <table className="w-full text-left text-xs table-fixed">
      <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider sticky top-0 z-10">
        <tr>
          <th className="px-4 py-3 border-b border-slate-200 w-[15%]">ID / Beat</th>
          <th className="px-4 py-3 border-b border-slate-200 w-[12%]">Conf.</th>
          <th className="px-4 py-3 border-b border-slate-200 w-[18%]">Severity</th>
          <th className="px-4 py-3 border-b border-slate-200 w-[15%]">Status</th>
          <th className="px-4 py-3 border-b border-slate-200 w-[15%]">Assigned</th>
          <th className="px-4 py-3 border-b border-slate-200 w-[15%]">Time</th>
          <th className="px-4 py-3 border-b border-slate-200 w-[10%] text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {incidents.slice(0,5).map(inc => (
          <tr key={inc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3">
              <div className="font-bold text-slate-900">{inc.id}</div>
              <div className="text-slate-500 text-[10px] truncate">{inc.location.beat}</div>
            </td>
            <td className="px-4 py-3">
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold">{Math.round(inc.confidence * 100)}%</span>
            </td>
            <td className="px-4 py-3">
              <span className={\`text-[10px] font-bold px-2 py-1 rounded uppercase \${getSeverityColor(inc.severity)}\`}>{inc.severity}</span>
            </td>
            <td className="px-4 py-3">
              <span className={\`font-bold \${getStatusColor(inc.status)}\`}>{inc.status.toUpperCase()}</span>
            </td>
            <td className="px-4 py-3 text-slate-600 truncate">{inc.assignedUnits?.length || 0} Units</td>
            <td className="px-4 py-3 text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </td>
            <td className="px-4 py-3 text-right">
              <button onClick={() => navigate(\`/incidents/\${inc.id}\`)} className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded transition-colors" title="View Details">
                <Eye className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  {/* Mobile Cards */}
  <div className="md:hidden flex flex-col gap-3 p-4">
    {incidents.slice(0,5).map(inc => (
      <div key={inc.id} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 shadow-sm" onClick={() => navigate(\`/incidents/\${inc.id}\`)}>
        <div className="flex justify-between items-start">
          <div>
            <div className="font-bold text-slate-900">{inc.id}</div>
            <div className="text-slate-500 text-[10px] truncate">{inc.location.beat}</div>
          </div>
          <span className={\`text-[10px] font-bold px-2 py-1 rounded uppercase \${getSeverityColor(inc.severity)}\`}>{inc.severity}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Status</span>
            <span className={\`font-bold \${getStatusColor(inc.status)}\`}>{inc.status.toUpperCase()}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Confidence</span>
            <span className="text-slate-900 font-bold">{Math.round(inc.confidence * 100)}%</span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
`;

// Remove <div className="overflow-x-auto"> wrapper if it exists around it
let beforeReplaced = before;
if (beforeReplaced.endsWith('<div className="overflow-x-auto">              ')) {
  beforeReplaced = beforeReplaced.substring(0, beforeReplaced.lastIndexOf('<div className="overflow-x-auto">'));
}
let afterReplaced = after;
if (afterReplaced.startsWith('            </div>')) {
  afterReplaced = afterReplaced.substring(afterReplaced.indexOf('</div>') + 6);
}

fs.writeFileSync('src/components/CommandCenter.tsx', beforeReplaced + newTableCode + afterReplaced);
console.log("Fixed CC table");
