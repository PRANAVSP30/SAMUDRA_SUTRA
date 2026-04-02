import React, { createContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current logged in user (Bound to true Firebase Auth)
  const [user, setUser] = useState(null);

  // Global Reports feed (Bound to Firestore)
  const [reports, setReports] = useState([]);
  
  // Global Alerts feed (Task Forces)
  const [alerts, setAlerts] = useState([]);

  // Points and Credits
  const [credits, setCredits] = useState(120);

  // GeoJSON Rivers Data Stub (simulated river paths)
  const [rivers, setRivers] = useState([
    { id: 'r1', name: 'Ganga', length: '2525 km', pollutionLevel: 'High' },
    { id: 'r2', name: 'Yamuna', length: '1376 km', pollutionLevel: 'Critical' }
  ]);

  // Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
       if (firebaseUser) {
          // Identify role strictly by checking if "admin" is inside email, just for hackathon ease
          const isGov = firebaseUser.email?.includes('admin');
          setUser({ 
             email: firebaseUser.email, 
             role: isGov ? 'Admin' : 'User', 
             name: firebaseUser.displayName || firebaseUser.email.split('@')[0], 
             uid: firebaseUser.uid 
          });
       } else {
          setUser(null);
       }
    });
    return () => unsub();
  }, []);

  // Global Sync Engine for Reports Stream
  useEffect(() => {
    // We strictly remove orderBy to bypass missing Google Compound Index crashes across phones
    const q = query(collection(db, 'reports')); 
    const unsubReports = onSnapshot(q, (snapshot) => {
       const realtimeData = [];
       snapshot.forEach((doc) => {
           const data = doc.data();
           realtimeData.push({ 
               id: doc.id, 
               ...data,
               _time: data.timestamp?.toMillis?.() || Date.now() 
           });
       });
       // Sort natively on device (Descending)
       realtimeData.sort((a, b) => b._time - a._time);
       setReports(realtimeData);
    }, (error) => {
       console.error("Critical Cloud Sync Error:", error);
    });

    return () => unsubReports();
  }, []);

  // Global Sync Engine for Alerts (Tasks) Stream
  useEffect(() => {
    const qAlerts = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'));
    const unsubAlerts = onSnapshot(qAlerts, (snapshot) => {
       const rtAlerts = [];
       snapshot.forEach((doc) => {
           rtAlerts.push({ id: doc.id, ...doc.data() });
       });
       setAlerts(rtAlerts);
    });

    return () => unsubAlerts();
  }, []);

  // Theme Settings
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
       document.documentElement.classList.add('light-mode');
    } else {
       document.documentElement.classList.remove('light-mode');
    }
  }, [theme]);

  // Write directly to cloud database
  const addReport = async (report) => {
    try {
       await addDoc(collection(db, 'reports'), {
          ...report,
          timestamp: serverTimestamp() // Enforce global atomic time
       });
    } catch (e) {
       console.error("Failed to inject to Cloud DB:", e);
    }
  };

  const updateReportStatus = async (id, status, extraData = {}) => {
    try {
       const ref = doc(db, 'reports', id);
       await updateDoc(ref, { status, ...extraData });
    } catch (e) {
       console.error("Failed to update Cloud DB:", e);
    }
  };

  const deleteReport = async (id) => {
    try {
       const ref = doc(db, 'reports', id);
       await deleteDoc(ref);
    } catch(e) {
       console.error("Failed to delete from Cloud DB:", e);
    }
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <AppContext.Provider value={{
      user, setUser,
      reports, setReports, addReport, updateReportStatus, deleteReport,
      alerts, setAlerts,
      credits, setCredits,
      rivers, setRivers,
      theme, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};
