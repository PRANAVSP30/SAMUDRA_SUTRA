import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { BookOpenCheck, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AdminReports() {
  const { reports, updateReportStatus, deleteReport } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ocean-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-accent-blue/30">
           <div>
              <button className="text-accent-blue/60 mb-2 hover:text-white" onClick={() => navigate('/admin/dashboard')}>← Back to Command Center</button>
              <h1 className="text-4xl font-extrabold flex items-center gap-3">
                 <BookOpenCheck className="text-accent-teal" size={36} /> Intelligence Feed
              </h1>
              <p className="text-xl text-accent-blue/70 mt-2">Approve real-time tags from Citizens</p>
           </div>
        </div>

        <div className="bg-ocean-800 rounded-3xl border border-accent-blue/20 p-6 shadow-xl relative glow-effect">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-teal mb-6">RAW DATA LOGS</h2>
            
            <div className="space-y-4">
                {reports.map((report) => (
                    <motion.div 
                        key={report.id} 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col md:flex-row bg-ocean-900 border border-white/5 rounded-2xl p-4 gap-6 items-center hover:border-accent-blue/30 transition-all"
                    >
                        <div className="w-full md:w-48 h-32 bg-ocean-800 border-2 border-dashed border-accent-blue/40 rounded-xl flex items-center justify-center text-accent-blue/30 text-xs text-center font-bold relative overflow-hidden">
                           {report.image ? (
                             <>
                               {/* Mock Image Representation */}
                               <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/20 to-accent-teal/10" />
                               <span className="z-10 bg-ocean-900/80 px-2 py-1 rounded shadow">{report.image}</span>
                             </>
                           ) : "NO IMAGE PROOF"}
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex justify-between mb-2">
                               <div className="text-xl font-bold flex items-center gap-2">
                                  Node: {report.user}
                               </div>
                               <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-widest ${
                                   report.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 
                                   report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' :
                                   'bg-red-500/20 text-red-500 border border-red-500/50'
                               }`}>
                                  {report.status.toUpperCase()}
                               </span>
                            </div>
                            
                            <div className="text-accent-blue/70 text-sm mb-4">
                                <span className="mr-4"><strong>Lat/Lng:</strong> {report.lat.toFixed(4)}, {report.lng.toFixed(4)}</span>
                                <span className="mr-4"><strong>Tags:</strong> {report.tags?.join(', ') || 'None'}</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            {report.status === 'pending' && (
                                <button onClick={() => updateReportStatus(report.id, 'in-progress')} className="bg-green-600/20 hover:bg-green-500/40 border border-green-500 text-green-300 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition">
                                    <CheckCircle2 size={16} /> Approve (Push to Map)
                                </button>
                            )}
                            <button onClick={() => deleteReport(report.id)} className="bg-red-600/20 hover:bg-red-500/40 border border-red-500 text-red-400 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition">
                                <XCircle size={16} /> Reject & Delete Fake
                            </button>
                             <button className="bg-ocean-800 hover:bg-ocean-700 border border-accent-blue text-accent-blue font-bold py-2 px-4 rounded-xl flex items-center justify-center transition">
                                <Eye size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {reports.length === 0 && (
                    <div className="text-center text-accent-blue/50 py-10">No intelligence reports in the queue.</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
