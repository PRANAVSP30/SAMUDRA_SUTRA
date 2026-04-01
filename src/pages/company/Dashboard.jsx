import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Leaf, DollarSign, Target, Briefcase, BarChart2 } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function CompanyDashboard() {
    const { reports, credits } = useContext(AppContext);
    const navigate = useNavigate();

    // Deduce stats dynamically from reports state for demo realism
    const cleanedCount = reports.filter(r => r.status === 'completed').length;
    const impactKG = cleanedCount * 12.5; // Mock multiplier
    const sponsoredCredits = (cleanedCount * 10) + credits;

    const sponsorCleanup = () => {
       alert("Funds Transferred! Ocean credits successfully minted on-chain.");
    };

    return (
        <div className="min-h-screen bg-ocean-900 p-8 text-white relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-5xl mx-auto z-10 relative">
                <div className="flex justify-between items-center mb-12 border-b border-accent-blue/20 pb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-accent-teal">
                           <Leaf className="text-green-400" size={40} /> Corporate ESG Hub
                        </h1>
                        <p className="text-accent-blue/70 mt-2 tracking-wide font-mono text-sm">SPONSOR ID: 894-CX-SUTRA</p>
                    </div>
                     <button className="bg-ocean-800 border border-red-500/30 text-red-400 px-6 py-2 rounded-lg hover:bg-ocean-700 transition" onClick={() => navigate('/login')}>
                        Exit Portal
                     </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div whileHover={{y:-5}} className="bg-ocean-800 flex flex-col justify-center p-8 rounded-3xl border border-accent-blue/30 text-center">
                        <div className="text-6xl font-black mb-2 flex items-center justify-center gap-2">
                            <span className="text-accent-blue">{impactKG.toFixed(1)}</span>
                        </div>
                        <p className="text-accent-blue text-sm uppercase font-bold tracking-widest">Kg Cleared via Sponsors</p>
                    </motion.div>
                    
                    <motion.div whileHover={{y:-5}} className="bg-ocean-800 flex flex-col justify-center p-8 rounded-3xl border border-accent-teal/30 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-green-500/5 z-0" />
                        <div className="text-6xl font-black mb-2 flex items-center justify-center gap-2 z-10">
                            <Leaf className="text-green-500" size={48} />
                            <span className="text-green-400">{sponsoredCredits}</span>
                        </div>
                        <p className="text-accent-teal text-sm uppercase font-bold tracking-widest z-10">Verified Credits Created</p>
                    </motion.div>

                    <motion.div whileHover={{y:-5}} className="bg-ocean-800 flex flex-col justify-center p-8 rounded-3xl border border-yellow-500/30 text-center flex flex-col justify-center">
                         <div className="text-4xl font-black text-yellow-400 flex items-center justify-center mb-2 gap-2">
                            <Target size={36} /> Tier 2
                         </div>
                         <p className="text-yellow-500 text-sm uppercase font-bold tracking-widest">Ocean Guardian Status</p>
                    </motion.div>
                </div>

                <div className="bg-gradient-to-tr from-ocean-800 to-ocean-700 rounded-3xl p-10 border border-green-500/30 flex flex-col md:flex-row items-center justify-between shadow-2xl">
                   <div className="mb-6 md:mb-0">
                      <h2 className="text-3xl font-bold flex items-center gap-3">
                         <Briefcase className="text-accent-teal"/> Direct Task Sponsorship
                      </h2>
                      <p className="text-accent-blue/80 mt-2 max-w-lg leading-relaxed">
                         Turn 1 credit into a verified cleanup task. Your funds go directly to local volunteers on the SUTRA network. All tasks are backed by immutable AI image verification.
                      </p>
                   </div>
                   
                   <motion.button 
                       whileTap={{scale:0.95}}
                       onClick={sponsorCleanup}
                       className="bg-green-500 hover:bg-green-400 transition-all border-none font-black text-ocean-900 px-10 py-5 rounded-2xl flex items-center gap-3 text-xl shadow-[0_0_30px_-5px_#22c55e]"
                   >
                       <DollarSign /> Buy Credits 
                   </motion.button>
                </div>

            </div>
        </div>
    );
}
