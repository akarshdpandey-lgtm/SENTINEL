import React from 'react';
import PanicButton from '../components/PanicButton';
import VoiceMonitor from '../components/VoiceMonitor';
import Heatmap from '../components/Heatmap';
import TeamStatus from '../components/TeamStatus';
import RiskChart from '../components/RiskChart';
import CampusMap from '../components/CampusMap';

const DashboardPage = ({ emergencies, stats, onEmergencyCreate, onEmergencySelect }) => {
  const statusClassName = (status) => {
    if (status === 'IN_PROGRESS') return 'bg-info bg-opacity-20 text-info border-info border-opacity-50';
    if (status === 'SLA_BREACHED') return 'bg-danger bg-opacity-20 text-danger border-danger border-opacity-50';
    return 'bg-success bg-opacity-20 text-success border-success border-opacity-50';
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-card rounded-lg p-4 border border-gray-700">
            <p className="text-gray-500 text-sm">Total Emergencies</p>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </div>
          <div className="bg-dark-card rounded-lg p-4 border border-gray-700">
            <p className="text-gray-500 text-sm">Critical</p>
            <p className="text-3xl font-bold text-danger">{stats.byPriority.CRITICAL}</p>
          </div>
          <div className="bg-dark-card rounded-lg p-4 border border-gray-700">
            <p className="text-gray-500 text-sm">Avg Response Time</p>
            <p className="text-3xl font-bold text-info">{stats.avgResponseTime}s</p>
          </div>
          <div className="bg-dark-card rounded-lg p-4 border border-gray-700">
            <p className="text-gray-500 text-sm">SLA Compliance</p>
            <p className="text-3xl font-bold text-success">{stats.slaComplianceRate}%</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <VoiceMonitor onEmergencyCreate={onEmergencyCreate} />
          <TeamStatus />
        </div>

        {/* Center Column */}
        <div className="space-y-8">
          <Heatmap />
          <RiskChart />
        </div>

        {/* Right Column */}
        <div>
          <CampusMap />
        </div>
      </div>

      {/* Recent Emergencies */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-6">Recent Emergencies</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {emergencies.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No emergencies reported yet</p>
          ) : (
            emergencies.map((emergency) => (
              <button
                key={emergency.id}
                onClick={() => onEmergencySelect?.(emergency)}
                className="w-full text-left bg-dark-card-2 rounded-lg p-4 border border-gray-700 hover:border-primary hover:bg-opacity-50 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {emergency.type === 'fire' ? '🔥' : emergency.type === 'medical' ? '🏥' : '👮'}
                    </span>
                    <div>
                      <p className="font-semibold capitalize">{emergency.type}</p>
                      <p className="text-xs text-gray-500">{emergency.location}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <span className={`px-3 py-1 rounded text-sm font-semibold border ${
                      emergency.priority === 'CRITICAL'
                        ? 'bg-danger bg-opacity-20 text-danger border-danger border-opacity-50'
                        : emergency.priority === 'HIGH'
                        ? 'bg-warning bg-opacity-20 text-warning border-warning border-opacity-50'
                        : 'bg-info bg-opacity-20 text-info border-info border-opacity-50'
                    }`}>
                      {emergency.priority}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm font-semibold border ${statusClassName(emergency.status)}`}>
                      {emergency.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{emergency.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(emergency.createdAt).toLocaleTimeString()}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      <PanicButton onEmergencyCreate={onEmergencyCreate} />
    </div>
  );
};

export default DashboardPage;
