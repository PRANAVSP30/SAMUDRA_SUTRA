import React, { useState, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Upload, AlertTriangle, CheckCircle2, ChevronLeft, RefreshCcw, XCircle, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

// Google Gemini API Engine
import { GoogleGenerativeAI } from '@google/generative-ai';

// Live API Key strictly for Hackathon Demo
const GEMINI_API_KEY = "AIzaSyANlfNODB14tvZN7fnRe7cH4F7QMcsdcZ4";

export default function UserReport() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("Resolving Satellite Address...");
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImg, setCapturedImg] = useState(null);
  
  // AI States
  const [isProcessing, setIsProcessing] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [isWasteValidated, setIsWasteValidated] = useState(false);
  const [isFraud, setIsFraud] = useState(false);
  const [creditsAwarded, setCreditsAwarded] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const { user, addReport, credits, setCredits } = useContext(AppContext);
  const navigate = useNavigate();

  const openCamera = async () => {
    try {
      let stream;
      try {
         stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      } catch (e) {
         stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      streamRef.current = stream;
      setCameraActive(true);

      setTimeout(() => {
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.setAttribute("playsinline", true);
              videoRef.current.onloadedmetadata = () => {
                  videoRef.current.play().catch(e => console.error(e));
              };
          }
      }, 100);

    } catch (err) {
      alert("Camera access denied! Please ensure HTTPS or localhost.");
      console.error(err);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    
    // NATIVE DOWN-COMPRESSION ALGORITHM for ultra-fast Cloud AI beaming
    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 600;
    const scale = MAX_WIDTH / videoRef.current.videoWidth;
    
    canvas.width = MAX_WIDTH;
    canvas.height = videoRef.current.videoHeight * scale;
    
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Compress logic: 0.7 quality JPEG
    const imgData = canvas.toDataURL('image/jpeg', 0.7);
    
    setCapturedImg(imgData);
    closeCamera();
    setStep(2); // Move to GPS
  };

  const handleLocation = () => {
    setStep(3); // Move to UI while fetching
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });

        // OPENSTREETMAP REVERSE GEOCODING
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(res => res.json())
          .then(data => {
              let shortForm = data.display_name.split(',').splice(0,2).join(',');
              if(data.address?.suburb) shortForm = data.address.suburb + ", " + data.address.city;
              setLocationName(shortForm || "Unknown Street Location");
          }).catch(err => {
              setLocationName("Remote coordinates captured.");
          });

      }, (error) => {
        setLocation({ lat: 19.123, lng: 72.843 });
        setLocationName("Default Mumbai Dev Zone");
      });
    } else {
      setLocation({ lat: 19.123, lng: 72.843 });
      setLocationName("Default Mumbai Dev Zone");
    }
  };

  const runAIVerify = async () => {
    if(!capturedImg) return;
    setStep(4); // Loading state
    setIsProcessing(true);
    
    try {
       const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
       const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

       const base64Data = capturedImg.split(',')[1];
       
       const prompt = `You are a strict Anti-Fraud Security AI and Pollution Identifier. Analyze this image.
1. FORENSIC CHECK: Look very closely. Is this an AI-generated image (e.g. Midjourney aesthetics, unrealistic density, synthetic artifacts)? Or is it a photograph taken of a computer screen (Moiré patterns, visible pixels)? 
2. CONTENT CHECK: Is there valid physical waste, plastic, or litter present?
Respond STRICTLY in valid JSON format exactly like this:
{
  "isFraud": true atau false (Set to true ONLY if it is deeply suspected to be AI-generated or a picture of a screen),
  "isWaste": true atau false,
  "detectedItem": "Detailed description of objects or exactly why you suspect Fraud",
  "confidenceScore": number 1-100
}`;

       const result = await model.generateContent([
          prompt,
          {
             inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
             }
          }
       ]);
       
       const responseText = result.response.text();
       let jsonResult;
       try {
           const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
           jsonResult = JSON.parse(cleanJson);
       } catch (e) {
           console.error("Failed to parse Gemini JSON:", responseText);
           throw new Error("Invalid AI format");
       }

       setIsFraud(jsonResult.isFraud);
       setIsWasteValidated(jsonResult.isWaste);

       if (jsonResult.isFraud) {
          setPredictions([{ className: jsonResult.detectedItem || "Synthetic Fraud Detected", probability: 0.99 }]);
          setCreditsAwarded(0);
       } else if (jsonResult.isWaste) {
          setPredictions([{ className: jsonResult.detectedItem, probability: jsonResult.confidenceScore / 100 }]);
          setCreditsAwarded(Math.floor(jsonResult.confidenceScore / 4)); // 25 credits max
       } else {
          setPredictions([{ className: jsonResult.detectedItem || "Non-waste Environment", probability: 0.99 }]);
       }
       
       setStep(5); // Result state
    } catch(err) {
       console.error("Gemini Vision API Error: ", err);
       alert(`Gemini AI Crash: ${err.message || 'Unknown Network Drop'}`);
       setStep(3);
    } finally {
       setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    // Write directly to cloud database in the background to prevent UI freezing
    addReport({
        lat: location?.lat || 19.111,
        lng: location?.lng || 72.888,
        address: locationName,  
        user: user?.name || "Demo Citizen",
        uid: user?.uid || "anonymous",
        status: "verified", 
        image: "live_capture.jpg",
        imageBase64: capturedImg,
        tags: [predictions[0]?.className ? String(predictions[0].className).substring(0,35) : "AI Verified"],
        creditsEarned: creditsAwarded
    });
    setCredits(credits + creditsAwarded);
    setStep(6);
    setTimeout(() => navigate('/user/dashboard'), 2000);
  };

  return (
    <div className="min-h-screen bg-ocean-900 flex flex-col p-6 font-sans text-white pb-20">
      
      <div className="flex items-center gap-4 mb-8 pt-4">
         <button onClick={() => navigate('/user/dashboard')} className="w-10 h-10 bg-ocean-800 border-2 border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition">
            <ChevronLeft size={20} />
         </button>
         <div>
             <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">Report Generator <BrainCircuit className="text-accent-teal" size={20}/></h1>
             <p className="text-xs text-green-400 font-mono font-bold tracking-widest uppercase">Gemini Vision Connected</p>
         </div>
      </div>

      <div className="flex-1 w-full max-w-lg mx-auto bg-ocean-800/80 rounded-[2.5rem] p-6 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl mb-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Camera className="text-accent-teal" size={24} /> Live Scanner
        </h2>

        {/* STEP 1: CAMERA FEED */}
        {step === 1 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col gap-6">
                <div className="w-full aspect-[3/4] bg-black rounded-3xl overflow-hidden relative border-4 border-ocean-700 shadow-inner flex flex-col items-center justify-center">
                    {!cameraActive ? (
                       <div className="text-center p-6 flex flex-col items-center">
                          <Camera size={48} className="text-gray-600 mb-4" />
                          <p className="text-gray-400 font-bold mb-6 text-sm">Please allow Camera access</p>
                          <button onClick={openCamera} className="bg-white text-ocean-900 font-extrabold px-8 py-3 rounded-2xl shadow-lg transition transform hover:scale-105">
                             Initialize Stream
                          </button>
                       </div>
                    ) : (
                       <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    )}
                </div>

                {cameraActive && (
                  <button onClick={handleCapture} className="bg-gradient-to-r from-accent-blue to-accent-teal text-ocean-900 font-extrabold py-5 rounded-2xl flex justify-center items-center gap-2 transition hover:opacity-90 text-lg shadow-[0_0_20px_rgba(79,172,254,0.3)]">
                     <Upload size={24} /> Capture Frame
                  </button>
                )}
            </motion.div>
        )}

        {/* STEP 2: GPS LOCATOR */}
        {step === 2 && (
            <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="flex flex-col gap-6 items-center">
                <div className="w-full aspect-[3/4] bg-black rounded-3xl overflow-hidden border-4 border-ocean-700 relative">
                   <img src={capturedImg} alt="Captured preview" className="w-full h-full object-cover opacity-80" />
                   <div className="absolute inset-x-4 bottom-4 bg-ocean-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                      <p className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-1">Image Compressed Matrix</p>
                      <button onClick={handleLocation} className="w-full bg-accent-teal/20 hover:bg-accent-teal border border-accent-teal font-extrabold text-white py-3 rounded-xl flex justify-center items-center gap-2 transition mt-2">
                         <MapPin size={18}/> Fetch GPS Signal
                      </button>
                   </div>
                </div>
            </motion.div>
        )}

        {/* STEP 3: PRE-AI VERIFY */}
        {step === 3 && (
            <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="flex flex-col gap-6 items-center">
                <img src={capturedImg} alt="Captured" className="w-32 h-32 object-cover rounded-xl border border-white/20 shadow-xl" />

                <div className="w-full p-6 bg-ocean-900 border-l-4 border-accent-blue rounded-2xl flex flex-col mb-4">
                    <span className="text-xs uppercase font-bold text-gray-500 mb-2">Location Locked</span>
                    <span className="text-sm font-medium text-accent-teal uppercase tracking-widest">{locationName}</span>
                </div>

                <div className="w-full min-h-64 flex flex-col justify-center items-center bg-ocean-800/50 rounded-3xl border border-white/5 p-6 text-center">
                   <AlertTriangle className="text-yellow-500 mb-4" size={48} />
                   <h3 className="text-xl font-bold mb-2">Request Google Validation</h3>
                   <p className="text-xs text-gray-400 mb-8">Gemini 2.5 LVM will synthetically reconstruct the image context and determine if human-generated waste is present.</p>
                   
                   <button onClick={runAIVerify} disabled={isProcessing} className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-500/20 hover:bg-yellow-500/40 border-2 border-yellow-500 text-yellow-500 font-black py-4 rounded-xl flex justify-center items-center gap-2 transition shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                      <RefreshCcw size={20} className={isProcessing ? "animate-spin" : ""} /> {isProcessing ? "Analyzing Environment..." : "Run Gemini Vision Scan"}
                   </button>
                </div>
            </motion.div>
        )}

        {/* STEP 4: AI LOADING */}
        {step === 4 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col gap-4 items-center justify-center min-h-[400px]">
                <div className="w-32 h-32 border-[6px] border-ocean-700 border-t-yellow-400 rounded-full animate-spin shadow-[0_0_40px_rgba(250,204,21,0.2)]" />
                <p className="text-xl font-black mt-8 text-yellow-400 tracking-wider">Gemini Forensic Scan...</p>
                <p className="text-sm text-gray-500 font-mono">Checking for Synthetic Deepfakes</p>
            </motion.div>
        )}

        {/* STEP 5: REAL AI RESULT */}
        {step === 5 && (
            <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="flex flex-col gap-6 items-center text-center">
                
                <div className={`border-2 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl mb-2 mt-4 ${
                     isFraud ? 'bg-red-500/10 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' :
                     isWasteValidated ? 'bg-green-500/10 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-red-500/10 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                }`}>
                    {isFraud ? <AlertTriangle size={40} className="text-red-500" /> : isWasteValidated ? <CheckCircle2 size={40} className="text-green-400" /> : <XCircle size={40} className="text-red-400" />}
                </div>
                
                <h3 className={`text-3xl font-black tracking-tight ${isFraud ? 'text-red-500' : isWasteValidated ? 'text-green-400' : 'text-red-400'}`}>
                    {isFraud ? "Fraud Detected 🛑" : isWasteValidated ? "Waste Verified ✅" : "No Waste Detected ❌"}
                </h3>
                
                <div className="w-full text-left bg-black/50 p-5 rounded-xl border border-white/10 font-mono text-sm mt-2 relative overflow-hidden group">
                   <div className={`absolute top-0 right-0 px-2 py-1 text-[10px] uppercase font-bold tracking-widest ${isFraud ? 'bg-red-500/20 text-red-500' : 'bg-yellow-400/20 text-yellow-400'}`}>
                      {isFraud ? 'FORENSIC AUDIT FAILED' : 'GEMINI VLM OUTPUT'}
                   </div>
                   <ul className="space-y-3 mt-4">
                      {predictions.map((p, i) => (
                         <li key={i} className="flex flex-col gap-1 border-b border-white/5 pb-2">
                            <span className="text-gray-300 font-bold">{p.className}</span>
                            <span className={isFraud ? "text-red-500 text-xs font-bold uppercase" : isWasteValidated ? "text-green-400 text-xs font-bold" : "text-red-400 text-xs font-bold"}>
                               {isFraud ? 'Integrity Compromised' : `Confidence: ${(p.probability * 100).toFixed(0)}%`}
                            </span>
                         </li>
                      ))}
                   </ul>
                </div>
                
                {isFraud ? (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 w-full flex flex-col items-center mt-2">
                       <span className="text-sm font-extrabold text-red-500 tracking-widest mb-1 uppercase">Anti-Fraud Violation</span>
                       <span className="text-lg font-bold text-white text-center">Synthetic or Screen AI Image</span>
                       <p className="text-xs text-gray-400 mt-2">Impact Credits Blocked Permanently</p>
                    </div>
                ) : isWasteValidated ? (
                    <>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 w-full flex flex-col items-center mt-2">
                           <span className="text-xs uppercase font-extrabold text-yellow-500 tracking-widest mb-1">Impact Credits</span>
                           <span className="text-4xl font-black text-white">+{creditsAwarded} CR</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Auto-Approved by Gemini AI</p>
                        <button onClick={handleSubmit} className="w-full bg-green-500 hover:bg-green-400 text-ocean-900 font-extrabold py-5 rounded-2xl flex justify-center items-center gap-2 transition transform hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                           Broadcast Globally
                        </button>
                    </>
                ) : (
                    <button onClick={() => setStep(1)} className="w-full bg-ocean-800 border-2 border-white/20 hover:bg-white/10 text-white font-extrabold py-5 rounded-2xl flex justify-center items-center gap-2 transition mt-4">
                       Recapture
                    </button>
                )}

            </motion.div>
        )}

        {/* STEP 6: DONE */}
        {step === 6 && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <CheckCircle2 size={64} className="text-green-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold">Injected to Global Database!</h3>
                <p className="text-gray-400 mt-2">All connected users will see it instantly.</p>
             </motion.div>
        )}
      </div>
    </div>
  );
}
