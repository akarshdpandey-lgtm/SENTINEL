import { simulateDelay } from '../utils/helpers.js';

// In-memory analytics storage
const analyticsData = {
  predictions: [],
  historicalIncidents: [],
  heatmapData: {},
  slaMetrics: {}
};

// Sample incident history
const SAMPLE_INCIDENTS = [
  { zone: 'Block A', type: 'fire', hour: 8, severity: 8 },
  { zone: 'Cafeteria', type: 'medical', hour: 12, severity: 6 },
  { zone: 'Server Room', type: 'fire', hour: 10, severity: 9 },
  { zone: 'Block B', type: 'security', hour: 14, severity: 5 },
  { zone: 'Laboratory', type: 'fire', hour: 16, severity: 7 },
  { zone: 'Dormitory A', type: 'medical', hour: 19, severity: 4 },
  { zone: 'Main Gate', type: 'security', hour: 9, severity: 3 },
  { zone: 'Cafeteria', type: 'medical', hour: 13, severity: 5 }
];

export const getPredictions = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;

    // Simulate AI prediction analysis
    await simulateDelay(300);

    // Generate grid-based heatmap data
    const ZONES = [
      'Block A', 'Block B', 'Cafeteria', 'Parking North',
      'Main Gate', 'Server Room', 'Laboratory',
      'Library', 'Dormitory A', 'Auditorium', 'Gym'
    ];

    const predictions = {
      timeRange,
      nextPrediction: {
        zone: ZONES[Math.floor(Math.random() * ZONES.length)],
        probabilityScore: Math.floor(Math.random() * 40) + 60,
        timeWindow: `${Math.floor(Math.random() * 20) + 8}:00-${Math.floor(Math.random() * 20) + 12}:00`,
        incidentType: ['fire', 'medical', 'security'][Math.floor(Math.random() * 3)],
        recommendation: 'Increase team readiness in predicted zone',
        confidenceLevel: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
      },
      peakHours: [9, 12, 14, 16, 18],
      hotZones: ['Server Room', 'Cafeteria', 'Laboratory'],
      historicalTrends: {
        avgIncidentsPerDay: 3.2,
        avgResponseTime: 240,
        mostCommonType: 'medical'
      },
      predictions24h: generatePredictions24h()
    };

    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHeatmapData = (req, res) => {
  try {
    const GRID = {
      columns: 7,
      rows: 3,
      zones: [
        'Block A', 'Block B', 'Cafeteria', 'Parking North',
        'Main Gate', 'Server Room', 'Laboratory',
        'Library', 'Dormitory A', 'Auditorium', 'Gym',
        'Reception', 'Floor 2 Office', 'Basement Storage',
        'Garden Area', 'Parking South', 'Administration',
        'Faculty Block', 'Student Center', 'Rooftop Terrace', 'Emergency Exit'
      ]
    };

    const heatmapData = GRID.zones.map((zone, index) => {
      const incidents = SAMPLE_INCIDENTS.filter(i => i.zone === zone || Math.random() > 0.6);
      const intensity = calculateZoneIntensity(incidents);

      return {
        id: index,
        zone,
        row: Math.floor(index / GRID.columns),
        col: index % GRID.columns,
        incidentCount: incidents.length,
        severity: incidents.reduce((sum, i) => sum + i.severity, 0) / Math.max(incidents.length, 1),
        intensity,
        lastIncident: incidents.length > 0 ? incidents[incidents.length - 1].type : null
      };
    });

    res.json({
      gridConfig: GRID,
      heatmapData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnalytics = (req, res) => {
  try {
    const { from, to } = req.query;

    const analytics = {
      timeRange: { from: from || 'N/A', to: to || 'N/A' },
      responseMetrics: {
        totalResponses: 24,
        averageResponseTime: 243,
        fastestResponse: 45,
        slowestResponse: 890,
        onTimeRate: 87.5
      },
      incidentMetrics: {
        total: 24,
        byType: {
          fire: 8,
          medical: 12,
          security: 4
        },
        byPriority: {
          CRITICAL: 3,
          HIGH: 8,
          MEDIUM: 10,
          LOW: 3
        }
      },
      teamMetrics: {
        fire: { assigned: 8, completed: 7, avgTime: 210 },
        medical: { assigned: 12, completed: 11, avgTime: 280 },
        security: { assigned: 4, completed: 4, avgTime: 160 }
      },
      slaCompliance: 87.5,
      notificationMetrics: {
        delivered: 144,
        failed: 6,
        successRate: 96
      },
      predictions: {
        nextIncidentProbability: 68,
        predictedZone: 'Laboratory',
        timeWindow: '14:00-16:00'
      }
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getZoneStats = (req, res) => {
  try {
    const zoneStats = {
      'Server Room': {
        totalIncidents: 12,
        avgResponseTime: 120,
        severity: 8.5,
        riskLevel: 'high',
        lastIncident: '2 hours ago'
      },
      'Chemistry Laboratory': {
        totalIncidents: 8,
        avgResponseTime: 150,
        severity: 7.2,
        riskLevel: 'high',
        lastIncident: '4 hours ago'
      },
      'Student Dormitory A': {
        totalIncidents: 15,
        avgResponseTime: 240,
        severity: 5.1,
        riskLevel: 'medium',
        lastIncident: '1 hour ago'
      },
      'Cafeteria': {
        totalIncidents: 6,
        avgResponseTime: 180,
        severity: 4.8,
        riskLevel: 'low',
        lastIncident: '3 hours ago'
      }
    };

    res.json(zoneStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function generatePredictions24h() {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push({
      hour: i,
      probability: Math.floor(Math.random() * 100),
      riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
    });
  }
  return hours;
}

function calculateZoneIntensity(incidents) {
  if (incidents.length === 0) return 'none';
  const avgSeverity = incidents.reduce((sum, i) => sum + i.severity, 0) / incidents.length;
  
  if (incidents.length >= 5 || avgSeverity >= 8) return 'critical';
  if (incidents.length >= 3 || avgSeverity >= 6) return 'high';
  if (incidents.length >= 1 || avgSeverity >= 4) return 'medium';
  return 'low';
}
