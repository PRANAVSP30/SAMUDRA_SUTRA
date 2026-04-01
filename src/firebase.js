// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyBtQ28fMetv-IVnJSmysO3TSV2wbAFryL4",
  authDomain: "samudra-sutra.firebaseapp.com",
  projectId: "samudra-sutra",
  storageBucket: "samudra-sutra.firebasestorage.app",
  messagingSenderId: "83945994435",
  appId: "1:83945994435:web:dbc08a4846ffd0d2aa8a76",
  measurementId: "G-441ZHKKV08"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Mock Data for the feed
let mockReports = [
  { id: '1', status: 'pending', lat: 19.0760, lng: 72.8777, timestamp: Date.now() - 3600000, user: "Aditi", image:"/waste1.webp", tags:['plastic'] },
  { id: '2', status: 'completed', lat: 18.5204, lng: 73.8567, timestamp: Date.now() - 86400000, volunteer: "Ravi", creditsEarned: 10 }
];

export const mockDbStats = { credits: 240, wasteCleaned: 35 };

export const getReports = () => [...mockReports];

export const addReport = (report) => {
  const newReport = { ...report, id: Date.now().toString() };
  mockReports.push(newReport);
  return newReport;
};

export const runAIModel = async (imageFile) => {
  // Simple mock: If file name contains 'waste', accept it.
  return new Promise((resolve) => {
    setTimeout(() => {
      if (imageFile.name.toLowerCase().includes('waste')) {
        resolve({ isValid: true, tags: ['plastic', 'garbage'] });
      } else {
        // Just accept for demo's sake
        resolve({ isValid: true, tags: ['waste-detected'] });
      }
    }, 1500);
  });
};
