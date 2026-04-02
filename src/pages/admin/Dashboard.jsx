import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell, Settings, Search, CloudLightning, Activity, Trash2, Users, Network, TrendingUp, MapPin, Play, Pause, SkipBack, SkipForward, ArrowRight, Wind, Droplets, AlertTriangle, FileText, Zap, Clock, LogOut } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { KARNATAKA_RIVERS } from '../../data/karnatakaRivers';
import { getDownstreamRiskPath } from '../../utils/geoFlow';
import { db, auth } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import 'leaflet/dist/leaflet.css';

// --- CUSTOM SONAR PULSE ICONS ---
const createSonarIcon = (type) => {
    const color = type === 'critical' ? '#EF4444' : type === 'warning' ? '#EAB308' : '#10B981';
    return L.divIcon({
        className: 'custom-icon',
        html: `
            <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; z-index: 2; box-shadow: 0 0 10px ${color}"></div>
                <div style="position: absolute; border: 2px solid ${color}; width: 40px; height: 40px; border-radius: 50%; animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; z-index: 1;"></div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
};

export default function AdminDashboard() {
  const { user, reports, alerts, updateReportStatus } = useContext(AppContext);
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  
  // Real-time Clock
  useEffect(() => {
     const timer = setInterval(() => setTime(new Date()), 1000);
     return () => clearInterval(timer);
  }, []);

  // --- LIVE WEATHER DATA ---
  const [weather, setWeather] = useState({ temp: '31.0', wind: '14.2', humidity: '82' });
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=15.31&longitude=75.71&current_weather=true&hourly=relative_humidity_2m')
      .then(res => res.json())
      .then(data => {
         if (data && data.current_weather) {
            setWeather({
                temp: data.current_weather.temperature,
                wind: data.current_weather.windspeed,
                humidity: data.hourly.relative_humidity_2m[Math.floor(new Date().getHours())] || 82
            });
         }
      }).catch(e => console.error("Weather fetch failed", e));
  }, []);

  // --- TIMELINE SIMULATION & TELEMETRY ---
  const [timelinePlay, setTimelinePlay] = useState(false);
  const [timeOffset, setTimeOffset] = useState(0);
  const [waterLevel, setWaterLevel] = useState(1.24);

  useEffect(() => {
     let intv;
     if (timelinePlay) {
         intv = setInterval(() => {
            setTimeOffset(prev => prev + 1);
            setWaterLevel(prev => +(prev + (Math.random() * 0.04 - 0.02)).toFixed(2));
         }, 500);
     }
     return () => clearInterval(intv);
  }, [timelinePlay]);

  // --- AI DISPATCH ACTIONS ---
  const [deployedActions, setDeployedActions] = useState({});
  const handleAIAction = async (actionTitle, idx) => {
      if (deployedActions[idx]) return;
      setDeployedActions(prev => ({...prev, [idx]: true}));
      
      const isEvacuation = actionTitle.includes("Evacuation SMS");
      try {
          await addDoc(collection(db, 'alerts'), {
              title: isEvacuation ? "🚨 GLOBAL SOS: EVACUATE SECTOR" : "AI DISPATCH: " + actionTitle,
              desc: isEvacuation ? "Government Override: Immediate citizen evacuation required." : "Automated tactical dispatch requested by Command Center.",
              address: isEvacuation ? "All Zones" : "Vrishabhavathi Drone Sector",
              type: isEvacuation ? 'GLOBAL_SMS' : 'TASK',
              timestamp: serverTimestamp()
          });
      } catch (e) { console.error(e) }
  };

  // --- STATE-WIDE DATA LOGIC ---
  const karnatakaCenter = [14.0, 75.5]; // Center map over central Karnataka
  
  // Calculate aggregate critical rivers (any river currently facing contamination)
  const activeContaminations = reports.filter(r => r.lat && r.lng && r.status !== 'completed').map(r => getDownstreamRiskPath(r.lat, r.lng)).filter(Boolean);

  // Calculate Real KPI Metrics
  const completedReportsCount = reports.filter(r => r.status === 'completed').length;
  const totalWasteInterceptedKg = (completedReportsCount * 52).toLocaleString();
  const sysHealth = Math.max(12.5, 100 - (activeContaminations.length * 4.2)).toFixed(1);
  const activeTeams = alerts ? alerts.length + 2 : 2;
  const computedPollutionDensity = Math.min(100, Math.max(12, 45 + (activeContaminations.length * 8)));

  // Critical Hotspots along the river
  const karnatakaHotspots = [
      { id: 'h1', lat: 13.010, lng: 77.560, name: 'Vrishabhavathi Source', type: 'critical' },
      { id: 'h2', lat: 12.975, lng: 77.540, name: 'Peenya Industrial Drain', type: 'critical' },
      { id: 'h3', lat: 12.940, lng: 77.510, name: 'Mysore Road Belt', type: 'warning' },
      { id: 'h4', lat: 12.930, lng: 77.620, name: 'Bellandur Lake Foam', type: 'critical' },
      { id: 'h5', lat: 12.910, lng: 77.640, name: 'Agara Lake Intake', type: 'warning' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0E17] text-gray-300 font-sans overflow-x-hidden pb-10">
      
      {/* 1. GLOBAL HEADER */}
      <header className="h-16 bg-[#0E131F] border-b border-[#1C2536] flex items-center justify-between px-6 sticky top-0 z-50">
          <div className="flex items-center gap-6 text-white">
              <div className="flex items-center gap-3">
                 <Shield className="text-accent-blue" size={24} />
                 <div>
                    <h1 className="text-sm font-black tracking-widest leading-none">Samudra Sutra</h1>
                    <p className="text-[10px] text-accent-blue/80 font-mono mt-0.5 tracking-wider">BlueTrace Intelligence System</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 bg-accent-blue/5 border border-accent-blue/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse shadow-[0_0_8px_rgba(0,242,254,0.8)]" />
                  <span className="text-[10px] font-black text-accent-blue tracking-widest">LIVE</span>
              </div>
          </div>

          <div className="flex flex-1 max-w-md mx-8 relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input type="text" placeholder="Search parameters, nodes, sectors..." className="w-full bg-[#151B28] rounded-lg py-2 pl-10 pr-4 text-xs font-mono focus:outline-none focus:ring-1 border border-[#1C2536] focus:border-accent-blue" />
          </div>

          <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                  <p className="text-xs font-mono font-bold text-white">{time.toLocaleTimeString()}</p>
                  <p className="text-[10px] text-gray-500">{time.toDateString()}</p>
              </div>
              <div className="flex items-center gap-4 border-l border-[#1C2536] pl-6">
                  <button className="relative text-gray-400 hover:text-white transition group"><Bell size={18} /><span className="absolute -top-1 -right-1 w-[12px] h-[12px] bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-black group-hover:animate-ping">2</span></button>
                  <button onClick={() => { auth.signOut().catch(()=>{}); setUser(null); navigate('/login'); }} className="text-gray-400 hover:text-red-500 transition flex items-center gap-2"><LogOut size={18} /> <span className="text-[10px] hidden md:block font-black uppercase tracking-widest">Logout</span></button>
                  <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center text-[#0A0E17] font-black cursor-pointer">A</div>
              </div>
          </div>
      </header>

      {/* 2. KPI METRICS (6 CARDS) */}
      <div className="px-6 mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
              { id: 'alerts', label: 'Active Alerts', value: activeContaminations.length + (alerts?.length || 0), desc: 'Marine Threats Detected', color: 'text-red-500', icon: AlertTriangle, border: 'border-red-500/30 bg-red-500/5' },
              { id: 'reports', label: 'Reports Today', value: reports?.length || 0, desc: 'Pollution incidents', color: 'text-accent-blue', icon: FileText, border: 'border-[#1C2536]' },
              { id: 'intercept', label: 'Waste Intercepted', value: `${totalWasteInterceptedKg} kg`, desc: 'Based on completed tasks', color: 'text-green-500', icon: Trash2, border: 'border-[#1C2536]' },
              { id: 'teams', label: 'Teams Deployed', value: activeTeams.toString(), desc: 'Active cleanup crews', color: 'text-accent-teal', icon: Users, border: 'border-[#1C2536]' },
              { id: 'rivers', label: 'River Subsystems', value: KARNATAKA_RIVERS.length, desc: 'Monitored Networks', color: 'text-green-400', icon: Network, border: 'border-[#1C2536]' },
              { id: 'health', label: 'System Health', value: `${sysHealth}%`, desc: 'AI Vision & Flow Math', color: 'text-green-500', icon: TrendingUp, border: 'border-[#1C2536]' }
          ].map((stat, i) => (
             <div 
                 key={i} 
                 onClick={() => {
                     if (stat.id === 'reports') {
                         navigate('/admin/reports');
                     }
                 }}
                 className={`bg-[#0E131F] border ${stat.border} rounded-xl p-4 flex flex-col relative overflow-hidden group transition duration-300 shadow-lg ${stat.id === 'reports' ? 'cursor-pointer hover:border-accent-blue hover:-translate-y-1 shadow-[0_0_15px_rgba(0,242,254,0.1)]' : 'hover:border-[#2A3B5A]'}`}
             >
                 <div className="flex justify-between items-start mb-4">
                     <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-tight w-24">{stat.label}</span>
                     <stat.icon size={16} className={`${stat.color} opacity-80`} />
                 </div>
                 <span className="text-2xl font-black text-white">{stat.value}</span>
                 <p className="text-[10px] font-mono text-gray-500 mt-1 truncate">{stat.desc}</p>
             </div>
          ))}
      </div>

      {/* 3. CORE GRID FRAMEWORK */}
      <div className="px-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
          
          {/* LEFT COLUMN (8 cols): Map + Timeline + Reports */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
              
              {/* PRIMARY MAP */}
              <div className="bg-[#0E131F] border border-[#1C2536] rounded-xl flex flex-col overflow-hidden h-[500px] relative shadow-2xl shadow-black/50">
                  <div className="h-12 border-b border-[#1C2536] flex items-center justify-between px-4 bg-[#111827]">
                      <h2 className="text-xs font-black text-white flex items-center gap-2"><Activity size={14} className="text-accent-blue" /> Live Pollution Grid (Karnataka Region)</h2>
                      <span className="text-[10px] text-gray-400 font-mono tracking-widest bg-[#1C2536] px-2 py-1 rounded">CARTO DB / OSM</span>
                  </div>
                  
                  <div className="flex-1 w-full h-full relative z-0 relative">
                     <MapContainer center={karnatakaCenter} zoom={7} className="w-full h-full absolute inset-0 z-0 h-[500px]">
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                        
                        {/* 1. Render Base River Topography (Safe State) */}
                        {KARNATAKA_RIVERS.map(river => (
                            <Polyline key={river.id} positions={river.coords} pathOptions={{ color: '#3B82F6', weight: 2, opacity: 0.4 }} />
                        ))}

                        {/* 2. Render Mathematical Downstream Contamination Flow */}
                        {activeContaminations.map((risk, idx) => (
                           <Polyline key={`risk-${idx}`} positions={risk.riskPath} pathOptions={{ color: '#EF4444', weight: 4, className: 'glowing-river-line' }} />
                        ))}

                        {/* 3. Render Database Real-Time User Dump Sites */}
                        {(reports || []).map(report => report.lat && report.lng && (
                            <Marker key={`usr-${report.id}`} position={[report.lat, report.lng]} icon={createSonarIcon(report.status === 'completed' ? 'green' : 'critical')}>
                                <Popup className="custom-popup">
                                   <div className="bg-[#0A0E17] p-2 text-white border border-[#1C2536] rounded w-48">
                                       <h3 className="font-bold text-xs mb-1">Civilian Report</h3>
                                       <p className="text-[10px] font-mono text-gray-400 mb-2">{report.address}</p>
                                       {getDownstreamRiskPath(report.lat, report.lng) && (
                                            <div className="bg-red-500/10 border border-red-500/20 p-1.5 rounded">
                                                <p className="text-[9px] font-black text-red-500 uppercase tracking-wider mb-0.5">⚠️ Ocean Flow Threat</p>
                                                <p className="text-[9px] font-mono text-gray-400">Flowing to: {getDownstreamRiskPath(report.lat, report.lng).destination}</p>
                                            </div>
                                       )}
                                   </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Render Mock Historical Ocean Threats (Sensors) */}
                        {karnatakaHotspots.map(hot => (
                            <Marker key={hot.id} position={[hot.lat, hot.lng]} icon={createSonarIcon(hot.type)}>
                                <Popup className="custom-popup"><div className="bg-[#0A0E17] p-2 text-white border border-[#1C2536] rounded"><h3 className="font-bold text-xs mb-1">{hot.name}</h3><p className="text-[10px] font-mono text-yellow-400">Archived Sensor Detect</p></div></Popup>
                            </Marker>
                        ))}
                     </MapContainer>
                     <div className="absolute bottom-4 left-4 z-[9999] pointer-events-none">
                         <div className="bg-[#0E131F]/90 backdrop-blur border border-[#1C2536] p-3 rounded-lg flex flex-col gap-2">
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_red]" /><span className="text-[10px] font-mono text-white">Critical Risk</span></div>
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_yellow]" /><span className="text-[10px] font-mono text-white">Medium Risk</span></div>
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-[10px] font-mono text-white">Stable Area</span></div>
                         </div>
                     </div>
                  </div>
              </div>

              {/* TIMELINE SIMULATION SCRUBBER */}
              <div className="bg-[#0E131F] border border-[#1C2536] p-6 rounded-xl relative shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs font-black text-white">Timeline Simulation</h3>
                      <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1"><Clock size={12}/> Speed: {timelinePlay ? '2x' : '1x'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 font-mono mb-2">
                      <span className="text-white font-bold text-sm">Simulated Time: NOW</span>
                      <span className="text-accent-blue font-bold">Offset: +{timeOffset}h</span>
                  </div>
                  
                  <div className="relative w-full h-2 bg-[#1C2536] rounded-full mb-6 mt-4 flex items-center cursor-pointer hover:h-3 transition-all duration-300 overflow-hidden">
                      <div className="absolute h-full bg-accent-blue rounded-l-full transition-all duration-300" style={{ width: `${Math.min(25 + (timeOffset * 2), 100)}%` }} />
                      <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_white] absolute transition-all duration-300 -ml-2" style={{ left: `${Math.min(25 + (timeOffset * 2), 100)}%` }} />
                  </div>

                  <div className="flex justify-center items-center gap-6">
                      <button onClick={() => setTimeOffset(Math.max(0, timeOffset - 5))} className="text-gray-400 border border-white/10 w-8 h-8 flex items-center justify-center rounded-lg hover:text-white hover:bg-white/5 transition"><SkipBack size={14} /></button>
                      <button onClick={() => setTimelinePlay(!timelinePlay)} className={`${timelinePlay ? 'bg-red-500 hover:bg-red-400 text-[#0A0E17]' : 'bg-accent-blue text-[#0A0E17] hover:bg-blue-300'} w-10 h-10 flex items-center justify-center rounded-lg transition`}>
                         {timelinePlay ? <Pause size={20} className="fill-current"/> : <Play size={20} className="ml-1 fill-current"/>}
                      </button>
                      <button onClick={() => setTimeOffset(timeOffset + 5)} className="text-gray-400 border border-white/10 w-8 h-8 flex items-center justify-center rounded-lg hover:text-white hover:bg-white/5 transition"><SkipForward size={14} /></button>
                      
                      <div className="flex items-center gap-2 ml-4">
                          <button className="text-[10px] font-black text-gray-400 hover:text-white bg-[#151B28] px-2 py-1 rounded">1x</button>
                          <button className="text-[10px] font-black text-white hover:text-white bg-white/10 px-2 py-1 rounded">2x</button>
                          <button className="text-[10px] font-black text-gray-400 hover:text-white bg-[#151B28] px-2 py-1 rounded">4x</button>
                      </div>
                  </div>
              </div>



          </div>


          {/* RIGHT COLUMN (4 cols): Weather, Alerts, Quick Actions */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
              
              {/* LIVE ENVIRONMENT DATA MAP */}
              <div className="bg-[#0E131F] border border-[#1C2536] rounded-xl p-5 shadow-lg">
                  <div className="flex justify-between items-center mb-6 border-b border-[#1C2536] pb-4">
                      <div className="flex items-center gap-3">
                         <CloudLightning size={32} className="text-accent-blue" />
                         <div><p className="text-3xl font-black text-white tracking-tighter">{weather.temp}°C</p><p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">State Met Data Live</p></div>
                      </div>
                  </div>
                  <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-xs border-b border-[#1C2536]/50 pb-2"><span className="text-gray-500 flex items-center gap-2"><Wind size={14}/> Wind Vector</span><span className="text-white font-mono">{weather.wind} km/h</span></div>
                      <div className="flex justify-between text-xs border-b border-[#1C2536]/50 pb-2"><span className="text-gray-500 flex items-center gap-2"><Droplets size={14}/> Humidity</span><span className="text-white font-mono">{weather.humidity}%</span></div>
                      <div className="flex justify-between text-xs border-b border-[#1C2536]/50 pb-2"><span className="text-gray-500 font-bold uppercase tracking-widest mt-2 text-[10px]">Marine / River Data</span></div>
                      <div className="flex justify-between text-xs border-b border-[#1C2536]/50 pb-2"><span className="text-gray-500">Water Level Change</span><span className="text-red-400 font-mono">+{waterLevel}m (Fluctuating)</span></div>
                  </div>
                  <div>
                      <div className="flex justify-between text-xs mb-2 uppercase font-black tracking-widest text-[#1C2536]"><span className="text-gray-400">Pollution Density Index</span><span className="text-red-500">{computedPollutionDensity}/100</span></div>
                      <div className="w-full h-1.5 bg-[#1C2536] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-1000" style={{ width: `${computedPollutionDensity}%` }} /></div>
                  </div>
              </div>

              {/* LIVE ALERTS PANEL */}
              <div className="bg-[#0E131F] border border-[#1C2536] rounded-xl shadow-lg flex-1 flex flex-col h-[300px] overflow-hidden">
                  <div className="p-4 border-b border-[#1C2536] flex justify-between items-center">
                     <h3 className="text-xs font-black text-white">Live Dispatches</h3>
                     <span className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded font-black">{alerts?.length || 0} Pending</span>
                  </div>
                  <div className="p-4 flex flex-col gap-3 overflow-y-auto">
                      {(alerts || []).map(a => (
                          <div key={a.id} className="bg-red-500/5 border border-red-500/20 p-3 rounded-lg cursor-pointer hover:bg-red-500/10 transition group">
                              <div className="flex items-center gap-2 mb-1">
                                  <AlertTriangle size={12} className="text-red-500" />
                                  <span className="text-[10px] font-black text-red-500 tracking-widest uppercase">Critical Intervention</span>
                                  <span className="text-[8px] text-gray-500 ml-auto font-mono">Live</span>
                              </div>
                              <h4 className="text-white text-sm font-bold truncate mb-1">{a.title}</h4>
                              <p className="text-gray-400 text-[10px] flex items-center gap-1"><MapPin size={10} /> {a.address}</p>
                          </div>
                      ))}
                      {(!alerts || alerts.length === 0) && <p className="text-center text-xs text-gray-500 py-10">No manual Dispatches sent via Reports tab yet.</p>}
                  </div>
              </div>

              {/* AI QUICK ACTIONS */}
              <div className="bg-[#0E131F] border border-[#1C2536] p-5 rounded-xl shadow-lg">
                  <h3 className="text-xs font-black text-white flex items-center gap-2 mb-4">Quick Actions <span className="bg-accent-teal/10 border border-accent-teal/30 text-accent-teal px-2 py-0.5 text-[9px] rounded font-bold"><Zap size={10} className="inline mr-1" />AI Suggested</span></h3>
                  
                  <div className="flex flex-col gap-3">
                      {[
                          { title: 'Deploy Cleanup Drone', desc: 'Auto-scavenger to Vrishabhavathi', time: 'ETA 15m', tag: 'High' },
                          { title: 'Emit Local Evacuation SMS', desc: 'Ping residents in Bellandur sector', time: 'Immediate', tag: 'Critical' },
                          { title: 'Activate Filtration Net', desc: 'Deploy automated containment barrier', time: 'ETA 2H', tag: 'Medium' }
                      ].map((action, i) => (
                          <div key={i} className="bg-[#151B28] rounded-xl p-3 border border-white/5 flex items-center justify-between group">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-[#1C2536] text-accent-blue flex items-center justify-center">
                                      {i === 0 ? <Activity size={14}/> : i === 1 ? <Bell size={14}/> : <Shield size={14}/>}
                                  </div>
                                  <div>
                                      <h4 className="text-white text-xs font-bold leading-tight flex items-center gap-2">{action.title} <span className={`text-[8px] px-1.5 py-0.5 rounded border leading-none font-black ${action.tag === 'Critical' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'}`}>{action.tag}</span></h4>
                                      <p className="text-[9px] text-gray-400 font-mono mt-0.5">{action.desc}</p>
                                  </div>
                              </div>
                              <button 
                                  onClick={() => handleAIAction(action.title, i)}
                                  disabled={deployedActions[i]}
                                  className={`${deployedActions[i] ? 'bg-green-500/20 text-green-500 border-green-500/30 cursor-not-allowed border' : 'bg-accent-blue hover:bg-blue-400 text-[#0A0E17] border-black/20 font-black shadow-lg shadow-accent-blue/20'} text-[10px] font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition uppercase tracking-wider`}
                              >
                                  {deployedActions[i] ? 'Deployed ✓' : <span className="flex items-center gap-1">Execute <ArrowRight size={12}/></span>}
                              </button>
                          </div>
                      ))}
                  </div>
              </div>

          </div>
      </div>

      {/* CUSTOM CSS FOR MAP UI */}
      <style>{`
         .leaflet-container {
             background: transparent !important;
         }
         .glowing-river-line {
             animation: dash 5s linear infinite, glow 2s ease-in-out infinite alternate;
             filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.8));
         }
         @keyframes dash {
             to { stroke-dashoffset: -100; }
         }
         @keyframes pulse-ring {
             0% { transform: scale(0.3); opacity: 0; border-width: 4px; }
             50% { opacity: 1; border-width: 2px; }
             100% { transform: scale(3.5); opacity: 0; border-width: 0px; }
         }
         .custom-popup .leaflet-popup-content-wrapper { background: transparent; border: none; box-shadow: none; padding: 0; margin-top: -15px;}
         .custom-popup .leaflet-popup-tip-container { display: none; }
      `}</style>

    </div>
  );
}
