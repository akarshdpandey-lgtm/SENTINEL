import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlayCircle, StopCircle, RotateCcw } from 'lucide-react';

const DemoControl = ({ onClose }) => {
  const [demoRunning, setDemoRunning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [totalSteps, setTotalSteps] = useState(7);

  useEffect(() => {
    let interval;
    if (demoRunning) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/demo/progress');
          setProgress(response.data.progress);

          if (response.data.progress.status === 'completed') {
            setDemoRunning(false);
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [demoRunning]);

  const handleStartDemo = async () => {
    setDemoRunning(true);
    try {
      await axios.post('http://localhost:5000/api/demo/start');
    } catch (error) {
      console.error('Error starting demo:', error);
      setDemoRunning(false);
    }
  };

  const handleStopDemo = async () => {
    try {
      await axios.post('http://localhost:5000/api/demo/stop');
      setDemoRunning(false);
      setProgress(null);
    } catch (error) {
      console.error('Error stopping demo:', error);
    }
  };

  const handleResetDemo = async () => {
    try {
      await axios.post('http://localhost:5000/api/demo/reset');
      setProgress(null);
    } catch (error) {
      console.error('Error resetting demo:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="bg-dark-card rounded-lg p-8 border border-gray-700">
        <h2 className="text-3xl font-bold mb-2">🎬 Demo Mode</h2>
        <p className="text-gray-400 mb-8">
          Automated demonstration of all 10 SENTINEL features with simulated emergency scenarios
        </p>

        {/* Status */}
        <div className="bg-dark-card-2 rounded-lg p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Demo Status</h3>
            <span className={`px-4 py-2 rounded-full font-semibold ${
              demoRunning
                ? 'bg-warning bg-opacity-20 text-warning border border-warning border-opacity-50'
                : 'bg-gray-700 text-gray-300 border border-gray-600'
            }`}>
              {demoRunning ? '🔴 Running' : '⚪ Ready'}
            </span>
          </div>

          {progress && (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">Progress</p>
                  <p className="text-sm font-semibold">
                    {progress.completedSteps.length} / {progress.totalSteps} steps
                  </p>
                </div>
                <div className="w-full bg-dark rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-primary transition-all"
                    style={{
                      width: `${(progress.completedSteps.length / progress.totalSteps) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">Steps:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                    <div
                      key={step}
                      className={`p-2 rounded text-sm font-semibold border transition ${
                        progress.completedSteps.includes(step)
                          ? 'bg-success bg-opacity-20 text-success border-success border-opacity-50'
                          : step === progress.currentStep
                          ? 'bg-warning bg-opacity-20 text-warning border-warning border-opacity-50 animate-pulse'
                          : 'bg-gray-700 text-gray-400 border-gray-600'
                      }`}
                    >
                      {progress.completedSteps.includes(step) ? '✓' : '○'} Step {step}
                    </div>
                  ))}
                </div>
              </div>

              {progress.errors.length > 0 && (
                <div className="mt-4 p-3 bg-danger bg-opacity-10 border border-danger border-opacity-30 rounded">
                  <p className="text-danger font-semibold text-sm">⚠️ Errors occurred:</p>
                  <ul className="text-xs text-gray-300 mt-2 space-y-1">
                    {progress.errors.map((err, idx) => (
                      <li key={idx}>• {err.error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Demo Stages */}
        <div className="bg-info bg-opacity-10 border border-info border-opacity-30 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-info mb-4">📋 Demo Sequence</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>1️⃣ Create Fire Emergency (Server Room)</p>
            <p>2️⃣ Update Status: In Progress</p>
            <p>3️⃣ Create Medical Emergency (Cafeteria)</p>
            <p>4️⃣ Generate Predictions</p>
            <p>5️⃣ Create Security Emergency (Main Gate)</p>
            <p>6️⃣ Generate Report</p>
            <p>7️⃣ Complete Demo</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          {!demoRunning ? (
            <button
              onClick={handleStartDemo}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-red-700 text-white rounded-lg font-semibold transition"
            >
              <PlayCircle className="w-5 h-5" />
              Start Demo
            </button>
          ) : (
            <button
              onClick={handleStopDemo}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-danger hover:bg-red-800 text-white rounded-lg font-semibold transition"
            >
              <StopCircle className="w-5 h-5" />
              Stop Demo
            </button>
          )}

          <button
            onClick={handleResetDemo}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Features Showcase */}
        <div className="bg-dark-card-2 rounded-lg p-6 border border-gray-700 mb-8">
          <h3 className="font-semibold mb-4">✨ Features Demonstrated</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-lg">🎙️</span>
              <div>
                <p className="font-semibold">Voice Detection</p>
                <p className="text-gray-400 text-xs">Emergency transcripts analyzed</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <p className="font-semibold">AI Analysis</p>
                <p className="text-gray-400 text-xs">Gemini generates insights</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">👥</span>
              <div>
                <p className="font-semibold">Team Load Balancing</p>
                <p className="text-gray-400 text-xs">Resources allocated automatically</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📍</span>
              <div>
                <p className="font-semibold">Geo-Fenced Zones</p>
                <p className="text-gray-400 text-xs">High-risk areas escalate priority</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🔮</span>
              <div>
                <p className="font-semibold">Predictive Analytics</p>
                <p className="text-gray-400 text-xs">24-hour risk forecast generated</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🌐</span>
              <div>
                <p className="font-semibold">Cross-Campus Network</p>
                <p className="text-gray-400 text-xs">Resource sharing demonstrated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
        >
          Close Demo
        </button>
      </div>
    </div>
  );
};

export default DemoControl;
