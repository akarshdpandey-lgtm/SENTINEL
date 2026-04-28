import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';

const TeamStatus = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
    const interval = setInterval(fetchTeams, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teams/status/load');
      setTeams(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'AVAILABLE': 'bg-success bg-opacity-20 text-success border-success',
      'PARTIAL': 'bg-warning bg-opacity-20 text-warning border-warning',
      'OVERLOADED': 'bg-danger bg-opacity-20 text-danger border-danger'
    };
    return statusMap[status] || statusMap['AVAILABLE'];
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading teams...</div>;
  }

  return (
    <div className="space-y-3">
      {teams.map((team) => (
        <div key={team.type} className="bg-dark-card rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <h4 className="font-semibold">{team.name}</h4>
                <p className="text-xs text-gray-500">{team.totalMembers} members</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadgeClass(team.statusBadge)}`}>
              {team.statusBadge === 'OVERLOADED' ? '🔴' : team.statusBadge === 'PARTIAL' ? '🟡' : '🟢'} {team.statusBadge}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
            <div className="bg-dark-card-2 rounded p-2">
              <p className="text-gray-500">Available</p>
              <p className="text-lg font-bold">{team.availableMembers}</p>
            </div>
            <div className="bg-dark-card-2 rounded p-2">
              <p className="text-gray-500">Busy</p>
              <p className="text-lg font-bold text-warning">{team.busyMembers}</p>
            </div>
            <div className="bg-dark-card-2 rounded p-2">
              <p className="text-gray-500">Capacity</p>
              <p className="text-lg font-bold">{team.capacityPercent}%</p>
            </div>
          </div>

          {/* Capacity bar */}
          <div className="w-full bg-dark-card-2 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                team.capacityPercent > 80 ? 'bg-danger' : team.capacityPercent > 50 ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${team.capacityPercent}%` }}
            />
          </div>

          {team.backupNeeded && (
            <div className="mt-2 text-xs text-danger font-semibold flex items-center gap-1">
              ⚠️ Backup support may be needed
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeamStatus;
