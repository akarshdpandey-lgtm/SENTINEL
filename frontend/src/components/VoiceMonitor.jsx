import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mic, MicOff } from 'lucide-react';

const VoiceMonitor = ({ onEmergencyCreate }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState(0);
  const [detectedKeywords, setDetectedKeywords] = useState([]);

  const KEYWORDS = ['help', 'fire', 'blood', 'hurt', 'emergency', 'ambulance', 'critical', 'danger'];

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript.toLowerCase();
        if (event.results[i].isFinal) {
          final += transcriptPart;
        } else {
          interim += transcriptPart;
        }
      }

      const fullTranscript = final || interim;
      setTranscript(fullTranscript);

      // Detect keywords
      const found = KEYWORDS.filter(keyword => fullTranscript.includes(keyword));
      setDetectedKeywords(found);

      // Calculate urgency
      const urgency = Math.min(10, found.length * 2);
      setUrgencyLevel(urgency);

      // If critical keywords detected, auto-trigger alert
      if (found.length >= 2 && urgency >= 6) {
        triggerEmergency(fullTranscript, found);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      try {
        recognition.start();
      } catch (e) {
        console.log('Recognition already started');
      }
    }

    return () => {
      if (isListening) {
        try {
          recognition.stop();
        } catch (e) {
          console.log('Recognition already stopped');
        }
      }
    };
  }, [isListening]);

  const triggerEmergency = async (text, keywords) => {
    try {
      const response = await axios.post('http://localhost:5000/api/demo/analyze', {
        transcript: text,
        location: 'Voice Detected Location',
        emergencyType: keywords.includes('fire') ? 'fire' : keywords.includes('blood') || keywords.includes('hurt') ? 'medical' : 'security'
      });

      const emergencyType = keywords.includes('fire') ? 'fire' : keywords.includes('blood') || keywords.includes('hurt') ? 'medical' : 'security';

      const emergencyResponse = await axios.post('http://localhost:5000/api/emergency', {
        type: emergencyType,
        description: `Voice Emergency: ${text}`,
        location: 'Voice Detected Location',
        priority: 'CRITICAL',
        transcript: text,
        latitude: 28.6139,
        longitude: 77.2090
      });

      onEmergencyCreate?.({
        ...emergencyResponse.data,
        aiAnalysis: response.data,
        detectedKeywords: keywords
      });

      setTranscript('');
      setDetectedKeywords([]);
      setUrgencyLevel(0);
    } catch (error) {
      console.error('Error triggering emergency:', error);
    }
  };

  return (
    <div className="bg-dark-card border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {isListening ? (
            <>
              <Mic className="w-5 h-5 text-danger animate-pulse" />
              <span>Listening...</span>
            </>
          ) : (
            <>
              <MicOff className="w-5 h-5 text-gray-500" />
              <span>Voice Monitor</span>
            </>
          )}
        </h3>
        <button
          onClick={() => setIsListening(!isListening)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            isListening
              ? 'bg-danger text-white hover:bg-red-700'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {isListening ? 'Stop' : 'Start'}
        </button>
      </div>

      {isListening && (
        <div className="flex gap-1 items-end h-12 mb-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{ height: `${20 + Math.random() * 80}%` }}
            />
          ))}
        </div>
      )}

      {transcript && (
        <div className="mb-4 p-3 bg-dark-card-2 rounded border border-gray-600">
          <p className="text-sm text-gray-400 mb-1">Transcript:</p>
          <p className="text-white">"{transcript}"</p>
        </div>
      )}

      {detectedKeywords.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Keywords Detected:</p>
          <div className="flex flex-wrap gap-2">
            {detectedKeywords.map((keyword, idx) => (
              <span key={idx} className="px-3 py-1 bg-danger bg-opacity-20 text-danger rounded-full text-sm border border-danger border-opacity-30">
                {keyword}
              </span>
            ))}
          </div>
          <div className="mt-3 bg-danger bg-opacity-10 border border-danger border-opacity-30 rounded p-3">
            <p className="text-danger font-semibold mb-2">Urgency: {urgencyLevel}/10</p>
            <div className="w-full bg-dark-card-2 rounded-full h-2">
              <div
                className="bg-danger rounded-full h-2 transition-all"
                style={{ width: `${(urgencyLevel / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceMonitor;
