import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Camera, CheckCircle2 } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function UserTasks() {
  const { reports, updateReportStatus, user, setCredits, credits } = useContext(AppContext);
  const navigate = useNavigate();

  // Tasks that are approved by admin but not yet completed
  const tasks = reports.filter(r => r.status === 'in-progress');

  const handleAccept = (id) => {
    alert("Navigating to Google Maps...");
  };

  const handleComplete = (id) => {
    alert("Camera opening for Proof Collection...");
    setTimeout(() => {
        updateReportStatus(id, 'completed', { volunteer: user?.name || 'Volunteer' });
        setCredits(credits + 10);
        alert("Verification successful! +10 Credits assigned.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-ocean-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-10 border-b border-accent-blue/20 pb-6">
            <div>
                <button className="text-accent-blue/60 mb-2 hover:text-white" onClick={() => navigate('/user/home')}>← Hub</button>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-accent-teal">Active Tasks</h1>
                <p className="text-lg text-accent-blue/70 mt-2">Pick up verified hotspots</p>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
            {tasks.map(task => (
                <motion.div 
                   key={task.id}
                   whileHover={{ y: -5 }}
                   className="bg-ocean-800 p-6 rounded-3xl border border-accent-blue/30 flex flex-col md:flex-row gap-6 relative overflow-hidden group shadow-xl"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 blur-[50px] rounded-full" />
                    
                    <div className="flex-1 z-10">
                        <div className="flex justify-between items-start mb-4">
                           <span className="bg-red-500/20 text-red-500 border border-red-500/50 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-widest">CRITICAL</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2 text-xl font-bold">
                            <MapPin className="text-red-400" /> Lat {task.lat.toFixed(2)}, Lng {task.lng.toFixed(2)}
                        </div>
                        <p className="text-accent-blue/80 text-sm">Source Identified By: {task.user}</p>
                    </div>

                    <div className="flex flex-col gap-3 z-10 w-full md:w-64">
                        <button 
                           onClick={() => handleAccept(task.id)}
                           className="w-full bg-accent-blue/20 border border-accent-blue hover:bg-accent-blue text-white py-3 rounded-xl font-bold flex justify-center items-center transition"
                        >
                           <Navigation size={18} className="mr-2"/> Navigate
                        </button>
                        <button 
                           onClick={() => handleComplete(task.id)}
                           className="w-full bg-gradient-to-r from-green-500 to-green-600 border border-green-400 py-3 rounded-xl font-extrabold flex justify-center items-center gap-2 hover:opacity-90 shadow-lg shadow-green-500/20 transition"
                        >
                           <Camera size={18} /> Upload Proof
                        </button>
                    </div>
                </motion.div>
            ))}

            {tasks.length === 0 && (
                <div className="text-center py-20 bg-ocean-800 rounded-3xl border border-accent-blue/10">
                    <CheckCircle2 size={64} className="mx-auto text-accent-teal/30 mb-4" />
                    <h2 className="text-3xl font-bold text-accent-teal/50">Zone Clear!</h2>
                    <p className="text-accent-blue/60 mt-2">No active approved tasks currently.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
