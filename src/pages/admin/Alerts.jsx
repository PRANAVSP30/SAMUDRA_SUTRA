import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { AlertOctagon, Plus, MapPin, Target, CheckCircle2, Clock } from 'lucide-react';

export default function AdminAlerts() {
  const { alerts, user } = useContext(AppContext);
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ title: '', description: '', address: '', priority: 'High' });

  const handleCreateAlert = async (e) => {
      e.preventDefault();
      try {
          await addDoc(collection(db, 'alerts'), {
              ...newAlert,
              status: 'Active',
              timestamp: serverTimestamp()
          });
          setShowForm(false);
          setNewAlert({ title: '', description: '', address: '', priority: 'High' });
      } catch (e) {
          console.error(e);
      }
  };

  const markResolved = async (id) => {
      await updateDoc(doc(db, 'alerts', id), { status: 'Resolved' });
  };

  const deleteAlert = async (id) => {
      await deleteDoc(doc(db, 'alerts', id));
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-primary font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Header Setup */}
        <header className="flex justify-between items-center bg-[#0A111F] p-6 rounded-[2rem] border border-[#1C2A40] shadow-2xl">
           <div className="flex items-center gap-4">
              <button 
                 onClick={() => navigate('/admin/dashboard')}
                 className="w-12 h-12 rounded-full bg-[#1C2A40] flex items-center justify-center text-muted hover:text-primary transition shadow-inner"
              >
                  ←
              </button>
              <div>
                 <h1 className="text-2xl font-black tracking-tight flex items-center gap-3"><AlertOctagon className="text-red-500" /> Crisis Command Center</h1>
                 <p className="text-xs text-muted font-medium mt-1">Deploy automated and manual public alerts to citizens.</p>
              </div>
           </div>
           
           <button 
              onClick={() => setShowForm(!showForm)}
              className="hidden md:flex items-center gap-2 bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue border border-accent-blue/30 px-6 py-3 rounded-xl font-bold transition"
           >
              <Plus size={18} /> CREATE MANUAL ALERT
           </button>
        </header>

        {/* Create Form Modal */}
        {showForm && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="bg-[#0A111F] border border-accent-blue/30 rounded-[2rem] p-8 shadow-[0_0_30px_rgba(79,172,254,0.1)] relative overflow-hidden overflow-visible"
            >
               <h2 className="text-xl font-black mb-6 flex items-center gap-2"><Target className="text-accent-teal" /> DEPLOY TASK FORCE</h2>
               <form onSubmit={handleCreateAlert} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                       <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">Crisis Title</label>
                       <input 
                          type="text" required value={newAlert.title} onChange={e=>setNewAlert({...newAlert, title: e.target.value})}
                          className="w-full bg-[#1C2A40] border-none rounded-xl p-4 text-primary focus:ring-1 focus:ring-accent-blue" 
                          placeholder="e.g. Major Plastic Spill Setup" 
                        />
                   </div>
                   <div>
                       <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">Location Identity</label>
                       <input 
                          type="text" required value={newAlert.address} onChange={e=>setNewAlert({...newAlert, address: e.target.value})}
                          className="w-full bg-[#1C2A40] border-none rounded-xl p-4 text-primary focus:ring-1 focus:ring-accent-blue" 
                          placeholder="e.g. Gateway of India Coast" 
                        />
                   </div>
                   <div className="md:col-span-2">
                       <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">Objective Description</label>
                       <textarea 
                          required value={newAlert.description} onChange={e=>setNewAlert({...newAlert, description: e.target.value})}
                          className="w-full bg-[#1C2A40] border-none rounded-xl p-4 text-primary focus:ring-1 focus:ring-accent-blue h-24 resize-none" 
                          placeholder="Enter details of what needs to be cleaned..." 
                        ></textarea>
                   </div>
                   <div>
                       <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-2">Priority Level</label>
                       <select 
                          value={newAlert.priority} onChange={e=>setNewAlert({...newAlert, priority: e.target.value})}
                          className="w-full bg-[#1C2A40] border-none rounded-xl p-4 text-primary focus:ring-1 focus:ring-accent-blue outline-none" 
                        >
                           <option>High</option>
                           <option>Critical</option>
                           <option>Medium</option>
                       </select>
                   </div>
                   <div className="flex items-end justify-end gap-3">
                       <button type="button" onClick={() => setShowForm(false)} className="px-6 py-4 text-muted font-bold hover:text-primary">Cancel</button>
                       <button type="submit" className="px-8 py-4 bg-red-500 hover:bg-red-400 text-primary font-black rounded-xl">BROADCAST GLOBALLY</button>
                   </div>
               </form>
            </motion.div>
        )}

        {/* Alerts Feed */}
        <div className="flex flex-col gap-4">
            {alerts.length === 0 && (
                <div className="text-center py-20 bg-[#0A111F] rounded-[2rem] border border-[#1C2A40] text-muted-dark font-medium">
                    No active crises reported. Coastlines are clear.
                </div>
            )}

            {alerts.map((alert, i) => {
                const isResolved = alert.status === 'Resolved';
                
                return (
                <motion.div 
                   key={alert.id}
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.1 }}
                   className={`p-6 rounded-[2rem] border relative overflow-hidden ${isResolved ? 'bg-[#0A111F]/50 border-green-500/20' : 'bg-[#0A111F] border-red-500/30 shadow-[0_10px_30px_rgba(239,68,68,0.1)]'}`}
                >
                   {/* Background Glow */}
                   {!isResolved && <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/5 blur-[50px] rounded-full" />}
                   
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                       
                       <div className="flex-1">
                           <div className="flex items-center gap-3 mb-2">
                               <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                                  alert.priority === 'Critical' ? 'bg-red-500 text-primary animate-pulse' :
                                  'bg-red-500/10 text-red-500 border border-red-500/30'
                               }`}>PRIORITY: {alert.priority || 'HIGH'}</span>
                               
                               <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                                  isResolved ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'
                               }`}>{alert.status}</span>
                           </div>
                           
                           <h3 className={`text-xl font-black mb-2 ${isResolved ? 'text-muted-dark line-through' : 'text-primary'}`}>{alert.title}</h3>
                           <p className="text-muted text-sm mb-4 leading-relaxed max-w-2xl">{alert.description}</p>
                           
                           <div className="flex items-center gap-4 text-xs font-mono text-muted-dark">
                               <span className="flex items-center gap-1"><MapPin size={12} /> {alert.address || "Live Geolocated"}</span>
                               <span className="flex items-center gap-1"><Clock size={12} /> {alert.timestamp?.toDate ? alert.timestamp.toDate().toLocaleDateString() : 'Syncing'}</span>
                           </div>
                       </div>

                       <div className="flex gap-3 w-full md:w-auto">
                           {!isResolved && (
                               <button 
                                  onClick={() => markResolved(alert.id)}
                                  className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition"
                               >
                                  <CheckCircle2 size={16} /> Mark Resolved
                               </button>
                           )}
                           <button 
                              onClick={() => deleteAlert(alert.id)}
                              className="px-6 py-3 bg-[#1C2A40] hover:bg-red-500/20 text-muted hover:text-red-400 rounded-xl font-bold transition flex justify-center items-center"
                           >
                              Delete
                           </button>
                       </div>
                   </div>
                </motion.div>
            )})}
        </div>
      </div>
    </div>
  );
}