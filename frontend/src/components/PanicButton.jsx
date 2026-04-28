import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import api from '../lib/api';

const PanicButton = ({ onEmergencyCreate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('fire');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('CRITICAL');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/emergency', {
        type,
        location: location || 'Current Location',
        description: description || 'Emergency triggered',
        priority,
        latitude: 28.6139 + Math.random() * 0.01,
        longitude: 77.2090 + Math.random() * 0.01
      });

      onEmergencyCreate?.(response.data);
      setIsOpen(false);
      setLocation('');
      setDescription('');
    } catch (error) {
      console.error('Error creating emergency:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-24 h-24 bg-danger rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition animate-pulse-glow z-40"
      >
        <span className="text-4xl">🚨</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-lg p-6 max-w-md w-full border border-gray-700 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-danger" />
          <h2 className="text-2xl font-bold">Report Emergency</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Emergency Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-dark-card-2 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
            >
              <option value="fire">🔥 Fire</option>
              <option value="medical">🏥 Medical</option>
              <option value="security">👮 Security</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Building name or zone"
              className="w-full bg-dark-card-2 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details about the emergency"
              rows="3"
              className="w-full bg-dark-card-2 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-dark-card-2 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
            >
              <option value="CRITICAL">🔴 CRITICAL</option>
              <option value="HIGH">🟠 HIGH</option>
              <option value="MEDIUM">🟡 MEDIUM</option>
              <option value="LOW">🟢 LOW</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-danger hover:bg-red-700 rounded text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Report Emergency'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PanicButton;
