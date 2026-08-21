import { Users, Truck, Navigation } from 'lucide-react';

export default function PatrolUnits() {
  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Patrol Units
        </h1>
        <p className="text-sm text-gray-400 mt-1">Ground Force Deployment and Tracking</p>
      </div>

      <div className="bg-[#121E15] p-6 rounded-2xl border border-white/5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5 text-gray-400 uppercase text-xs">
              <tr>
                <th className="pb-3 font-bold">Unit ID</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Current Sector</th>
                <th className="pb-3 font-bold">Assigned Incident</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: 'PU-01 (Bravo)', status: 'Deployed', sector: 'Sector 4 (Raipur)', incident: 'FIRMS-CG-001', color: 'text-red-400' },
                { id: 'PU-04 (Echo)', status: 'Patrolling', sector: 'Sector 2', incident: 'None', color: 'text-green-400' },
                { id: 'PU-11 (Alpha)', status: 'Standby', sector: 'HQ', incident: 'None', color: 'text-gray-300' },
              ].map((unit, idx) => (
                <tr key={idx}>
                  <td className="py-4 font-bold text-white">{unit.id}</td>
                  <td className={`py-4 font-bold ${unit.color}`}>{unit.status}</td>
                  <td className="py-4 text-gray-300">{unit.sector}</td>
                  <td className="py-4 text-gray-300">{unit.incident}</td>
                  <td className="py-4 text-right">
                    <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-1.5 px-3 rounded-lg transition-colors">
                      Contact
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
