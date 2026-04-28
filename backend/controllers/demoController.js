import { generateId, simulateDelay } from '../utils/helpers.js';

// Demo state
let demoInProgress = false;
let demoProgress = {
  currentStep: 0,
  totalSteps: 0,
  status: 'idle',
  completedSteps: [],
  errors: []
};

const DEMO_SEQUENCE = [
  {
    step: 1,
    delay: 2000,
    action: 'createEmergency',
    scenario: { type: 'fire', location: 'Server Room', description: 'Smoke detected near server racks', priority: 'CRITICAL' }
  },
  {
    step: 2,
    delay: 5000,
    action: 'updateStatus',
    scenario: { status: 'IN_PROGRESS', assignedResponder: 'Capt. Sharma' }
  },
  {
    step: 3,
    delay: 3000,
    action: 'createEmergency',
    scenario: { type: 'medical', location: 'Cafeteria', description: 'Person collapsed, needs immediate assistance', priority: 'CRITICAL' }
  },
  {
    step: 4,
    delay: 4000,
    action: 'triggerPrediction',
    scenario: null
  },
  {
    step: 5,
    delay: 3000,
    action: 'createEmergency',
    scenario: { type: 'security', location: 'Main Gate', description: 'Suspicious activity detected', priority: 'HIGH' }
  },
  {
    step: 6,
    delay: 5000,
    action: 'generateReport',
    scenario: null
  },
  {
    step: 7,
    delay: 1000,
    action: 'completeDemo',
    scenario: null
  }
];

export const startDemo = async (req, res) => {
  try {
    if (demoInProgress) {
      return res.status(400).json({ error: 'Demo already in progress' });
    }

    demoInProgress = true;
    demoProgress = {
      currentStep: 0,
      totalSteps: DEMO_SEQUENCE.length,
      status: 'running',
      completedSteps: [],
      errors: []
    };

    res.json({
      success: true,
      message: 'Demo sequence started',
      totalSteps: DEMO_SEQUENCE.length,
      estimatedDuration: DEMO_SEQUENCE.reduce((sum, s) => sum + s.delay, 0) + 'ms'
    });

    // Execute demo sequence asynchronously
    executeDemoSequence();
  } catch (error) {
    demoInProgress = false;
    res.status(500).json({ error: error.message });
  }
};

export const getDemoProgress = (req, res) => {
  res.json({
    inProgress: demoInProgress,
    progress: demoProgress
  });
};

export const stopDemo = (req, res) => {
  demoInProgress = false;
  demoProgress.status = 'stopped';
  res.json({ message: 'Demo stopped' });
};

export const resetDemo = (req, res) => {
  demoInProgress = false;
  demoProgress = {
    currentStep: 0,
    totalSteps: 0,
    status: 'idle',
    completedSteps: [],
    errors: []
  };
  res.json({ message: 'Demo reset' });
};

async function executeDemoSequence() {
  try {
    for (const step of DEMO_SEQUENCE) {
      if (!demoInProgress) break;

      demoProgress.currentStep = step.step;

      // Wait before executing action
      await simulateDelay(step.delay);

      try {
        // Execute the action
        await executeDemoAction(step.action, step.scenario);
        demoProgress.completedSteps.push(step.step);
      } catch (error) {
        demoProgress.errors.push({
          step: step.step,
          error: error.message
        });
      }
    }

    demoInProgress = false;
    demoProgress.status = 'completed';
  } catch (error) {
    demoInProgress = false;
    demoProgress.status = 'failed';
    demoProgress.errors.push({ error: error.message });
  }
}

async function executeDemoAction(action, scenario) {
  switch (action) {
    case 'createEmergency':
      // Simulated emergency creation
      return {
        id: generateId(),
        ...scenario,
        status: 'ASSIGNED',
        createdAt: new Date().toISOString()
      };

    case 'updateStatus':
      // Simulated status update
      return {
        success: true,
        updatedStatus: scenario.status,
        timestamp: new Date().toISOString()
      };

    case 'triggerPrediction':
      // Simulated prediction trigger
      return {
        predictedZone: 'Laboratory',
        probabilityScore: 72,
        timeWindow: '15:00-17:00',
        incidentType: 'fire'
      };

    case 'generateReport':
      // Simulated report generation
      return {
        summary: 'Emergency response system operating normally',
        totalIncidents: 3,
        avgResponseTime: 210,
        slaCompliance: 87
      };

    case 'completeDemo':
      // Demo completion
      return { success: true, message: 'Demo completed successfully' };

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

export const getNotifications = (req, res) => {
  const notifications = [
    {
      id: generateId(),
      channel: 'sms',
      recipient: '5 recipients',
      status: 'DELIVERED',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      message: 'CRITICAL: Fire detected in Server Room'
    },
    {
      id: generateId(),
      channel: 'email',
      recipient: '3 recipients',
      status: 'DELIVERED',
      timestamp: new Date(Date.now() - 250000).toISOString(),
      message: 'Emergency Alert: Immediate Response Required'
    },
    {
      id: generateId(),
      channel: 'push',
      recipient: '12 devices',
      status: 'DELIVERED',
      timestamp: new Date(Date.now() - 200000).toISOString(),
      message: 'ALERT: Medical emergency in Cafeteria'
    },
    {
      id: generateId(),
      channel: 'pa_system',
      recipient: 'ALL',
      status: 'DELIVERED',
      timestamp: new Date(Date.now() - 150000).toISOString(),
      message: 'PA Broadcast: Evacuate affected areas'
    }
  ];

  res.json({
    totalSent: notifications.length,
    delivered: notifications.filter(n => n.status === 'DELIVERED').length,
    failed: notifications.filter(n => n.status === 'FAILED').length,
    successRate: 100,
    notifications
  });
};

export const getCampusNetwork = (req, res) => {
  const network = {
    campuses: [
      {
        id: 'main',
        name: 'Main Campus',
        address: 'Building A, Ground Floor',
        resources: { fireTeams: 2, medicalUnits: 3, securityPatrols: 5 },
        status: 'AVAILABLE',
        connectedCampuses: ['north', 'south'],
        distanceFromOthers: { north: '0.5km', south: '0.8km' },
        etaToOthers: { north: '3min', south: '5min' }
      },
      {
        id: 'north',
        name: 'North Block',
        address: 'Building B, North Wing',
        resources: { fireTeams: 1, medicalUnits: 2, securityPatrols: 3 },
        status: 'AVAILABLE',
        connectedCampuses: ['main'],
        distanceFromOthers: { main: '0.5km' },
        etaToOthers: { main: '3min' }
      },
      {
        id: 'south',
        name: 'South Complex',
        address: 'Building C, South Wing',
        resources: { fireTeams: 1, medicalUnits: 2, securityPatrols: 2 },
        status: 'PARTIAL',
        connectedCampuses: ['main'],
        distanceFromOthers: { main: '0.8km' },
        etaToOthers: { main: '5min' }
      }
    ],
    deployments: [
      {
        id: generateId(),
        from: 'main',
        to: 'north',
        resourceType: 'medicalUnit',
        status: 'IN_TRANSIT',
        eta: '2 minutes'
      }
    ]
  };

  res.json(network);
};
