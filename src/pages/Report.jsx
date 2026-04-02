import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { runAIModel, addReport } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Report() {
  const [step, setStep] = useState(1);
  const [imageValid, setImageValid] = useState(false);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  const handleCapture = async () => {
    // Mocking file upload and AI
    const file = { name: 'plastic_waste.png' }; 
    const res = await runAIModel(file);
    if(res.isValid) {
      setImageValid(true);
      setStep(2);
    }
  };

  const handleLocation = () => {
    // For demo purposes, returning a mock spot near the river
    setLocation({ lat: 19.123, lng: 72.843 });
    setStep(3);
  };

  const handleSubmit = () => {
    addReport({
        lat: location.lat,
        lng: location.lng,
        citizen: "Demo Citizen",
        status: "pending",
        timestamp: Date.now()
    });
    setStep(4);
    setTimeout(() => navigate('/'), 3000);
  };

  return (
    <div className="min-h-screen bg-root flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-panel rounded-3xl p-8 border border-accent-blue/30 glow-effect relative overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-8 flex justify-center items-center gap-2">
            <AlertTriangle className="text-yellow-400" /> Report Hazard
        </h2>

        {step === 1 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col gap-6">
                <div className="h-64 bg-root border-2 border-dashed border-accent-blue/50 rounded-2xl flex flex-col items-center justify-center">
                    <Camera size={48} className="text-accent-blue/40 mb-4" />
                    <p className="text-accent-blue/60 text-center px-4">Camera Feed Active</p>
                </div>
                <button onClick={handleCapture} className="bg-accent-blue/20 hover:bg-accent-blue border border-accent-blue font-bold text-primary py-4 rounded-xl flex justify-center items-center transition">
                   <Upload className="mr-2"/> Capture Image
                </button>
            </motion.div>
        )}

        {step === 2 && (
            <motion.div initial={{x:100, opacity:0}} animate={{x:0, opacity:1}} className="flex flex-col gap-6 items-center">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 text-green-400">
                    <CheckCircle2 size={48} />
                </div>
                <p className="text-center text-lg">AI Verification Complete: <span className="font-bold text-green-400">Waste Detected</span></p>
                
                <button onClick={handleLocation} className="w-full bg-accent-teal/20 hover:bg-accent-teal border border-accent-teal font-bold text-primary py-4 rounded-xl flex justify-center items-center transition mt-8">
                   <MapPin className="mr-2"/> Tag Location
                </button>
            </motion.div>
        )}

        {step === 3 && (
            <motion.div initial={{x:-100, opacity:0}} animate={{x:0, opacity:1}} className="flex flex-col gap-6 items-center">
                <div className="w-full p-6 bg-root rounded-2xl border border-subtle">
                    <p className="text-accent-blue mb-2">GPS Coordinates Acquired:</p>
                    <p className="font-mono text-xl">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                </div>
                
                <button onClick={handleSubmit} className="w-full bg-green-600/50 hover:bg-green-500 border border-green-400 font-bold text-primary py-4 rounded-xl flex justify-center items-center transition mt-4 animate-pulse">
                   Submit to Network
                </button>
            </motion.div>
        )}

        {step === 4 && (
             <motion.div initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} className="text-center py-10">
                <CheckCircle2 size={64} className="text-green-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold">Report Submitted!</h3>
                <p className="text-accent-blue/70 mt-2">Redirecting to home...</p>
             </motion.div>
        )}

      </div>
    </div>
  );
}