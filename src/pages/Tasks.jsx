import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Droplet, Award } from 'lucide-react';
import { getReports } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTasks(getReports().filter(r => r.status === 'pending'));
  }, []);

  const handleAccept = (id) => {
    // For demo purposes, we will just navigate to a success screen or update UI
    setTasks(tasks.filter(t => t.id !== id));
    alert("Task Accepted! Navigating to site...");
  };

  return (
    <div className="min-h-screen bg-ocean-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-teal to-accent-blue">Active Tasks</h1>
                <p className="text-xl text-accent-blue/70 mt-2">Nearby cleanup opportunities</p>
            </div>
            <button className="bg-ocean-800 border border-accent-blue/30 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-ocean-700 transition" onClick={() => navigate('/')}>
               Exit
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map(task => (
                <motion.div 
                   key={task.id}
                   whileHover={{ y: -5 }}
                   className="bg-ocean-800 p-6 rounded-3xl border border-accent-blue/20 flex flex-col gap-4 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 blur-[50px] rounded-full group-hover:scale-150 transition-all duration-500" />
                    
                    <div className="flex justify-between items-start z-10">
                       <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold font-mono">CRITICAL</span>
                       <span className="text-accent-teal font-medium">Reported by {task.citizen}</span>
                    </div>

                    <div className="z-10 mt-2">
                        <div className="flex items-center gap-3 mb-2 text-xl font-bold">
                            <MapPin className="text-red-400" /> 
                            Location: {task.lat.toFixed(2)}, {task.lng.toFixed(2)}
                        </div>
                        <p className="text-accent-blue/60 text-sm flex items-center gap-1">
                            <Droplet size={14} /> River Blockage Detected
                        </p>
                    </div>

                    <div className="flex gap-4 mt-6 z-10">
                        <button 
                           onClick={() => handleAccept(task.id)}
                           className="flex-1 bg-gradient-to-r from-accent-blue to-accent-teal py-3 rounded-xl font-bold shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/40 transition-all flex justify-center items-center gap-2 text-ocean-900"
                        >
                           <Award size={18} /> Accept Task (+10 CR)
                        </button>
                        <button className="bg-ocean-900 border border-accent-blue/30 p-3 rounded-xl hover:bg-ocean-700 transition">
                           <Navigation className="text-accent-blue" />
                        </button>
                    </div>
                </motion.div>
            ))}

            {tasks.length === 0 && (
                <div className="col-span-2 text-center py-20 bg-ocean-800 rounded-3xl border border-accent-teal/20">
                    <Droplet size={64} className="mx-auto text-accent-teal/30 mb-4" />
                    <h2 className="text-3xl font-bold text-accent-teal/50">All Clear!</h2>
                    <p className="text-accent-blue/60 mt-2">No active tasks in your region.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
