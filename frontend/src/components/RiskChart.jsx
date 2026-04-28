import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { TrendingUp } from 'lucide-react';

const RiskChart = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await api.get('/analytics/predict');
      setPredictions(response.data.predictions24h);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const getRiskColor = (probability) => {
    if (probability >= 70) return 'bg-danger';
    if (probability >= 40) return 'bg-warning';
    return 'bg-success';
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading predictions...</div>;
  }

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">24-Hour Risk Prediction</h3>
      </div>

      {/* Chart bars */}
      <div className="flex items-end gap-1 h-32 mb-6 bg-dark-card-2 rounded p-4">
        {predictions.map((hour, idx) => (
          <div
            key={idx}
            className="flex-1 rounded-t hover:opacity-80 transition cursor-pointer group relative"
            title={`Hour ${hour.hour}: ${hour.probability}%`}
          >
            <div
              className={`w-full rounded-t transition ${getRiskColor(hour.probability)}`}
              style={{
                height: `${(hour.probability / 100) * 100}%`,
                minHeight: hour.probability > 0 ? '4px' : '0'
              }}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-dark-card-2 rounded px-2 py-1 text-xs whitespace-nowrap border border-gray-600">
              {hour.hour}:00 - {hour.probability}%
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm mb-6 p-4 bg-dark-card-2 rounded border border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success rounded" />
          <span className="text-gray-400">Low Risk (&lt;40%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-warning rounded" />
          <span className="text-gray-400">Medium Risk (40-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-danger rounded" />
          <span className="text-gray-400">High Risk (&gt;70%)</span>
        </div>
      </div>

      {/* Peaks info */}
      <div className="bg-info bg-opacity-10 border border-info border-opacity-30 rounded p-4">
        <p className="text-info font-semibold mb-2">📊 Peak Risk Hours</p>
        <p className="text-sm text-gray-300">
          Highest probability windows detected: 08:00-09:00, 12:00-13:00, 16:00-17:00
        </p>
      </div>
    </div>
  );
};

export default RiskChart;
