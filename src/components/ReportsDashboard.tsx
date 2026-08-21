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
  { id: 'annual', title: 'Annual Assessment', type: 'Annual', description: 'Comprehensive year-in-review covering all incidents, burned area, and system performance.', icon: FileText, color: 'bg-gray-100 text-gray-600' },
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
      <div className="bg-white p-8 rounded-xl max-w-4xl mx-auto printable-report text-gray-900 border border-gray-200 shadow-sm" id="report-content">
        <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-900">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">{config.title}</h1>
            <div className="text-sm font-bold text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date Generated: {today}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold tracking-widest uppercase">VanRakshak</div>
            <div className="text-xs font-bold text-gray-500">Forest Intelligence System</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Executive Summary</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This {config.type.toLowerCase()} report provides an overview of forest fire incidents and operational metrics within the VanRakshak monitoring jurisdiction. 
            Currently, there are <strong className="text-red-600">{totalActive} active incidents</strong> being tracked, 
            including <strong className="text-red-600">{criticalCount} critical severity</strong> events.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-black">{incidents.length}</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Total Monitored</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-black text-red-600">{criticalCount}</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Critical Events</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-black">{totalArea.toFixed(1)}</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Total Area (Ha)</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Incident Roster</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
                <th className="p-3 border-b border-gray-300">ID</th>
                <th className="p-3 border-b border-gray-300">District</th>
                <th className="p-3 border-b border-gray-300">Status</th>
                <th className="p-3 border-b border-gray-300">Severity</th>
                <th className="p-3 border-b border-gray-300 text-right">Area (Ha)</th>
              </tr>
            </thead>
            <tbody>
              {incidents.slice(0, 10).map((inc, idx) => (
                <tr key={inc.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 border-b border-gray-100 text-sm font-bold">{inc.id}</td>
                  <td className="p-3 border-b border-gray-100 text-sm">{inc.location.district}</td>
                  <td className="p-3 border-b border-gray-100 text-sm capitalize">{inc.status}</td>
                  <td className="p-3 border-b border-gray-100 text-sm font-bold">
                    <span className={inc.severity === 'critical' ? 'text-red-600' : ''}>{inc.severity.toUpperCase()}</span>
                  </td>
                  <td className="p-3 border-b border-gray-100 text-sm text-right">{inc.impact.areaAffectedHa}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {incidents.length > 10 && (
            <div className="text-center text-xs text-gray-500 font-bold mt-4 italic">
              * Showing top 10 incidents. Full dataset available in export.
            </div>
          )}
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between text-xs font-bold text-gray-400 uppercase">
          <div>Generated by VanRakshak Automated Reporting</div>
          <div>Page 1 of 1</div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F7F6] overflow-hidden rounded-3xl relative">
      <header className="px-6 py-5 shrink-0 flex justify-between items-center bg-white border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Reports Generation</h1>
          <p className="text-sm text-gray-500 font-medium">Automated operational reports and historical assessments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-md border border-green-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">System Operational</span>
          </div>
          <span className="bg-orange-100 text-orange-800 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-orange-200">
            Demo Data
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-6">
          {REPORT_TYPES.map(report => (
            <div key={report.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${report.color}`}>
                  <report.icon className="w-6 h-6" />
                </div>
                <div className="bg-gray-100 text-gray-600 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                  {report.type}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-500 font-medium flex-1 mb-6">{report.description}</p>
              
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-4 uppercase">
                  <span>Data: Live (<span className="text-green-600">Syncing</span>)</span>
                  <span>{incidents.length} Records</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold py-2 px-4 rounded-xl text-sm transition-colors border border-gray-200 flex items-center justify-center gap-2"
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
        <div className="absolute inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex justify-center items-start pt-10 pb-10 overflow-y-auto print:static print:bg-white print:p-0">
          <div className="relative w-full max-w-4xl mx-auto print:w-full">
            {/* Modal Actions - Hidden on print */}
            <div className="sticky top-0 z-10 flex justify-end gap-2 mb-4 pr-4 print:hidden">
              <button 
                onClick={handlePrint}
                className="bg-white text-gray-900 font-bold px-4 py-2 rounded-xl shadow-lg border border-gray-200 flex items-center gap-2 hover:bg-gray-50"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
              <button 
                onClick={() => setSelectedReport(null)}
                className="bg-white text-gray-900 font-bold p-2 rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50"
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
