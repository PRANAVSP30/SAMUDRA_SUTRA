import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity, Wind, Trash2, BoxSelect, Droplets, BookOpenCheck, Settings, UploadCloud } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

const customIcon = (status) => {
  let color = 'red';
  if (status === 'in-progress') color = 'yellow';
  else if (status === 'completed') color = 'green';
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

export default function AdminDashboard() {
  const { reports } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeAlert, setActiveAlert] = useState(false);

  const activeReports = reports.filter(r => r.status === 'pending' || r.status === 'in-progress');
  const cleanedReports = reports.filter(r => r.status === 'completed');

  return (
    <div className="flex h-screen bg-ocean-900 text-white">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-ocean-800 border-r border-accent-blue/30 flex flex-col p-6">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-teal mb-10 text-center tracking-widest">
           SUTRA-GOV
        </h1>
        <nav className="flex flex-col gap-4 flex-1">
          <button className="flex items-center gap-3 bg-accent-blue/20 text-accent-blue px-4 py-3 rounded-lg font-bold border border-accent-blue/50">
             <Activity size={20} /> Command Center
          </button>
          <button onClick={() => navigate('/admin/rivers')} className="flex items-center gap-3 hover:bg-ocean-700 text-gray-300 px-4 py-3 rounded-lg font-semibold transition">
             <Droplets size={20} /> Manage Rivers
          </button>
          <button onClick={() => navigate('/admin/reports')} className="flex items-center gap-3 hover:bg-ocean-700 text-gray-300 px-4 py-3 rounded-lg font-semibold transition">
             <BookOpenCheck size={20} /> Data Integrity
          </button>
        </nav>
        <button onClick={() => navigate('/login')} className="flex items-center justify-center gap-2 text-red-400 mt-auto hover:underline">
          <Activity size={16} /> Disconnect Terminal
        </button>
      </div>

      <div className="flex-1 flex flex-col p-6">
        {/* Top Stats */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
             Global Map Feed <span className="text-xs bg-red-500 text-white px-2 py-1 rounded animate-pulse shadow-md shadow-red-500/50">LIVE</span>
          </h2>
          <div className="flex gap-4">
            <div className="bg-ocean-800 px-6 py-2 rounded-xl flex flex-col border border-accent-blue/20 items-center">
               <span className="text-2xl font-black text-red-400">{activeReports.length}</span>
               <span className="text-xs text-accent-blue/60 uppercase font-bold tracking-widest">Active Alerts</span>
            </div>
            <div className="bg-ocean-800 px-6 py-2 rounded-xl flex flex-col border border-accent-teal/20 items-center">
               <span className="text-2xl font-black text-green-400">{cleanedReports.length * 105} kg</span>
               <span className="text-xs text-accent-blue/60 uppercase font-bold tracking-widest">Waste Collected</span>
            </div>
          </div>
        </div>

        {/* Map & Right Panel Container */}
        <div className="flex flex-1 gap-6">
          <div className="flex-1 rounded-3xl overflow-hidden border border-accent-blue/20 relative glow-effect shadow-xl z-0 bg-ocean-800">
             <MapContainer center={[19.0760, 72.8777]} zoom={6} style={{ height: '100%', width: '100%' }} className="z-0">
                <TileLayer
                  url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                />
                {reports.map((report) => (
                  <Marker 
                    key={report.id} 
                    position={[report.lat, report.lng]} 
                    icon={customIcon(report.status)}
                  >
                    <Popup className="text-black">
                      <b>Status: {report.status.toUpperCase()}</b><br/>
                      Reported by: {report.user}<br/>
                      <button onClick={() => navigate('/admin/reports')} className="mt-2 text-accent-blue font-bold text-xs underline">MODIFY DATA</button>
                    </Popup>
                  </Marker>
                ))}
             </MapContainer>
          </div>

          {/* Right Panel Control Deck */}
          <div className="w-80 flex flex-col gap-4">
             <div className="bg-ocean-800 border-l-4 border-l-yellow-400 rounded-r-xl p-5 shadow-lg">
                <h3 className="font-bold flex items-center gap-2 text-yellow-500 mb-2">
                   <Activity size={18} /> Prediction Engine
                </h3>
                <p className="text-sm text-gray-300">AI predicts extreme waste overflow near coordinates 19.45, 73.12 over the next 48 hours.</p>
             </div>

             <div className="flex-1 bg-ocean-800 rounded-2xl border border-red-500/30 p-5 shadow-lg flex flex-col relative overflow-hidden">
                <div className={`absolute inset-0 bg-red-900/20 z-0 ${activeAlert ? 'animate-pulse' : 'hidden'}`} />
                <h3 className="text-xl font-black text-red-500 flex items-center gap-2 mb-4 z-10">
                   <Wind size={20} /> Critical Triggers
                </h3>
                
                <div className="space-y-3 z-10 overflow-auto flex-1 h-32">
                   {activeReports.map(r => (
                     <div key={r.id} className="bg-ocean-900 p-3 rounded-lg border border-red-500/20 text-sm flex flex-col cursor-pointer hover:bg-ocean-700 transition" onClick={() => setActiveAlert(true)}>
                        <div className="flex justify-between font-bold text-red-400">
                           <span>New Source Identified</span>
                           <span>[ {r.lat.toFixed(1)}, {r.lng.toFixed(1)} ]</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1 truncate">Detected By: Node {r.user}</p>
                     </div>
                   ))}
                </div>

                <div className="mt-4 pt-4 border-t border-accent-blue/20 z-10">
                   <button 
                     className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 transition-all select-none"
                     onClick={() => alert("Action Force Notified. Task injected to all nearby Volunteers!")}
                   >
                     <UploadCloud size={20} /> TRIGGER ACTION ALERT
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
