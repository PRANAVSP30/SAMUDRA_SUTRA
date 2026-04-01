import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Edit, MapPin, PlusCircle, Activity } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Rivers() {
  const { rivers } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ocean-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-accent-blue/30">
           <div>
              <button className="text-accent-blue/60 mb-2 hover:text-white" onClick={() => navigate('/admin/dashboard')}>← Back to Command Center</button>
              <h1 className="text-4xl font-extrabold flex items-center gap-3">
                 <Droplets className="text-accent-teal" size={36} /> River Topology Logic
              </h1>
              <p className="text-xl text-accent-blue/70 mt-2">Manage GeoJSON flow parameters</p>
           </div>
           
           <button className="bg-ocean-800 border-2 border-accent-teal text-white py-3 px-6 font-bold rounded-xl flex items-center gap-2 hover:bg-ocean-700 transition shadow-lg shadow-accent-teal/20" onClick={() => alert("Simulating drawing interface for GeoJSON path!")}>
              <PlusCircle size={20} /> Register New Path
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {rivers.map(river => (
              <motion.div 
                 key={river.id} 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-ocean-800 border border-accent-blue/20 rounded-3xl p-6 relative overflow-hidden flex flex-col"
              >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 rounded-full blur-[40px]" />
                  
                  <div className="flex justify-between mb-4 z-10">
                     <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-teal">{river.name}</h2>
                     <span className={`px-4 py-1 rounded-full text-xs font-bold font-mono tracking-widest ${river.pollutionLevel === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'}`}>
                        {river.pollutionLevel}
                     </span>
                  </div>

                  <div className="z-10 bg-ocean-900 rounded-xl p-4 flex justify-between items-center mb-6">
                     <span className="text-gray-400">Measured Length:</span>
                     <span className="font-mono font-bold text-accent-blue">{river.length}</span>
                  </div>

                  <div className="flex gap-4 z-10 mt-auto">
                     <button className="flex-1 bg-accent-blue/10 hover:bg-accent-blue/30 border border-accent-blue/50 py-3 rounded-lg flex items-center justify-center gap-2 transition" onClick={() => alert("GeoJSON path loaded into logic simulator.")}>
                        <Edit size={16} /> Edit River Flow
                     </button>
                     <button className="flex-1 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 py-3 rounded-lg flex items-center justify-center gap-2 transition" onClick={() => alert("Adding strict hotspot marker at cursor!")}>
                        <MapPin size={16} /> Add Hotspot
                     </button>
                  </div>
              </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}
