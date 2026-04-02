import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, BrainCircuit, Map, Award, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ocean-900 text-white selection:bg-accent-blue selection:text-ocean-900 font-sans">
      
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 lg:px-12 backdrop-blur-md bg-ocean-900/50 fixed w-full z-50 border-b border-white/5">
         <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-accent-teal flex items-center justify-center">
               <span className="text-ocean-900 text-sm">S</span>
            </div>
            SAMUDRA SUTRA
         </div>
         <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-300">
            <a href="#home" className="hover:text-white transition">Home</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#features" className="hover:text-white transition">Features</a>
         </div>
         <div className="flex gap-4">
            <button onClick={() => navigate('/login')} className="hidden md:block font-bold hover:text-accent-teal transition">Login</button>
            <button onClick={() => navigate('/register')} className="bg-white text-ocean-900 px-6 py-2 rounded-full font-bold hover:scale-105 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">
               Sign Up
            </button>
         </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="relative pt-40 pb-20 px-6 lg:px-12 flex flex-col items-center text-center overflow-hidden">
         {/* Apple-style background flares */}
         <div className="absolute top-0 w-full h-full pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-accent-blue/20 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-accent-teal/10 rounded-full blur-[100px]" />
         </div>

         <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] max-w-5xl z-10"
         >
            Stop Ocean Pollution <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-white to-accent-teal">
               Before It Begins.
            </span>
         </motion.h1>

         <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl z-10 font-medium"
         >
            A real-time platform where citizens report waste, communities act, and oceans stay protected. Seamless intelligence backended by AI.
         </motion.p>

         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 z-10"
         >
            <button onClick={() => navigate('/login')} className="bg-white text-ocean-900 px-8 py-4 rounded-full font-extrabold text-lg hover:scale-105 transition shadow-[0_0_30px_rgba(79,172,254,0.3)] flex items-center justify-center gap-2">
               Get Started (Citizen) <ArrowRight size={20} />
            </button>
            <button onClick={() => navigate('/login')} className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-100 px-8 py-4 rounded-full font-extrabold text-lg transition flex items-center justify-center">
               Admin Login
            </button>
         </motion.div>

         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 z-10 opacity-80 hover:opacity-100 transition duration-300"
         >
            <div onClick={() => alert("Takes user to Google Play Listing")} className="flex items-center gap-3 bg-black/40 border border-white/10 px-6 py-3 rounded-xl cursor-pointer hover:border-accent-blue/50 transition shadow-lg">
               <svg viewBox="0 0 512 512" fill="white" className="w-6 h-6"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
               <div className="text-left text-white"><p className="text-[10px] leading-tight font-medium text-gray-400">GET IT ON</p><p className="font-black text-sm leading-tight tracking-wide">Google Play</p></div>
            </div>
            <div onClick={() => alert("Takes user to iOS App Store")} className="flex items-center gap-3 bg-black/40 border border-white/10 px-6 py-3 rounded-xl cursor-pointer hover:border-accent-blue/50 transition shadow-lg">
               <svg viewBox="0 0 384 512" fill="white" className="w-6 h-6"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
               <div className="text-left text-white"><p className="text-[10px] leading-tight font-medium text-gray-400">Download on the</p><p className="font-black text-sm leading-tight tracking-wide">App Store</p></div>
            </div>
         </motion.div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 px-6 lg:px-12 bg-ocean-800 relative z-10 border-t border-white/5">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                 <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Bridging the Gap Between Citizens and Action.</h2>
                 <p className="text-gray-400 text-lg leading-relaxed mb-6 font-medium">
                    <strong className="text-white">Samudra Sutra</strong> was born from a singular idea: 80% of ocean plastic actually originates from land-based inland river networks. If we can target and clean local municipal drains like the Vrishabhavathi River before they flow outwards, we save the ocean.
                 </p>
                 <p className="text-gray-400 text-lg leading-relaxed font-medium">
                    We've built an interconnected node. Citizens click photos. Gemini 2.5 Flash Autonomous AI validates the pollution. Government Authorities instantly receive the telemetry coordinates. Corporate partners sponsor the cleanup points. It's a closed-loop intelligence ecosystem for ultimate marine preservation.
                 </p>
              </div>
              <div className="flex-1 w-full bg-[#0E131F] p-8 rounded-3xl border border-[#1C2536] shadow-2xl relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue to-accent-teal rounded-t-3xl" />
                  <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center font-bold">1</div>
                         <h3 className="font-bold text-white uppercase tracking-widest text-sm">Citizen Intel Network</h3>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center font-bold">2</div>
                         <h3 className="font-bold text-white uppercase tracking-widest text-sm">Government Auth Dashboard</h3>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl flex items-center justify-center font-bold">3</div>
                         <h3 className="font-bold text-white uppercase tracking-widest text-sm">Corporate Sponsoring</h3>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-12 bg-white/5 border-t border-white/5">
         <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Unprecedented Verification</h2>
                 <p className="text-gray-400 text-lg">Next-gen tracking architecture for a cleaner tomorrow.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                    { icon: Camera, title: "Real-time Reporting", desc: "Instantly capture and lock-in pollution sources directly via your browser's native camera." },
                    { icon: BrainCircuit, title: "AI-Based Detection", desc: "Teachable Machine neural networks instantly parse and verify whether an image contains actionable waste." },
                    { icon: Map, title: "Live Pollution Map", desc: "Data is beamed instantly to our centralized Government UI for immediate situational awareness." },
                    { icon: Award, title: "Earn Rewards", desc: "Accumulate certified points directly exchanged for transit passes and impact credits." }
                 ].map((feature, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -10 }}
                        className="bg-ocean-800/50 border border-white/10 p-8 rounded-3xl hover:border-accent-blue/50 transition-colors backdrop-blur-md"
                    >
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                           <feature.icon className="text-accent-teal" size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                    </motion.div>
                 ))}
             </div>
         </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 lg:px-12 bg-ocean-900 border-t border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16">How It Works</h2>
              
              <div className="flex flex-col md:flex-row gap-8 w-full justify-between relative">
                 <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-accent-blue/10 via-accent-teal/40 to-accent-blue/10 -translate-y-1/2 z-0" />
                 
                 {["Capture Waste", "AI Verifies", "Uploads Stream", "Earn Credits"].map((step, i) => (
                    <div key={i} className="flex flex-col items-center z-10 relative">
                        <div className="w-16 h-16 bg-ocean-900 border-2 border-accent-blue rounded-full flex items-center justify-center text-2xl font-black mb-4 shadow-[0_0_20px_rgba(79,172,254,0.4)]">
                           {i + 1}
                        </div>
                        <h4 className="font-bold text-lg">{step}</h4>
                    </div>
                 ))}
              </div>
          </div>
      </section>

       {/* Footer */}
       <footer className="py-12 border-t border-white/10 px-6 lg:px-12 text-center text-gray-500 text-sm bg-black/20">
          <div className="flex justify-center gap-6 mb-6">
             <a href="#" className="hover:text-white transition">Contact</a>
             <a href="#" className="hover:text-white transition">About</a>
             <a href="#" className="hover:text-white transition">Privacy Policy</a>
          </div>
          <p>© 2026 Samudra Sutra. All rights explicitly reserved.</p>
       </footer>
    </div>
  );
}
