import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Camera, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function UserTasks() {
  const { alerts, user, setCredits, credits } = useContext(AppContext);
  const navigate = useNavigate();

  // Load only active priorities created by Gov Admin
  const activeTasks = alerts.filter(a => a.status === 'Active');

  const handleAccept = (id) => {
    alert("Navigating to live hotspot...");
  };

  const handleComplete = async (id) => {
    try {
        await updateDoc(doc(db, 'alerts', id), { status: 'Resolved', resolvedBy: user?.name || 'Volunteer' });
        setCredits(credits + 50);
        alert("Cleanup Confirmed by AI! +50 Credits assigned to your ID.");
    } catch(e) {
        console.error("Failed to update alert resolution", e);
    }
  };

  return (
    <div className="min-h-screen bg-root p-4 md:p-8 text-primary font-sans overflow-x-hidden">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        <header className="flex justify-between items-center bg-panel p-6 rounded-[2rem] border border-subtle shadow-2xl mt-4">
           <div className="flex items-center gap-4">
              <button 
                 onClick={() => navigate('/user/dashboard')}
                 className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted hover:text-primary transition shadow-inner"
              >
                  ←
              </button>
              <div>
                 <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-500 flex items-center gap-3">
                     <AlertTriangle className="text-red-500" /> Active Cleanup Tasks
                 </h1>
                 <p className="text-xs text-muted font-medium mt-1">SUTRA Government Issued Priorities</p>
              </div>
           </div>
        </header>

        <div className="grid grid-cols-1 gap-6 pb-20">
            {activeTasks.length === 0 && (
                <div className="text-center py-20 bg-panel/50 rounded-[2rem] border border-subtle">
                    <CheckCircle2 size={64} className="mx-auto text-green-500/30 mb-4" />
                    <h2 className="text-2xl font-black text-muted-dark">Zone Clear!</h2>
                    <p className="text-muted text-sm mt-2">No active approved tasks currently.</p>
                </div>
            )}

            {activeTasks.map((task, i) => (
                <motion.div 
                   key={task.id}
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="bg-panel p-6 rounded-[2rem] border border-red-500/20 shadow-[0_10px_30px_rgba(239,68,68,0.1)] flex flex-col gap-4 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full pointer-events-none" />
                    
                    <div className="flex justify-between items-start z-10">
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 ${
                              task.priority === 'Critical' ? 'bg-red-500 text-primary animate-pulse' :
                              'bg-red-500/10 text-red-500 border border-red-500/30'
                           }`}><AlertTriangle size={10} /> PRIORITY: {task.priority}</span>
                        </div>
                    </div>
                    
                    <div className="z-10">
                        <h3 className="text-2xl font-black mb-1">{task.title}</h3>
                        <p className="text-muted text-sm leading-relaxed mb-4">{task.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs font-mono text-muted mb-6 bg-root/50 p-3 rounded-xl border border-subtle">
                            <span className="flex items-center gap-1"><MapPin size={12} className="text-accent-teal" /> {task.address || "Live Geolocated"}</span>
                            <span className="flex items-center gap-1"><Clock size={12} className="text-accent-blue" /> Dispatched: {task.timestamp?.toDate ? task.timestamp.toDate().toLocaleTimeString() : 'Live'}</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 z-10">
                        <button 
                           onClick={() => handleAccept(task.id)}
                           className="flex-1 bg-[#1C2A40] border border-subtle hover:bg-white/10 text-primary py-4 rounded-xl font-bold flex justify-center items-center transition"
                        >
                           <Navigation size={18} className="mr-2"/> GPS Navigate
                        </button>
                        <button 
                           onClick={() => handleComplete(task.id)}
                           className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 text-primary py-4 rounded-xl font-black tracking-wide flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform"
                        >
                           <Camera size={18} /> Sync Cleanup Proof
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>

      </div>
    </div>
  );
}