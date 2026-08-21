import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, MapPin, Printer, X, FileBarChart, AlertTriangle } from 'lucide-react';
import { FireService } from '../services/fireService';
import { FireIncident } from '../types';

interface ReportConfig {
  id: string;
  title: string;
  type: string;
  description: string;
  icon: any;
  color: string;
}

const REPORT_TYPES: ReportConfig[] = [
  { id: 'daily', title: 'Daily Situation Report', type: 'Daily', description: 'Summary of all active incidents and response activities for the past 24 hours.', icon: FileText, color: 'bg-blue-100 text-blue-600' },
  { id: 'weekly', title: 'Weekly Fire Summary', type: 'Weekly', description: 'Aggregated metrics and trends for the past 7 days across all districts.', icon: FileBarChart, color: 'bg-purple-100 text-purple-600' },
  { id: 'district', title: 'District Risk Report', type: 'Assessment', description: 'Detailed breakdown of high-risk zones and preventative measures by district.', icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' },
  { id: 'major', title: 'Major Incident Report', type: 'Critical', description: 'In-depth analysis of critical severity incidents and major resource deployments.', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  { id: 'seasonal', title: 'Seasonal Fire Assessment', type: 'Seasonal', description: 'Pre-season risk analysis and resource readiness evaluation.', icon: Calendar, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'annual', title: 'Annual Assessment', type: 'Annual', description: 'Comprehensive year-in-review covering all incidents, burned area, and system performance.', icon: FileText, color: 'bg-slate-100 text-slate-600' },
];

export default function ReportsDashboard() {
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportConfig | null>(null);
  
  useEffect(() => {
    FireService.getIncidents().then(setIncidents);
  }, []);

  const totalActive = incidents.filter(i => ['detected', 'verifying', 'confirmed', 'responding'].includes(i.status)).length;
  const criticalCount = incidents.filter(i => i.severity === 'critical').length;
  const totalArea = incidents.reduce((sum, i) => sum + i.impact.areaAffectedHa, 0);

  const handlePrint = () => {
    window.print();
  };

  const generateReportPreview = (config: ReportConfig) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return (
      <div className="bg-white p-4 md:p-8 rounded-xl w-full max-w-4xl mx-auto printable-report text-slate-900 border border-slate-200 shadow-sm overflow-hidden" id="report-content">
        <div className="flex flex-col md:flex-row md:justify-between items-start mb-6 md:mb-8 pb-4 md:pb-6 border-b-2 border-gray-900 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">{config.title}</h1>
            <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date Generated: {today}
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-xl font-bold tracking-widest uppercase">VanRakshak</div>
            <div className="text-xs font-bold text-slate-500">Forest Intelligence System</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Executive Summary</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            This {config.type.toLowerCase()} report provides an overview of forest fire incidents and operational metrics within the VanRakshak monitoring jurisdiction. 
            Currently, there are <strong className="text-red-600">{totalActive} active incidents</strong> being tracked, 
            including <strong className="text-red-600">{criticalCount} critical severity</strong> events.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-slate-200 text-center">
              <div className="text-3xl font-black">{incidents.length}</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">Total Monitored</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-slate-200 text-center">
              <div className="text-3xl font-black text-red-600">{criticalCount}</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">Critical Events</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-slate-200 text-center">
              <div className="text-3xl font-black">{totalArea.toFixed(1)}</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">Total Area (Ha)</div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Incident Roster</h2>
          
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
      {incidents.map(inc => (
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
    {incidents.map(inc => (
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

          {incidents.length > 10 && (
            <div className="text-center text-xs text-slate-500 font-bold mt-4 italic">
              * Showing top 10 incidents. Full dataset available in export.
            </div>
          )}
        </div>
        
        <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-500 uppercase">
          <div>Generated by VanRakshak Automated Reporting</div>
          <div>Page 1 of 1</div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col  bg-[#F5F7F6]  rounded-3xl relative">
      <header className="px-4 md:px-6 py-4 md:py-5 shrink-0 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-tight">Reports Generation</h1>
          <p className="text-sm text-slate-500 font-medium">Automated operational reports and historical assessments.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-md border border-green-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">System Operational</span>
          </div>
          <span className="bg-orange-100 text-orange-800 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-orange-200">
            Demo Data
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {REPORT_TYPES.map(report => (
            <div key={report.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${report.color}`}>
                  <report.icon className="w-6 h-6" />
                </div>
                <div className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                  {report.type}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{report.title}</h3>
              <p className="text-sm text-slate-500 font-medium flex-1 mb-6">{report.description}</p>
              
              <div className="border-t border-slate-200 pt-4 mt-auto">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4 uppercase">
                  <span>Data: Live (<span className="text-emerald-600">Syncing</span>)</span>
                  <span>{incidents.length} Records</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="flex-1 bg-gray-50 hover:bg-slate-100 text-slate-900 font-bold py-2 px-4 rounded-xl text-sm transition-colors border border-slate-200 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedReport(report);
                      setTimeout(() => handlePrint(), 100);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Export
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="absolute inset-0 z-50 bg-slate-50/40 backdrop-blur-sm flex justify-center items-start pt-10 pb-10 overflow-y-auto print:static print:bg-white print:p-0">
          <div className="relative w-full max-w-4xl mx-auto print:w-full">
            {/* Modal Actions - Hidden on print */}
            <div className="sticky top-0 z-10 flex justify-end gap-2 mb-4 pr-4 print:hidden">
              <button 
                onClick={handlePrint}
                className="bg-white text-slate-900 font-bold px-4 py-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2 hover:bg-slate-50"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
              <button 
                onClick={() => setSelectedReport(null)}
                className="bg-white text-slate-900 font-bold p-2 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Report Content */}
            {generateReportPreview(selectedReport)}
          </div>
        </div>
      )}
    </div>
  );
}
