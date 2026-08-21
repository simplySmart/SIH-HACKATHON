import { Radio, Wifi, Server, Activity } from 'lucide-react';

export default function Communication() {
  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Communication Status
        </h1>
        <p className="text-sm text-gray-400 mt-1">LoRa, Gateway, and Internet Connectivity Health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121E15] p-6 rounded-2xl border border-white/5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Radio className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">LoRa Network</h2>
              <p className="text-sm text-green-400 font-medium">Online (98% Coverage)</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Active Nodes</span>
              <span className="font-bold text-white">1,402 / 1,450</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Signal Strength</span>
              <span className="font-bold text-white">-85 dBm (Avg)</span>
            </div>
          </div>
        </div>

        <div className="bg-[#121E15] p-6 rounded-2xl border border-white/5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Server className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Gateways</h2>
              <p className="text-sm text-blue-400 font-medium">4/5 Active</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Raipur HQ</span>
              <span className="font-bold text-green-400">Online</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Bilaspur Zone</span>
              <span className="font-bold text-green-400">Online</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Surguja Zone</span>
              <span className="font-bold text-red-400">Offline (Main.)</span>
            </div>
          </div>
        </div>

        <div className="bg-[#121E15] p-6 rounded-2xl border border-white/5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Wifi className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Internet Link</h2>
              <p className="text-sm text-purple-400 font-medium">Stable</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Uplink</span>
              <span className="font-bold text-white">120 Mbps</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Downlink</span>
              <span className="font-bold text-white">250 Mbps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
