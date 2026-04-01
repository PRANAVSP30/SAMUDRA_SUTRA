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

// User Pages
import UserDashboard from './pages/user/Dashboard';
import UserReport from './pages/user/Report';
import UserTasks from './pages/user/Tasks';
import UserRewards from './pages/user/Rewards';

// Company Pages
import CompanyDashboard from './pages/company/Dashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-ocean-900 text-white font-sans overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin (Government) */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/rivers" element={<Rivers />} />
            <Route path="/admin/reports" element={<AdminReports />} />

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
