import React from 'react';
import { ChevronUp } from 'lucide-react';

const EscalationLadder = ({ emergency }) => {
  const levels = [
    {
      level: 0,
      title: 'Staff Assigned',
      target: 'Assigned Responders',
      action: 'Respond within SLA'
    },
    {
      level: 1,
      title: 'Supervisor Alert',
      target: 'Team Lead, Shift Supervisor',
      action: 'Provide ETA update'
    },
    {
      level: 2,
      title: 'Department Head',
      target: 'Dept Head, Operations Manager',
      action: 'Approve resource reallocation'
    },
    {
      level: 3,
      title: 'Facility Director',
      target: 'Facility Director, Security Chief',
      action: 'Authorize emergency override'
    },
    {
      level: 4,
      title: 'External Services',
      target: 'Fire Dept, Police, Ambulance',
      action: 'Dispatch external assistance'
    }
  ];

  const currentLevel = emergency?.escalationLevel || 0;

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold mb-6">Escalation Ladder</h3>

      <div className="space-y-3">
        {levels.map((level, idx) => (
          <div
            key={level.level}
            className={`rounded-lg p-4 border-l-4 transition ${
              idx <= currentLevel
                ? 'border-l-primary bg-dark-card-2 border border-primary border-opacity-30'
                : 'border-l-gray-600 bg-dark-card-2 border border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    idx <= currentLevel ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {level.level}
                  </div>
                  <h4 className="font-semibold">{level.title}</h4>
                </div>
                <p className="text-sm text-gray-400 mb-1">Notified: {level.target}</p>
                <p className="text-xs text-gray-500 italic">{level.action}</p>
              </div>
              {idx === currentLevel && (
                <div className="flex items-center gap-1 text-primary font-semibold text-sm">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Active
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {currentLevel > 0 && (
        <div className="mt-6 p-4 bg-warning bg-opacity-10 border border-warning border-opacity-30 rounded">
          <p className="text-warning font-semibold mb-2">⚠️ Escalation in Progress</p>
          <p className="text-sm text-gray-300">
            This emergency has been escalated {currentLevel} level{currentLevel > 1 ? 's' : ''}. 
            Increased oversight and resources are now engaged.
          </p>
        </div>
      )}
    </div>
  );
};

export default EscalationLadder;
