import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PanicButton from './components/PanicButton';
import VoiceMonitor from './components/VoiceMonitor';
import Heatmap from './components/Heatmap';
import TeamStatus from './components/TeamStatus';
import TimerCard from './components/TimerCard';
import EscalationLadder from './components/EscalationLadder';
import NotificationGrid from './components/NotificationGrid';
import RiskChart from './components/RiskChart';
import CampusMap from './components/CampusMap';
import DashboardPage from './pages/DashboardPage';
import AlertDetail from './pages/AlertDetail';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [page, setPage] = useState('dashboard');
  const [emergencies, setEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmergencies = async () => {
    try {
      const response = await axios.get(`${API_BASE}/emergency`);
      setEmergencies(response.data);
      setSelectedEmergency((current) => {
        if (!current) return current;
        return response.data.find((emergency) => emergency.id === current.id) || current;
      });
      
      const statsResponse = await axios.get(`${API_BASE}/emergency/stats`);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    }
  };

  const handleEmergencyCreate = (emergency) => {
    setEmergencies((current) => [emergency, ...current]);
    fetchEmergencies();
  };

  const handleEmergencyUpdate = (updatedEmergency) => {
    if (updatedEmergency) {
      setSelectedEmergency(updatedEmergency);
      setEmergencies((current) =>
        current.map((emergency) =>
          emergency.id === updatedEmergency.id ? updatedEmergency : emergency
        )
      );
    }

    fetchEmergencies();
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Navigation */}
      <nav className="bg-dark-card border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold">
              S
            </div>
            <h1 className="text-xl font-bold">SENTINEL</h1>
            <span className="text-xs text-text-muted ml-2">Emergency Response System</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage('dashboard')}
              className={`px-4 py-2 rounded-lg transition ${
                page === 'dashboard' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={fetchEmergencies}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {page === 'dashboard' && (
          <DashboardPage
            emergencies={emergencies}
            stats={stats}
            onEmergencySelect={(em) => {
              setSelectedEmergency(em);
              setPage('detail');
            }}
            onEmergencyCreate={handleEmergencyCreate}
          />
        )}

        {page === 'detail' && selectedEmergency && (
          <AlertDetail
            emergency={selectedEmergency}
            onBack={() => setPage('dashboard')}
            onUpdate={handleEmergencyUpdate}
          />
        )}
      </main>
    </div>
  );
}

export default App;
