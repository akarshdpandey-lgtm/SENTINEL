import { generateId, haversineDistance, SLA_THRESHOLDS } from '../utils/helpers.js';

// In-memory emergency storage
const emergencies = [];

// Geo-fenced high-risk zones
const HIGH_RISK_ZONES = [
  {
    name: 'Server Room',
    lat: 28.6139,
    lng: 77.2090,
    radiusMeters: 15,
    requiredResponseTime: 120,
    extraNotifiedParties: ['IT Admin', 'Facility Manager'],
    automatedActions: ['shutoffPower', 'isolateCircuit', 'evacuateArea']
  },
  {
    name: 'Chemistry Laboratory',
    lat: 28.6145,
    lng: 77.2095,
    radiusMeters: 20,
    requiredResponseTime: 180,
    extraNotifiedParties: ['Safety Officer', 'Chem Specialist'],
    automatedActions: ['activateVentilation', 'soundGasAlarm', 'evacuateFloor']
  },
  {
    name: 'Student Dormitory A',
    lat: 28.6130,
    lng: 77.2080,
    radiusMeters: 30,
    requiredResponseTime: 240,
    extraNotifiedParties: ['Dorm Counselor', 'Medical First Aid'],
    automatedActions: ['unlockExits', 'pageAllResidents', 'openCorridorLights']
  }
];

export const createEmergency = async (req, res, next) => {
  try {
    const { type, description, location, priority, latitude, longitude, transcript } = req.body;

    // Check for geo-fence match
    let matchedZone = null;
    let escalatedPriority = priority;
    let extraActions = [];

    if (latitude && longitude) {
      matchedZone = HIGH_RISK_ZONES.find(zone => {
        const distance = haversineDistance(latitude, longitude, zone.lat, zone.lng);
        return distance <= zone.radiusMeters;
      });

      if (matchedZone) {
        escalatedPriority = escalatePriority(priority);
        extraActions = matchedZone.automatedActions;
      }
    }

    const emergency = {
      id: generateId(),
      type,
      description,
      location,
      priority: escalatedPriority,
      transcript,
      latitude,
      longitude,
      matchedZone: matchedZone?.name || null,
      extraActions,
      status: 'ASSIGNED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTeam: null,
      assignedResponder: null,
      escalationLevel: 0,
      responseTime: null,
      slaThreshold: SLA_THRESHOLDS[escalatedPriority],
      notificationChannels: [
        { id: 'sms', status: 'DELIVERED', deliveredAt: new Date().toISOString() },
        { id: 'email', status: 'DELIVERED', deliveredAt: new Date().toISOString() },
        { id: 'pa_system', status: 'DELIVERED', deliveredAt: new Date().toISOString() },
        { id: 'push', status: 'DELIVERED', deliveredAt: new Date().toISOString() },
        { id: 'led_signage', status: 'DELIVERED', deliveredAt: new Date().toISOString() },
        { id: 'slack', status: 'DELIVERED', deliveredAt: new Date().toISOString() }
      ]
    };

    emergencies.push(emergency);
    res.status(201).json(emergency);
  } catch (error) {
    next(error);
  }
};

export const getEmergencies = (req, res) => {
  const { status, type, priority } = req.query;
  let filtered = emergencies;

  if (status) filtered = filtered.filter(e => e.status === status);
  if (type) filtered = filtered.filter(e => e.type === type);
  if (priority) filtered = filtered.filter(e => e.priority === priority);

  res.json(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
};

export const getEmergency = (req, res) => {
  const emergency = emergencies.find(e => e.id === req.params.id);
  if (!emergency) {
    return res.status(404).json({ error: 'Emergency not found' });
  }
  res.json(emergency);
};

export const updateEmergency = (req, res) => {
  const emergency = emergencies.find(e => e.id === req.params.id);
  if (!emergency) {
    return res.status(404).json({ error: 'Emergency not found' });
  }

  const { status, assignedTeam, assignedResponder, escalationLevel, notes } = req.body;

  if (status) emergency.status = status;
  if (assignedTeam !== undefined) emergency.assignedTeam = assignedTeam;
  if (assignedResponder !== undefined) emergency.assignedResponder = assignedResponder;
  if (escalationLevel !== undefined) emergency.escalationLevel = escalationLevel;
  if (notes) emergency.notes = notes;

  if (status === 'IN_PROGRESS' && !emergency.responseTime) {
    emergency.responseTime = Math.floor((new Date() - new Date(emergency.createdAt)) / 1000);
  }

  if (status === 'RESOLVED' && !emergency.resolvedAt) {
    emergency.resolvedAt = new Date().toISOString();
    if (!emergency.responseTime) {
      emergency.responseTime = Math.floor((new Date(emergency.resolvedAt) - new Date(emergency.createdAt)) / 1000);
    }
  }

  emergency.updatedAt = new Date().toISOString();
  res.json(emergency);
};

export const deleteEmergency = (req, res) => {
  const index = emergencies.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Emergency not found' });
  }

  emergencies.splice(index, 1);
  res.json({ message: 'Emergency deleted' });
};

export const getEmergencyStats = (req, res) => {
  const stats = {
    total: emergencies.length,
    byPriority: {
      CRITICAL: emergencies.filter(e => e.priority === 'CRITICAL').length,
      HIGH: emergencies.filter(e => e.priority === 'HIGH').length,
      MEDIUM: emergencies.filter(e => e.priority === 'MEDIUM').length,
      LOW: emergencies.filter(e => e.priority === 'LOW').length
    },
    byStatus: {
      ASSIGNED: emergencies.filter(e => e.status === 'ASSIGNED').length,
      IN_PROGRESS: emergencies.filter(e => e.status === 'IN_PROGRESS').length,
      RESOLVED: emergencies.filter(e => e.status === 'RESOLVED').length,
      SLA_BREACHED: emergencies.filter(e => e.status === 'SLA_BREACHED').length
    },
    byType: {
      fire: emergencies.filter(e => e.type === 'fire').length,
      medical: emergencies.filter(e => e.type === 'medical').length,
      security: emergencies.filter(e => e.type === 'security').length
    },
    avgResponseTime: getAvgResponseTime(),
    slaComplianceRate: getSLACompliance()
  };

  res.json(stats);
};

function escalatePriority(current) {
  const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const index = levels.indexOf(current);
  return index < 3 ? levels[index + 1] : 'CRITICAL';
}

function getAvgResponseTime() {
  const completed = emergencies.filter(e => e.responseTime);
  if (completed.length === 0) return 0;
  const sum = completed.reduce((acc, e) => acc + e.responseTime, 0);
  return Math.floor(sum / completed.length);
}

function getSLACompliance() {
  const completed = emergencies.filter(e => e.responseTime);
  if (completed.length === 0) return 100;
  const onTime = completed.filter(e => {
    const threshold = e.slaThreshold?.responseTime || 600;
    return e.responseTime <= threshold;
  });
  return Math.round((onTime.length / completed.length) * 100);
}
