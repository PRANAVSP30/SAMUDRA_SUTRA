import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name natively in Firebase Auth
      await updateProfile(userCredential.user, { displayName: name });
      
      alert("Firebase Account Created Successfully. You may now log in.");
      navigate('/login');
    } catch (error) {
       console.error(error);
       if (error.code === 'auth/email-already-in-use') {
         setErrorMsg("This email is already registered.");
       } else if (error.code === 'auth/weak-password') {
         setErrorMsg("Password should be at least 6 characters.");
       } else if (error.code === 'auth/operation-not-allowed') {
         setErrorMsg("Error: Please enable 'Email/Password' in your Firebase Console -> Authentication settings.");
       } else {
         setErrorMsg(error.message);
       }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-ocean-900 border-t-4 border-accent-teal font-sans relative overflow-hidden">
      <div className="absolute w-[800px] h-[800px] bg-accent-teal/5 rounded-full blur-[100px] -bottom-32 -right-32 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="z-10 bg-ocean-800 border border-white/10 rounded-3xl p-10 w-full max-w-md shadow-2xl backdrop-blur-md"
      >
        <div className="text-center mb-10">
          <Shield size={48} className="mx-auto text-white mb-6" />
          <h2 className="text-4xl font-black text-white tracking-tight">Join Network</h2>
          <p className="text-gray-400 mt-2 font-medium">Register your node identity</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
           {errorMsg && (
             <div className="bg-red-500/20 border-l-4 border-red-500 font-bold p-3 text-red-500 text-sm mb-4 rounded-r-lg">
                <AlertCircle size={16} className="inline mr-2" />
                {errorMsg}
             </div>
           )}

           <div>
            <label className="block text-gray-400 mb-2 text-sm font-bold uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-500" size={20} />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-ocean-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all shadow-inner" placeholder="Ravi Kumar" />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm font-bold uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-500" size={20} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-ocean-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all shadow-inner" placeholder="ravi@email.com" />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2 text-sm font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-500" size={20} />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-ocean-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all shadow-inner" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
             <label className="block text-gray-400 mb-2 text-sm font-bold uppercase tracking-wider">Confirm Password</label>
             <div className="relative">
               <Lock className="absolute left-4 top-4 text-gray-500" size={20} />
               <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-ocean-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all shadow-inner" placeholder="••••••••" />
             </div>
           </div>

          <button type="submit" className="w-full bg-white text-ocean-900 font-extrabold py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-gray-200 transition-all shadow-lg mt-8">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-8 text-gray-400 font-medium">
          Already synced? <span className="text-white font-bold cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login</span>
        </p>
      </motion.div>
    </div>
  );
}
