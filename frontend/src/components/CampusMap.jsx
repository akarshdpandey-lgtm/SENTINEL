import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, TrendingUp } from 'lucide-react';

const CampusMap = () => {
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNetwork();
  }, []);

  const fetchNetwork = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/demo/campus-network');
      setNetwork(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching network:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading campus network...</div>;
  }

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Cross-Campus Network</h3>
      </div>

      <div className="space-y-4">
        {network?.campuses.map((campus) => (
          <div key={campus.id} className="bg-dark-card-2 rounded-lg p-4 border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-lg">{campus.name}</h4>
                <p className="text-xs text-gray-500">{campus.address}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                campus.status === 'AVAILABLE'
                  ? 'bg-success bg-opacity-20 text-success'
                  : 'bg-warning bg-opacity-20 text-warning'
              }`}>
                {campus.status}
              </span>
            </div>

            {/* Resources */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-dark rounded p-2 text-sm">
                <p className="text-gray-500">Fire Teams</p>
                <p className="text-lg font-bold">{campus.resources.fireTeams}</p>
              </div>
              <div className="bg-dark rounded p-2 text-sm">
                <p className="text-gray-500">Medical Units</p>
                <p className="text-lg font-bold">{campus.resources.medicalUnits}</p>
              </div>
              <div className="bg-dark rounded p-2 text-sm">
                <p className="text-gray-500">Security Patrols</p>
                <p className="text-lg font-bold">{campus.resources.securityPatrols}</p>
              </div>
            </div>

            {/* Connections */}
            {campus.connectedCampuses.length > 0 && (
              <div className="pt-3 border-t border-gray-600">
                <p className="text-xs text-gray-500 mb-2">Connected to:</p>
                <div className="flex flex-wrap gap-2">
                  {campus.connectedCampuses.map((connected) => (
                    <div key={connected} className="text-xs bg-primary bg-opacity-20 text-primary px-2 py-1 rounded border border-primary border-opacity-30">
                      → {campus.etaToOthers?.[connected] || 'N/A'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Deployments */}
      {network?.deployments && network.deployments.length > 0 && (
        <div className="mt-6 p-4 bg-info bg-opacity-10 border border-info border-opacity-30 rounded">
          <p className="text-info font-semibold mb-3">🚁 Active Deployments</p>
          <div className="space-y-2">
            {network.deployments.map((deployment) => (
              <div key={deployment.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">
                  {deployment.resourceType} in transit from {deployment.from} → {deployment.to}
                </span>
                <span className="text-info font-semibold">ETA: {deployment.eta}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusMap;
