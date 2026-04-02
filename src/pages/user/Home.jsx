import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

export default function UserHome() {
  const { user, reports, credits } = useContext(AppContext);
  const navigate = useNavigate();

  const activeTasks = reports.filter(r => r.status === 'in-progress' || r.status === 'pending');

  return (
    <div className="min-h-screen bg-root text-primary p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-teal/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />

      <div className="flex justify-between items-center z-10 relative mb-8">
         <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-gradient-to-tr from-accent-blue to-accent-teal rounded-full flex items-center justify-center font-bold text-ocean-900 text-xl shadow-lg shadow-accent-blue/30">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
             </div>
             <div>
                <h1 className="text-xl font-bold">Welcome, {user?.name || 'Citizen'}</h1>
                <p className="text-xs text-accent-blue/80 font-mono">NODE CONNECTED</p>
             </div>
         </div>
         <button onClick={() => navigate('/login')} className="bg-panel border-2 border-accent-blue/30 px-4 py-2 rounded-lg text-sm font-bold hover:bg-card transition shadow-lg shrink-0 text-red-300 border-red-500/30">
            Switch Node
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 max-w-4xl mx-auto mt-10">
         
         <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => navigate('/user/report')}
            className="bg-panel border border-accent-blue/30 rounded-3xl p-8 cursor-pointer flex flex-col justify-between shadow-xl shadow-accent-blue/5 glow-effect group overflow-hidden"
         >
             <div className="bg-card/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-accent-blue/50 group-hover:bg-accent-blue/20 transition-all">
                <Camera className="text-accent-blue group-hover:scale-110 transition-transform" size={32} />
             </div>
             <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-teal mb-2">Report Waste</h2>
             <p className="text-accent-blue/70">Activate AI scanner to tag pollution instantly.</p>
             
             <button className="mt-8 bg-accent-blue/20 w-full py-4 rounded-xl font-bold text-primary border border-accent-blue flex justify-center items-center gap-2 group-hover:bg-accent-blue group-hover:text-ocean-900 transition-all">
                <Camera size={18} /> Open Camera
             </button>
         </motion.div>

         <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => navigate('/user/tasks')}
            className="bg-panel border border-accent-teal/30 rounded-3xl p-8 cursor-pointer flex flex-col justify-between shadow-xl shadow-accent-teal/5 glow-effect group overflow-hidden"
         >
             <div className="bg-card/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-accent-teal/50 group-hover:bg-accent-teal/20 transition-all relative">
                <MapPin className="text-accent-teal group-hover:scale-110 transition-transform" size={32} />
                <div className="absolute -top-2 -right-2 bg-red-500 text-primary w-6 h-6 rounded-full flex justify-center items-center text-xs font-bold animate-bounce shadow">
                   {activeTasks.length}
                </div>
             </div>
             <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-accent-teal mb-2">View Tasks</h2>
             <p className="text-accent-blue/70">Check radar for active hotspots near you and earn credits.</p>
             
             <button className="mt-8 bg-accent-teal/20 w-full py-4 rounded-xl font-bold text-primary border border-accent-teal flex justify-center items-center gap-2 group-hover:bg-accent-teal group-hover:text-ocean-900 transition-all">
                <CheckCircle2 size={18} /> Assign Tasks
             </button>
         </motion.div>

         <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => navigate('/user/rewards')}
            className="col-span-1 md:col-span-2 bg-gradient-to-r from-ocean-800 to-ocean-700 border border-yellow-400/30 rounded-3xl p-8 cursor-pointer shadow-xl flex flex-col md:flex-row justify-between items-center group glow-effect"
         >
             <div>
                <h2 className="text-3xl font-black text-yellow-400 flex items-center gap-3 mb-2">
                   <Award size={32} /> My Rewards Hub
                </h2>
                <p className="text-accent-blue/70">Redeem your accumulated ocean credits.</p>
             </div>
             <div className="mt-6 md:mt-0 bg-root border border-yellow-500/50 px-8 py-4 rounded-2xl flex flex-col items-center">
                <span className="text-3xl font-black text-primary">{credits} CR</span>
                <span className="text-xs text-yellow-500 font-bold tracking-widest uppercase">Balance Available</span>
             </div>
         </motion.div>

      </div>
    </div>
  );
}