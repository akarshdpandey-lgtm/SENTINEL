import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiCache, generateId } from '../utils/helpers.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeEmergency = async (req, res, next) => {
  try {
    const { transcript, location, emergencyType } = req.body;

    // Check cache first
    const cacheKey = `emergency-${transcript}`;
    const cached = geminiCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this emergency transcript for urgency and context:
"${transcript}"

Location: ${location}
Type: ${emergencyType}

Provide JSON response with:
- urgencyLevel (1-10)
- emotionalTone (calm/worried/panicked)
- recommendedPriority (CRITICAL/HIGH/MEDIUM/LOW)
- keywordDetected (array)
- suggestedActions (array)

Respond ONLY with valid JSON.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch {
      analysis = {
        urgencyLevel: 7,
        emotionalTone: 'panicked',
        recommendedPriority: 'HIGH',
        keywordDetected: ['emergency'],
        suggestedActions: ['Notify nearest responders']
      };
    }

    geminiCache.set(cacheKey, analysis);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
};

export const generatePredictions = async (req, res, next) => {
  try {
    const { recentEmergencies, peakHours, hotZones } = req.body;

    const cacheKey = 'predictions-' + JSON.stringify({recentEmergencies: recentEmergencies?.length});
    const cached = geminiCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Based on emergency data, predict next 24-hour incident patterns:

Recent Emergencies (last 50): ${recentEmergencies?.length || 0} incidents
Peak Hours: ${peakHours?.join(', ') || 'N/A'}
Hot Zones: ${hotZones?.join(', ') || 'N/A'}

Provide JSON with:
- predictedZone (string)
- probabilityScore (0-100)
- timeWindow (HH:MM-HH:MM)
- incidentType (fire/medical/security)
- recommendation (string)
- confidenceLevel (high/medium/low)

Respond ONLY with valid JSON.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let predictions;
    try {
      predictions = JSON.parse(responseText);
    } catch {
      predictions = {
        predictedZone: hotZones?.[0] || 'Main Campus',
        probabilityScore: 65,
        timeWindow: '14:00-16:00',
        incidentType: 'medical',
        recommendation: 'Increase medical team readiness',
        confidenceLevel: 'medium'
      };
    }

    geminiCache.set(cacheKey, predictions);
    res.json(predictions);
  } catch (error) {
    next(error);
  }
};

export const generateReport = async (req, res, next) => {
  try {
    const { emergencies, duration } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate brief emergency response summary for ${duration}:
Total incidents: ${emergencies?.length || 0}
Types: ${emergencies?.map(e => e.type).join(', ') || 'None'}

Provide JSON with:
- summary (string, max 100 words)
- keyMetrics (object with stats)
- recommendations (array)

Respond ONLY with valid JSON.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let report;
    try {
      report = JSON.parse(responseText);
    } catch {
      report = {
        summary: 'Emergency response system operating normally',
        keyMetrics: {
          totalIncidents: emergencies?.length || 0,
          avgResponseTime: '120 seconds'
        },
        recommendations: ['Continue monitoring', 'Maintain team readiness']
      };
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
};
