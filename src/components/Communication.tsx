import { Radio, Wifi, Server, Activity } from 'lucide-react';

export default function Communication() {
  return (
    <div className="flex flex-col   space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Communication Status
        </h1>
        <p className="text-sm text-slate-500 mt-1">LoRa, Gateway, and Internet Connectivity Health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Radio className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">LoRa Network</h2>
              <p className="text-sm text-emerald-600 font-medium">Online (98% Coverage)</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Active Nodes</span>
              <span className="font-bold text-slate-900">1,402 / 1,450</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Signal Strength</span>
              <span className="font-bold text-slate-900">-85 dBm (Avg)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Gateways</h2>
              <p className="text-sm text-blue-600 font-medium">4/5 Active</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Raipur HQ</span>
              <span className="font-bold text-emerald-600">Online</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Bilaspur Zone</span>
              <span className="font-bold text-emerald-600">Online</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Surguja Zone</span>
              <span className="font-bold text-red-600">Offline (Main.)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Wifi className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Internet Link</h2>
              <p className="text-sm text-purple-600 font-medium">Stable</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Uplink</span>
              <span className="font-bold text-slate-900">120 Mbps</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Downlink</span>
              <span className="font-bold text-slate-900">250 Mbps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
