import React, { useState, useEffect } from 'react';
import api from '../lib/api';

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    fetchHeatmapData();
  }, [timeRange]);

  const fetchHeatmapData = async () => {
    try {
      const response = await api.get('/analytics/heatmap');
      setHeatmapData(response.data.heatmapData);
    } catch (error) {
      console.error('Error fetching heatmap:', error);
    }
  };

  const getIntensityColor = (intensity) => {
    const colors = {
      'none': 'rgba(255, 255, 255, 0.05)',
      'low': 'rgba(0, 204, 68, 0.2)',
      'medium': 'rgba(255, 153, 0, 0.25)',
      'high': 'rgba(255, 0, 64, 0.35)',
      'critical': 'rgba(255, 0, 64, 0.5)'
    };
    return colors[intensity] || colors['none'];
  };

  const getIntensityBorder = (intensity) => {
    const borders = {
      'none': 'border-gray-700',
      'low': 'border-success',
      'medium': 'border-warning',
      'high': 'border-danger',
      'critical': 'border-danger'
    };
    return borders[intensity] || borders['none'];
  };

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Campus Heatmap</h3>
        <div className="flex gap-2">
          {['1h', '6h', '24h', '7d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm transition ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6 auto-rows-max">
        {heatmapData.map((zone) => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone)}
            className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 cursor-pointer transition hover:border-opacity-100 ${getIntensityBorder(
              zone.intensity
            )}`}
            style={{
              backgroundColor: getIntensityColor(zone.intensity),
              borderOpacity: 0.7
            }}
          >
            <div className="text-xs font-semibold text-center line-clamp-2">
              {zone.zone}
            </div>
            {zone.incidentCount > 0 && (
              <div className="text-xs mt-1 opacity-75">{zone.incidentCount} 📍</div>
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: getIntensityColor('none') }} />
          <span className="text-gray-400">None</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: getIntensityColor('low') }} />
          <span className="text-gray-400">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: getIntensityColor('medium') }} />
          <span className="text-gray-400">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: getIntensityColor('high') }} />
          <span className="text-gray-400">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: getIntensityColor('critical') }} />
          <span className="text-gray-400">Critical</span>
        </div>
      </div>

      {/* Zone Details */}
      {selectedZone && (
        <div className="mt-6 p-4 bg-dark-card-2 rounded border border-primary border-opacity-30">
          <p className="text-sm text-gray-400 mb-2">Selected Zone:</p>
          <p className="font-semibold mb-2">{selectedZone.zone}</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Incidents</p>
              <p className="text-lg font-bold">{selectedZone.incidentCount}</p>
            </div>
            <div>
              <p className="text-gray-400">Avg Severity</p>
              <p className="text-lg font-bold">{selectedZone.severity.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="text-lg font-bold capitalize">{selectedZone.intensity}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Heatmap;
