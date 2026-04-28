import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const TimerCard = ({ emergency, onSLABreach }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);
  const [breached, setBreached] = useState(false);

  useEffect(() => {
    if (!emergency || emergency.status === 'RESOLVED') return;

    const threshold = emergency.slaThreshold?.responseTime || 600;
    const createdAt = new Date(emergency.createdAt);
    const now = new Date();
    const elapsed = (now - createdAt) / 1000;
    const remaining = Math.max(0, threshold - elapsed);

    setTimeRemaining(remaining);
    setPercentComplete((elapsed / threshold) * 100);

    if (remaining <= 0 && !breached) {
      setBreached(true);
      onSLABreach?.(emergency);
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newRemaining = Math.max(0, prev - 1);
        setPercentComplete(((threshold - newRemaining) / threshold) * 100);
        return newRemaining;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [emergency, breached, onSLABreach]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (breached) return 'border-danger bg-danger bg-opacity-10';
    if (percentComplete >= 90) return 'border-danger bg-danger bg-opacity-5';
    if (percentComplete >= 80) return 'border-warning bg-warning bg-opacity-5';
    return 'border-gray-700';
  };

  return (
    <div className={`bg-dark-card rounded-lg p-4 border-2 transition ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${breached ? 'text-danger animate-pulse-glow' : 'text-primary'}`} />
          <h4 className="font-semibold">SLA Timer</h4>
        </div>
        <span className={`text-sm px-2 py-1 rounded ${
          breached ? 'bg-danger bg-opacity-20 text-danger' : 'bg-gray-700 text-gray-300'
        }`}>
          {emergency.priority}
        </span>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-mono font-bold text-center">
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="w-full bg-dark-card-2 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all ${
              percentComplete >= 90 ? 'bg-danger animate-strobe' : percentComplete >= 80 ? 'bg-warning' : 'bg-success'
            }`}
            style={{ width: `${Math.min(percentComplete, 100)}%` }}
          />
        </div>
      </div>

      {breached && (
        <div className="flex items-center gap-2 text-danger font-semibold text-sm">
          <AlertTriangle className="w-4 h-4" />
          SLA BREACHED - ESCALATION TRIGGERED
        </div>
      )}

      {percentComplete >= 80 && !breached && (
        <div className="text-warning text-sm font-semibold">
          ⚠️ Critical: {Math.ceil(timeRemaining / 60)} minutes until breach
        </div>
      )}
    </div>
  );
};

export default TimerCard;
