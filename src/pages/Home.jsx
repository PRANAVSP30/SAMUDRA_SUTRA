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
            <button onClick={() => navigate('/register')} className="bg-white text-ocean-900 px-8 py-4 rounded-full font-extrabold text-lg hover:scale-105 transition shadow-[0_0_30px_rgba(79,172,254,0.3)] flex items-center justify-center gap-2">
               Get Started <ArrowRight size={20} />
            </button>
            <button onClick={() => navigate('/login')} className="bg-white/5 border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-full font-extrabold text-lg transition flex items-center justify-center">
               Login to Node
            </button>
         </motion.div>
      </header>

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
