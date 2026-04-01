import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, DollarSign, Target, Briefcase } from 'lucide-react';
import { mockDbStats } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Credits() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-ocean-900 p-8 text-white">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-12 border-b border-accent-blue/20 pb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-accent-teal">
                           <Leaf className="text-green-400" size={40} /> Corporate ESG Hub
                        </h1>
                        <p className="text-accent-blue/70 mt-2 tracking-wide">Fund cleanups, earn verified ocean credits.</p>
                    </div>
                     <button className="bg-ocean-800 border border-accent-blue/30 px-6 py-2 rounded-lg hover:bg-ocean-700 transition" onClick={() => navigate('/')}>
                        Exit Portal
                     </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div whileHover={{y:-5}} className="bg-gradient-to-br from-ocean-800 to-ocean-700 p-6 rounded-3xl border border-accent-blue/30 relative overflow-hidden text-center">
                        <div className="text-5xl font-black mb-2 flex items-center justify-center gap-2">
                            <span className="text-accent-teal">{mockDbStats.wasteCleaned}</span>
                        </div>
                        <p className="text-accent-blue text-lg font-medium">Kilograms Cleared</p>
                    </motion.div>
                    
                    <motion.div whileHover={{y:-5}} className="bg-gradient-to-br from-ocean-800 to-ocean-700 p-6 rounded-3xl border border-accent-teal/30 relative overflow-hidden text-center">
                        <div className="text-5xl font-black mb-2 flex items-center justify-center gap-2">
                            <Leaf className="text-green-500" />
                            <span className="text-green-400">{mockDbStats.credits}</span>
                        </div>
                        <p className="text-accent-blue text-lg font-medium">Carbon/Ocean Credits</p>
                    </motion.div>

                    <motion.div whileHover={{y:-5}} className="bg-gradient-to-br from-ocean-800 to-ocean-700 p-6 rounded-3xl border border-yellow-500/30 relative overflow-hidden text-center flex flex-col justify-center">
                         <div className="text-3xl font-black text-yellow-400 flex items-center justify-center mb-1 gap-2">
                            <Target size={28} /> Tier 2
                         </div>
                         <p className="text-yellow-500/80 text-sm">Ocean Guardian Status</p>
                    </motion.div>
                </div>

                <div className="bg-ocean-800 rounded-3xl p-10 border border-accent-blue/20 flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-accent-blue/10">
                   <div className="mb-6 md:mb-0">
                      <h2 className="text-3xl font-bold flex items-center gap-3">
                         <Briefcase className="text-accent-teal"/> Sponsor a Cleanup
                      </h2>
                      <p className="text-accent-blue/60 mt-2 max-w-lg leading-relaxed">
                         Turn 1 credit into a verified cleanup task. Your funds go directly to local volunteers. Immutable proof via smart verification.
                      </p>
                   </div>
                   
                   <motion.button 
                       whileTap={{scale:0.95}}
                       className="bg-accent-teal hover:bg-accent-blue transition-all border-none font-black text-ocean-900 px-10 py-5 rounded-2xl flex items-center gap-3 glow-effect text-xl shadow-lg"
                   >
                       <DollarSign /> Buy Credits (Mock)
                   </motion.button>
                </div>

            </div>
        </div>
    );
}
