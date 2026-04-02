import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Leaf, ListOrdered, ArrowLeft } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function UserRewards() {
  const { credits, reports } = useContext(AppContext);
  const navigate = useNavigate();

  // Metrics
  const uploadedCount = reports.filter(r => r.status !== 'fake').length;
  
  // Fake Leaderboard for demo
  const leaderboard = [
    { name: 'Rahul M.', points: 1450, rank: 1 },
    { name: 'Aditi K.', points: 1200, rank: 2 },
    { name: 'Demo Citizen', points: credits, rank: 3 }, // User fake rank
    { name: 'Sneha P.', points: 950, rank: 4 },
  ].sort((a,b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-root p-6 md:p-12 text-primary font-sans relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center gap-4 mb-12 relative z-10">
           <button onClick={() => navigate('/user/dashboard')} className="w-10 h-10 bg-panel border-2 border-subtle rounded-full flex items-center justify-center hover:bg-white/10 transition">
              <ArrowLeft size={20} />
           </button>
           <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Rewards & Impact</h1>
        </div>

        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-8">
            
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Credit Balance Card */}
                <motion.div 
                   whileHover={{ scale: 1.02 }}
                   className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border border-yellow-500/30 p-8 rounded-[2rem] shadow-xl relative overflow-hidden"
                >
                   <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/20 rounded-full blur-[40px] pointer-events-none" />
                   <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Award size={16} /> Total Credits Available
                   </p>
                   <h2 className="text-6xl font-black text-primary mt-4">{credits} <span className="text-2xl text-yellow-500">CR</span></h2>
                   <button className="mt-8 bg-yellow-500 hover:bg-yellow-400 text-ocean-900 font-extrabold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition w-full shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                       Redeem Store
                   </button>
                </motion.div>

                {/* Impact Card */}
                <motion.div 
                   whileHover={{ scale: 1.02 }}
                   className="bg-panel border border-subtle p-8 rounded-[2rem] shadow-xl flex flex-col justify-center"
                >
                   <p className="text-muted text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Leaf size={16} className="text-green-400" /> Lifelong Impact
                   </p>
                   <h2 className="text-4xl font-black text-primary mt-4 flex items-baseline gap-2">
                      {uploadedCount} <span className="text-xl text-muted-dark font-bold uppercase tracking-[0.2em]">Verified Uploads</span>
                   </h2>
                   
                   <div className="mt-6 flex flex-col gap-2">
                      <div className="flex justify-between text-sm font-bold">
                         <span className="text-muted">Next Rank Progress</span>
                         <span className="text-accent-blue">70%</span>
                      </div>
                      <div className="w-full h-3 bg-root rounded-full overflow-hidden border border-subtle">
                         <div className="h-full bg-gradient-to-r from-accent-blue to-accent-teal w-[70%]" />
                      </div>
                   </div>
                </motion.div>
            </div>

            {/* Leaderboard Section */}
            <div className="bg-panel/50 backdrop-blur-xl border border-subtle rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
                     <ListOrdered className="text-indigo-400" size={24} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-primary tracking-tight">Global Leaderboard</h3>
                      <p className="text-sm font-medium text-muted">Top contributors in your region this week.</p>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   {leaderboard.map((u, i) => (
                      <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${u.name === 'Demo Citizen' ? 'bg-accent-blue/10 border-accent-blue/30' : 'bg-root/50 border-subtle'}`}>
                          <div className="flex items-center gap-4">
                             <span className={`w-8 h-8 flex items-center justify-center font-black rounded-full text-sm ${i === 0 ? 'bg-yellow-500 text-ocean-900 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : i === 1 ? 'bg-gray-300 text-ocean-900' : i === 2 ? 'bg-orange-400 text-ocean-900' : 'bg-card text-muted'}`}>
                                #{i + 1}
                             </span>
                             <div className="font-bold flex items-center gap-2">
                                {u.name} {u.name === 'Demo Citizen' && <span className="text-[10px] bg-accent-blue text-ocean-900 px-2 py-0.5 rounded-full uppercase tracking-widest">You</span>}
                             </div>
                          </div>
                          <div className="font-black font-mono text-xl text-yellow-500 flex items-center">
                             {u.points} <span className="text-xs ml-1 text-muted-dark">PTS</span>
                          </div>
                      </div>
                   ))}
                </div>
            </div>

        </div>
    </div>
  );
}