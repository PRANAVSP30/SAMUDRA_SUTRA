import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Award, CheckCircle2, Clock } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

export default function UserDashboard() {
  const { user, reports, credits } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-root text-primary font-sans">
      
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-root/80 border-b border-subtle py-4 px-6 md:px-12 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-blue to-accent-teal flex items-center justify-center font-black text-ocean-900 text-lg shadow-[0_0_15px_rgba(79,172,254,0.4)]">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
             </div>
             <div>
                <h1 className="text-lg font-bold">Welcome, {user?.name || 'Citizen'}</h1>
                <p className="text-xs text-green-400 font-mono flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> SYNCED</p>
             </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end cursor-pointer group" onClick={() => navigate('/user/rewards')}>
               <span className="text-2xl font-black text-yellow-400 group-hover:scale-105 transition-transform">{credits} <span className="text-sm">PTS</span></span>
               <span className="text-[10px] text-muted uppercase tracking-widest font-bold">Balance</span>
            </div>
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-muted hover:text-primary transition">Log Out</button>
         </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-8 pb-32">
         
         {/* Action Bar */}
         <div className="flex gap-4">
             <button 
                onClick={() => navigate('/user/report')}
                className="flex-1 bg-white hover:bg-gray-100 text-ocean-900 py-4 rounded-3xl font-black text-lg flex justify-center items-center gap-3 transition-transform shadow-[0_10px_30px_-10px_rgba(255,255,255,0.4)] hover:scale-[1.02]"
             >
                <Camera size={24} /> Report Waste
             </button>
             <button 
                onClick={() => navigate('/user/rewards')}
                className="md:hidden flex-1 bg-panel border-2 border-yellow-500/30 text-yellow-500 hover:bg-card py-4 rounded-3xl font-black text-lg flex justify-center items-center gap-3 transition-transform hover:scale-[1.02]"
             >
                <Award size={24} /> Rewards
             </button>
         </div>

         {/* Social Feed header */}
         <div className="mt-4 border-b border-subtle pb-4 flex justify-between items-end">
            <h2 className="text-2xl font-black tracking-tight">Community Feed</h2>
            <p className="text-sm text-muted font-medium">Live from the SUTRA Network</p>
         </div>

         {/* Feed List */}
         <div className="flex flex-col gap-6">
            {reports.map((post, i) => (
                <motion.article 
                   key={post.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="bg-panel/40 border border-subtle rounded-[2rem] p-4 md:p-6 backdrop-blur-md shadow-lg"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-card border border-subtle flex items-center justify-center font-bold text-primary text-sm">
                               {post.user?.charAt(0) || 'C'}
                            </div>
                            <div>
                               <p className="font-bold text-md">{post.user}</p>
                               <div className="flex items-center gap-1 text-xs text-muted font-mono mt-0.5">
                                  <Clock size={12} className="text-accent-blue" />
                                  {post.timestamp?.toDate ? post.timestamp.toDate().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'Just now'}
                               </div>
                            </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                               post.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 
                               post.status === 'verified' ? 'bg-accent-teal/10 text-accent-teal border border-accent-teal/30' :
                               'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                           }`}>
                           {post.status === 'completed' ? <CheckCircle2 size={14}/> : <Clock size={14} />} 
                           {post.status}
                        </div>
                    </div>

                    <div className="w-full h-64 md:h-80 bg-deep/40 rounded-3xl mt-4 mb-5 border border-subtle overflow-hidden relative group">
                        {post.imageBase64 ? (
                           <img src={post.imageBase64} className="w-full h-full object-cover" alt="Waste tag" />
                        ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center text-muted-dark">
                             <Camera size={48} className="mb-4 opacity-20" />
                             <p className="font-bold text-sm bg-deep/50 px-4 py-2 rounded-lg">{post.image}</p>
                           </div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-deep/60 backdrop-blur-md px-4 py-2 rounded-xl border border-subtle flex items-center gap-2 max-w-[90%]">
                           <MapPin size={16} className="text-accent-teal shrink-0" /> 
                           <span className="text-primary text-xs md:text-sm font-bold font-mono truncate">{post.address || 'GPS Coordinates Logged'}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center ml-2 mr-2">
                        <div className="flex flex-wrap gap-2">
                            {post.tags?.map(tag => (
                               <span key={tag} className="bg-white/5 text-muted px-3 py-1 rounded-full text-xs font-bold border border-subtle uppercase tracking-wider">#{tag}</span>
                            ))}
                        </div>
                        {post.creditsEarned && (
                           <div className="flex items-center gap-1 font-black text-yellow-400">
                              +{post.creditsEarned} CR
                           </div>
                        )}
                    </div>
                </motion.article>
            ))}

            {reports.length === 0 && (
                <div className="text-center py-20 bg-panel/30 rounded-3xl border border-subtle">
                    <CheckCircle2 size={64} className="mx-auto text-gray-600 mb-4" />
                    <h2 className="text-2xl font-bold text-muted">Feed is empty!</h2>
                    <p className="text-muted-dark mt-2">Be the first to scan and report.</p>
                </div>
            )}
         </div>

      </main>
    </div>
  );
}