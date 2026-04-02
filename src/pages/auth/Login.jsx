import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { signInWithEmailAndPassword, signInWithPopup, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    
    // DEMO SANDBOX BYPASS: Hardcoded Government & Company Logins
    if (email.trim() === 'admin@samudra.gov' && password.trim() === 'admin123') {
       setUser({ email: email.trim(), role: 'Admin', name: 'Authority Node', uid: 'admin_123_bypass' });
       navigate('/admin/dashboard');
       return;
    }
    if (email.trim() === 'partner@samudra.com' && password.trim() === 'company123') {
       setUser({ email: email.trim(), role: 'Company', name: 'Corporate Partner', uid: 'company_123_bypass' });
       navigate('/company/dashboard');
       return;
    }

    try {
      // Force persistence rule based on checkbox
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Firebase login successful!
      if(email.includes('admin')) {
        setUser({ email, role: 'Admin', name: 'Commander', uid: userCredential.user.uid });
        navigate('/admin/dashboard');
      } else if (email.includes('partner') || email.includes('company')) {
        setUser({ email, role: 'Company', name: 'Corporate Partner', uid: userCredential.user.uid });
        navigate('/company/dashboard');
      } else {
        setUser({ email, role: 'User', name: email.split('@')[0], uid: userCredential.user.uid });
        navigate('/user/dashboard');
      }
    } catch (error) {
       console.error(error);
       if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          setErrorMsg("Incorrect password. Please re-enter.");
       } else if (error.code === 'auth/user-not-found') {
          setErrorMsg("No account found with this email.");
       } else if (error.code === 'auth/operation-not-allowed') {
          setErrorMsg("Error: Please enable 'Email/Password' in your Firebase Console -> Authentication settings.");
       } else {
          setErrorMsg("Login failed: " + error.message);
       }
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      setUser({ email: result.user.email, role: 'User', name: result.user.displayName, uid: result.user.uid });
      navigate('/user/dashboard');
    } catch (error) {
      console.error(error);
      setErrorMsg("Google Sign-In failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-root border-t-4 border-accent-blue font-sans relative overflow-hidden">
      
      {/* Background flare */}
      <div className="absolute w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[100px] -top-32 -left-32 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="z-10 bg-panel border border-subtle rounded-3xl p-10 w-full max-w-md shadow-2xl backdrop-blur-md"
      >
        <div className="text-center mb-10">
          <Shield size={48} className="mx-auto text-accent-blue mb-6" />
          <h2 className="text-4xl font-black text-primary tracking-tight">Welcome Back</h2>
          <p className="text-muted mt-2 font-medium">Log in to SUTRA Network</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {errorMsg && (
             <div className="bg-red-500/20 border-l-4 border-red-500 font-bold p-3 text-red-500 text-sm mb-4 rounded-r-lg">
                <AlertCircle size={16} className="inline mr-2" />
                {errorMsg}
             </div>
          )}

          <div>
            <label className="block text-muted mb-2 text-sm font-bold uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-muted-dark" size={20} />
              <input 
                type="email" 
                required
                className="w-full bg-root/50 border border-subtle rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue text-primary transition-all shadow-inner" 
                placeholder="citizen@india.gov"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
               <label className="block text-muted text-sm font-bold uppercase tracking-wider">Password</label>
               <button type="button" onClick={() => alert("Password reset link sent to email!")} className="text-accent-blue text-xs font-bold hover:underline">Forgot Password?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-muted-dark" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                required 
                className="w-full bg-root/50 border border-subtle rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue text-primary transition-all shadow-inner" 
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-muted hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
             <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted">
                <input 
                   type="checkbox" 
                   checked={rememberMe}
                   onChange={(e) => setRememberMe(e.target.checked)}
                   className="w-4 h-4 rounded bg-root border-white/20 text-accent-blue focus:ring-accent-blue"
                />
                Keep me logged in
             </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-ocean-900 font-extrabold py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-gray-200 transition-all shadow-lg"
          >
            <LogIn size={20} /> Log In
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
           <div className="h-px bg-white/10 flex-1" />
           <span className="text-muted-dark text-sm font-bold uppercase tracking-widest">OR</span>
           <div className="h-px bg-white/10 flex-1" />
        </div>

        <button 
           onClick={handleGoogleAuth}
           className="w-full bg-white/5 border border-subtle hover:bg-white/10 text-primary font-bold py-4 rounded-2xl flex justify-center items-center gap-3 transition-all"
        >
           <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
           </svg>
           Login with Google
        </button>

        <p className="text-center mt-8 text-muted font-medium">
          Don't have an account? <span className="text-primary font-bold cursor-pointer hover:underline" onClick={() => navigate('/register')}>Sign Up</span>
        </p>
      </motion.div>
    </div>
  );
}