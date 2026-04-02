import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Marketing Home
import Home from './pages/Home';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Rivers from './pages/admin/Rivers';
import AdminReports from './pages/admin/Reports';
import AdminAlerts from './pages/admin/Alerts';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import UserReport from './pages/user/Report';
import UserTasks from './pages/user/Tasks';
import UserRewards from './pages/user/Rewards';

// Company Pages
import CompanyDashboard from './pages/company/Dashboard';

import { AppContext } from './context/AppContext';
import { AlertOctagon } from 'lucide-react';

const GlobalSOSListener = () => {
   const { alerts } = React.useContext(AppContext);
   // Check if any active alert is a GLOBAL_SMS (usually very recent)
   const activeSos = (alerts || []).find(a => a.type === 'GLOBAL_SMS');
   
   if (!activeSos) return null;

   return (
      <div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center p-6 bg-red-900/40 backdrop-blur-sm animate-pulse">
         <div className="bg-red-600 border-4 border-red-400 text-white p-8 rounded-3xl max-w-2xl w-full text-center shadow-[0_0_100px_rgba(239,68,68,0.8)]">
            <AlertOctagon size={80} className="mx-auto mb-6 animate-bounce" />
            <h1 className="text-4xl font-black tracking-widest uppercase mb-4">{activeSos.title}</h1>
            <p className="text-xl font-bold font-mono opacity-90">{activeSos.desc}</p>
            <div className="mt-8 bg-black/30 p-4 rounded-xl text-sm font-mono text-red-200">
               TARGET ZONE: {activeSos.address} <br/> 
               Broadcast Time: {activeSos.timestamp?.toDate ? activeSos.timestamp.toDate().toLocaleTimeString() : 'NOW'}
            </div>
         </div>
      </div>
   );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-ocean-900 text-white font-sans overflow-x-hidden relative">
          <GlobalSOSListener />
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin (Government) */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/rivers" element={<Rivers />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/alerts" element={<AdminAlerts />} />

            {/* User (Citizen + Volunteer) */}
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/report" element={<UserReport />} />
            <Route path="/user/tasks" element={<UserTasks />} />
            <Route path="/user/rewards" element={<UserRewards />} />

            {/* Company */}
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            
            {/* Fallback for old /user/home */}
            <Route path="/user/home" element={<Navigate to="/user/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
