import { useState } from 'react';
import { Settings, Bell, Shield, Database, Cloud, Radio, Save, CheckCircle } from 'lucide-react';

export default function SettingsDashboard() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F7F6] overflow-hidden rounded-3xl">
      {/* Header */}
      <header className="px-4 md:px-6 py-4 shrink-0 flex justify-between items-center bg-white border-b border-gray-100">
        <div>
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 md:w-6 md:h-6 text-gray-700" /> <span className="hidden sm:inline">System Settings</span><span className="sm:hidden">Settings</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-orange-100 text-orange-800 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-orange-200">
            Demo Mode Active
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Data Sources */}
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" /> Data Sources & Integration
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <Cloud className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="font-bold text-gray-900">NASA FIRMS API</div>
                    <div className="text-xs text-gray-500">VIIRS & MODIS active fire data (Global)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">CONNECTED</span>
                  <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-not-allowed opacity-80">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <Cloud className="w-8 h-8 text-sky-600" />
                  <div>
                    <div className="font-bold text-gray-900">Open-Meteo</div>
                    <div className="text-xs text-gray-500">Live Weather & Forecasting API</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">CONNECTED</span>
                  <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-not-allowed opacity-80">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-emerald-600" />
                  <div>
                    <div className="font-bold text-gray-900">FSI Forest Survey</div>
                    <div className="text-xs text-gray-500">Forest Survey of India Risk Baselines</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">CONNECTED</span>
                  <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-not-allowed opacity-80">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <Radio className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="font-bold text-gray-900">IoT Ground Network</div>
                    <div className="text-xs text-gray-500">LoRaWAN Sensor Grid (Chhattisgarh)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">CONNECTED</span>
                  <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-not-allowed opacity-80">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Config */}
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" /> Operation Parameters
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Automated Dispatch Threshold (Risk Score)</label>
                <div className="flex items-center gap-4">
                  <input type="range" min="50" max="95" defaultValue="85" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  <span className="font-black text-gray-900 w-8">85</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Incidents exceeding this score trigger immediate responder allocation.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">IoT Anomaly Verification Window</label>
                <select defaultValue="30 Minutes" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>15 Minutes</option>
                  <option>30 Minutes</option>
                  <option>60 Minutes</option>
                  <option>120 Minutes</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Time allowed for ground verification before escalating an IoT alert.</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900">Simulation & Demo Mode</div>
                    <div className="text-xs text-gray-500">Use synthetic data for platform demonstrations</div>
                  </div>
                  <div className="w-12 h-6 bg-orange-500 rounded-full relative cursor-not-allowed">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            {saved ? <><CheckCircle className="w-5 h-5" /> Saved</> : <><Save className="w-5 h-5" /> Save Configuration</>}
          </button>
        </div>
      </div>
    </div>
  );
}
