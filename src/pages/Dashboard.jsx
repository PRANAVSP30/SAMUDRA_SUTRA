import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, Activity, Wind, Trash2 } from 'lucide-react';
import { getReports } from '../firebase';

// Fix leaflet icon paths via imports or default CSS overrides
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

const customIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    // Initial fetch
    setReports(getReports());
    
    // Simulate live updates for demo purposes 
    const interval = setInterval(() => {
        setReports(getReports());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerSimulation = () => {
    setSimulating(true);
    setTimeout(() => setSimulating(false), 5000);
  };

  return (
    <div className="flex flex-col h-screen bg-root border-t-4 border-accent-blue p-4 text-primary">
      {/* Header Stats Pane */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="text-accent-teal" /> Government Command Center
          </h1>
          <p className="text-accent-blue/70">Centralized Waste Intelligence Node</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-panel p-4 rounded-xl border border-accent-blue/30 w-40 text-center">
            <Wind className="mx-auto mb-2 text-red-400" />
            <span className="text-2xl font-bold">{reports.filter(r => r.status === 'pending').length}</span>
            <p className="text-xs text-red-300">Active Hazards</p>
          </div>
          <div className="bg-panel p-4 rounded-xl border border-accent-teal/30 w-40 text-center">
            <Trash2 className="mx-auto mb-2 text-green-400" />
            <span className="text-2xl font-bold">{reports.filter(r => r.status === 'completed').length}</span>
            <p className="text-xs text-green-300">Cleaned Sites</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 relative h-[70vh]">
        
        {/* Map Pane */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-accent-blue/20 relative glow-effect">
            <MapContainer 
              center={[19.0760, 72.8777]} 
              zoom={6} 
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              />
              
              {reports.map((report) => (
                <Marker 
                  key={report.id} 
                  position={[report.lat, report.lng]} 
                  icon={customIcon(report.status === 'pending' ? 'red' : 'green')}
                >
                  <Popup>
                    <div className="text-black font-semibold">
                      <p>Status: {report.status}</p>
                      {report.citizen && <p>Reported By: {report.citizen}</p>}
                      {report.volunteer && <p>Cleaned By: {report.volunteer}</p>}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Simulation node moving randomly for effect */}
              {simulating && (
                 <CircleMarker center={[19.1, 72.9]} radius={10} pathOptions={{ color: 'yellow' }} className="animate-ping" />
              )}
            </MapContainer>
        </div>

        {/* Alerts Panel Pane */}
        <div className="w-96 bg-panel rounded-2xl flex flex-col p-4 border border-red-500/30">
          <h2 className="text-xl font-bold flex items-center mb-4 text-red-400">
            <AlertCircle className="mr-2" /> Live Alerts 
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
             {reports.filter(r => r.status === 'pending').map(report => (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={report.id}
                    className="p-3 bg-red-900/30 border-l-4 border-red-500 rounded text-sm relative"
                >
                  <p className="font-bold">New Plastic Waste Warning!</p>
                  <p className="text-red-300 mt-1 flex justify-between">
                     <span>Lat: {report.lat.toFixed(2)}</span>
                     <span>Citizen: {report.citizen}</span>
                  </p>
                  <button className="mt-3 bg-red-600/50 hover:bg-red-500 text-primary w-full py-1 rounded transition">View Report</button>
                </motion.div>
             ))}
          </div>

          <button 
             onClick={triggerSimulation}
             className="mt-4 bg-accent-blue/20 border border-accent-blue hover:bg-accent-blue/40 py-3 rounded-xl font-bold"
          >
             Simulate River Flow 🌊
          </button>
        </div>

      </div>
    </div>
  );
}