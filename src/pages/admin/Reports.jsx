import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../../context/AppContext';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, MapPin, AlertTriangle, ArrowLeft, LogOut } from 'lucide-react';

export default function AdminReports() {
  const { reports, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-root text-muted font-sans p-6 md:p-12 overflow-x-hidden">
      
      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-8">
          <button 
             onClick={() => navigate('/admin/dashboard')}
             className="flex items-center gap-2 text-muted hover:text-primary transition group"
          >
              <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center border border-subtle group-hover:border-accent-blue/30 transition">
                 <ArrowLeft size={14} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Back to Command</span>
          </button>
          
          <button onClick={() => { auth.signOut().catch(()=>{}); setUser(null); navigate('/login'); }} className="text-muted hover:text-red-500 transition flex items-center gap-2 bg-red-500/5 hover:bg-red-500/10 px-6 py-2 border border-red-500/10 rounded-full group cursor-pointer">
              <LogOut size={14} className="group-hover:text-red-500 transition"/> <span className="text-[10px] font-black uppercase tracking-widest text-red-400 group-hover:text-red-500">System Logout</span>
          </button>
      </div>

      <div className="max-w-5xl mx-auto">
          {/* DATABASE CONTAINER */}
          <div className="bg-panel border border-subtle p-6 md:p-10 rounded-xl shadow-2xl relative overflow-hidden">
             
             {/* Neon Header */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue/0 via-accent-blue to-accent-blue/0 opacity-50" />
             
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                  <div>
                      <h3 className="text-lg font-black text-primary uppercase tracking-widest flex items-center gap-3">
                         <FileText size={20} className="text-accent-blue" /> Civilian Upload Database
                      </h3>
                      <p className="text-xs text-muted-dark font-mono mt-2">Live sync node connected to public endpoints.</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-dark bg-deep/50 px-3 py-1.5 rounded border border-subtle flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Sync Active
                      </span>
                      <span className="text-xs font-mono text-muted-dark bg-deep/50 px-3 py-1.5 rounded border border-subtle">
                          Total: {reports?.length || 0}
                      </span>
                  </div>
              </div>
              
              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reports && reports.length > 0 ? reports.map((report, i) => (
                      <motion.div 
                         key={report.id} 
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.1 }}
                         className="bg-card border border-subtle p-5 rounded-xl flex flex-col gap-4 group hover:border-accent-blue/30 transition duration-300"
                      >
                         <div className="w-full h-40 rounded-lg overflow-hidden border border-subtle relative bg-deep shadow-inner">
                             {report.imageBase64 || report.imageUrl ? (
                                <img src={report.imageBase64 || report.imageUrl} alt="intel" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                             ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-600"><AlertTriangle size={32}/></div>
                             )}
                         </div>
                         <div className="flex-1 overflow-hidden flex flex-col justify-between gap-3">
                            <div>
                                <h4 className="text-primary text-xs font-bold leading-tight line-clamp-2 mb-1.5">{report.tags?.[0] || report.prediction}</h4>
                                <p className="text-[10px] font-mono text-muted truncate"><MapPin size={10} className="inline mr-1 text-accent-blue" />{report.address}</p>
                            </div>
                            
                            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 px-3 py-2 rounded-lg w-full justify-center mt-2 group-hover:bg-green-500/20 transition">
                               <Shield size={12} className="text-green-500" />
                               <span className="text-[10px] font-black text-green-500 tracking-widest uppercase">AI Verified</span>
                            </div>
                         </div>
                      </motion.div>
                  )) : (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-card rounded-xl border border-subtle border-dashed">
                          <AlertTriangle size={48} className="mx-auto text-gray-700 mb-4" />
                          <p className="text-muted-dark text-sm font-mono">Network silent. No incoming citizen reports detected.</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}