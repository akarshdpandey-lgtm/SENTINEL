import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import TimerCard from '../components/TimerCard';
import EscalationLadder from '../components/EscalationLadder';

const AlertDetail = ({ emergency, onBack, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(emergency.status);
  const [responder, setResponder] = useState(emergency.assignedResponder || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setStatus(emergency.status);
    setResponder(emergency.assignedResponder || '');
  }, [emergency]);

  const handleStatusUpdate = async (newStatus) => {
    setError('');
    setUpdating(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/emergency/${emergency.id}`,
        { status: newStatus, assignedResponder: responder }
      );
      setStatus(newStatus);
      onUpdate?.(response.data);
    } catch (error) {
      console.error('Error updating emergency:', error);
      setError(error.response?.data?.error || 'Unable to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const escalateEmergency = async () => {
    setError('');
    const newLevel = Math.min(4, (emergency.escalationLevel || 0) + 1);
    setUpdating(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/emergency/${emergency.id}`,
        { escalationLevel: newLevel }
      );
      onUpdate?.(response.data);
    } catch (error) {
      console.error('Error escalating:', error);
      setError(error.response?.data?.error || 'Unable to escalate emergency. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const statusClassName = (value) => {
    if (value === 'IN_PROGRESS') return 'bg-info bg-opacity-20 text-info border-info border-opacity-50';
    if (value === 'RESOLVED') return 'bg-success bg-opacity-20 text-success border-success border-opacity-50';
    if (value === 'SLA_BREACHED') return 'bg-danger bg-opacity-20 text-danger border-danger border-opacity-50';
    return 'bg-warning bg-opacity-20 text-warning border-warning border-opacity-50';
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-primary hover:text-white transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      {/* Emergency Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">
                    {emergency.type === 'fire' ? '🔥' : emergency.type === 'medical' ? '🏥' : '👮'}
                  </span>
                  <div>
                    <p className="text-gray-500 text-sm">Emergency Type</p>
                    <p className="text-2xl font-bold capitalize">{emergency.type}</p>
                  </div>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                emergency.priority === 'CRITICAL'
                  ? 'bg-danger bg-opacity-20 text-danger border-danger border-opacity-50'
                  : emergency.priority === 'HIGH'
                  ? 'bg-warning bg-opacity-20 text-warning border-warning border-opacity-50'
                  : 'bg-info bg-opacity-20 text-info border-info border-opacity-50'
              }`}>
                {emergency.priority} PRIORITY
              </span>
            </div>
            <div className={`inline-flex px-4 py-2 rounded-lg text-sm font-semibold border mb-6 ${statusClassName(emergency.status)}`}>
              {emergency.status.replace('_', ' ')}
            </div>

            {/* Location & Description */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-700">
              <div>
                <p className="text-gray-500 text-sm mb-1">📍 Location</p>
                <p className="text-lg font-semibold">{emergency.location}</p>
                {emergency.matchedZone && (
                  <p className="text-sm text-warning mt-1">⚠️ High-risk zone detected: {emergency.matchedZone}</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">📝 Description</p>
                <p className="text-gray-300">{emergency.description}</p>
              </div>
              {emergency.transcript && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">🎤 Voice Transcript</p>
                  <p className="text-gray-300 italic">"{emergency.transcript}"</p>
                </div>
              )}
            </div>

            {/* Status Management */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Current Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-dark-card-2 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-primary mb-3"
                >
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="SLA_BREACHED">SLA Breached</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Assigned Responder</label>
                <input
                  type="text"
                  value={responder}
                  onChange={(e) => setResponder(e.target.value)}
                  placeholder="Name of responder"
                  className="w-full bg-dark-card-2 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary mb-3"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(status)}
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-red-700 text-white rounded font-semibold transition disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  onClick={escalateEmergency}
                  disabled={updating || emergency.escalationLevel >= 4}
                  className="flex-1 px-4 py-2 bg-danger hover:bg-red-800 text-white rounded font-semibold transition disabled:opacity-50"
                >
                  🔼 Escalate
                </button>
              </div>
              {error && (
                <p className="text-sm text-danger">{error}</p>
              )}
            </div>
          </div>

          {/* Notifications */}
          {emergency.notificationChannels && (
            <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Notification Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {emergency.notificationChannels.map((ch) => (
                  <div key={ch.id} className="bg-dark-card-2 rounded p-3 border border-gray-700">
                    <p className="text-sm font-semibold capitalize mb-1">{ch.id}</p>
                    <p className={`text-xs font-semibold ${ch.status === 'DELIVERED' ? 'text-success' : 'text-danger'}`}>
                      ✓ {ch.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4">Timeline</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="font-semibold">Emergency Created</p>
                  <p className="text-gray-500">{new Date(emergency.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {emergency.responseTime && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2" />
                  <div>
                    <p className="font-semibold">Response Time</p>
                    <p className="text-gray-500">{emergency.responseTime}s after creation</p>
                  </div>
                </div>
              )}
              {emergency.resolvedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2" />
                  <div>
                    <p className="font-semibold">Emergency Resolved</p>
                    <p className="text-gray-500">{new Date(emergency.resolvedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <TimerCard emergency={emergency} />
          <EscalationLadder emergency={emergency} />
        </div>
      </div>
    </div>
  );
};

export default AlertDetail;
