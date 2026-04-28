import { generateId } from '../utils/helpers.js';

// In-memory team state
const teams = {
  fire: {
    name: 'Fire Response Team',
    totalMembers: 10,
    members: generateTeamMembers(10),
    maxConcurrentAssignments: 5,
    avgResponseTime: 180,
    status: 'AVAILABLE'
  },
  medical: {
    name: 'Medical Team',
    totalMembers: 8,
    members: generateTeamMembers(8),
    maxConcurrentAssignments: 4,
    avgResponseTime: 240,
    status: 'AVAILABLE'
  },
  security: {
    name: 'Security Team',
    totalMembers: 12,
    members: generateTeamMembers(12),
    maxConcurrentAssignments: 6,
    avgResponseTime: 150,
    status: 'AVAILABLE'
  }
};

function generateTeamMembers(count) {
  const members = [];
  for (let i = 0; i < count; i++) {
    members.push({
      id: generateId(),
      name: `Team Member ${i + 1}`,
      skillLevel: ['Junior', 'Senior', 'Expert'][Math.floor(Math.random() * 3)],
      experienceYears: Math.floor(Math.random() * 20) + 1,
      currentLoad: 0,
      activeAssignments: 0,
      status: 'AVAILABLE'
    });
  }
  return members;
}

export const getTeams = (req, res) => {
  const teamsInfo = Object.entries(teams).map(([type, team]) => {
    const busyCount = team.members.filter(m => m.activeAssignments > 0).length;
    const totalLoad = team.members.reduce((sum, m) => sum + m.activeAssignments, 0);
    const capacityPercent = (totalLoad / (team.maxConcurrentAssignments * team.totalMembers)) * 100;

    return {
      type,
      ...team,
      busyCount,
      totalLoad,
      capacityPercent,
      backupRequestAvailable: capacityPercent > 80
    };
  });

  res.json(teamsInfo);
};

export const getTeam = (req, res) => {
  const team = teams[req.params.type];
  if (!team) {
    return res.status(404).json({ error: 'Team type not found' });
  }

  const busyCount = team.members.filter(m => m.activeAssignments > 0).length;
  const totalLoad = team.members.reduce((sum, m) => sum + m.activeAssignments, 0);
  const capacityPercent = (totalLoad / (team.maxConcurrentAssignments * team.totalMembers)) * 100;

  res.json({
    type: req.params.type,
    ...team,
    busyCount,
    totalLoad,
    capacityPercent,
    backupRequestAvailable: capacityPercent > 80
  });
};

export const assignTeam = (req, res) => {
  try {
    const { emergencyType, priority, location } = req.body;
    const teamType = mapEmergencyToTeam(emergencyType);
    const team = teams[teamType];

    if (!team) {
      return res.status(400).json({ error: 'No team available for this emergency type' });
    }

    // Find member with lowest load
    const availableMember = team.members.reduce((min, member) => {
      const memberLoad = calculateLoad(member);
      const minLoad = calculateLoad(min);
      return memberLoad < minLoad ? member : min;
    });

    // Assign emergency to member
    const severityWeight = { CRITICAL: 2, HIGH: 1.5, MEDIUM: 1, LOW: 0.5 };
    availableMember.activeAssignments += 1;
    availableMember.currentLoad += (severityWeight[priority] || 1);
    availableMember.status = availableMember.activeAssignments > 0 ? 'BUSY' : 'AVAILABLE';

    // Update team status
    const totalLoad = team.members.reduce((sum, m) => sum + m.activeAssignments, 0);
    const capacityPercent = (totalLoad / (team.maxConcurrentAssignments * team.totalMembers)) * 100;
    team.status = capacityPercent > 80 ? 'OVERLOADED' : capacityPercent > 50 ? 'PARTIAL' : 'AVAILABLE';

    res.json({
      success: true,
      assignedTo: availableMember.name,
      memberId: availableMember.id,
      teamType,
      estimatedArrival: team.avgResponseTime,
      teamStatus: team.status,
      currentLoad: availableMember.currentLoad,
      eta: `${team.avgResponseTime} seconds`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTeamMember = (req, res) => {
  try {
    const { teamType, memberId } = req.params;
    const { status, activeAssignments } = req.body;

    const team = teams[teamType];
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const member = team.members.find(m => m.id === memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (status) member.status = status;
    if (activeAssignments !== undefined) {
      member.activeAssignments = Math.max(0, activeAssignments);
      member.currentLoad = member.activeAssignments * 1.2;
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const requestBackup = (req, res) => {
  try {
    const { fromTeamType, emergencyType, priority } = req.body;
    const teams_list = Object.keys(teams).filter(t => t !== fromTeamType);
    
    let backupTeam = null;
    let minLoad = Infinity;

    for (const teamType of teams_list) {
      const team = teams[teamType];
      const totalLoad = team.members.reduce((sum, m) => sum + m.activeAssignments, 0);
      if (totalLoad < minLoad) {
        minLoad = totalLoad;
        backupTeam = teamType;
      }
    }

    if (!backupTeam) {
      return res.json({ success: false, message: 'No backup available' });
    }

    res.json({
      success: true,
      backupTeamType: backupTeam,
      backupTeam: teams[backupTeam].name,
      eta: `${teams[backupTeam].avgResponseTime} seconds`,
      status: 'BACKUP_REQUESTED'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTeamLoadStatus = (req, res) => {
  const loadStatus = Object.entries(teams).map(([type, team]) => {
    const totalLoad = team.members.reduce((sum, m) => sum + m.activeAssignments, 0);
    const capacityPercent = (totalLoad / (team.maxConcurrentAssignments * team.totalMembers)) * 100;
    const busyCount = team.members.filter(m => m.activeAssignments > 0).length;

    let statusBadge = 'AVAILABLE';
    if (capacityPercent > 80) statusBadge = 'OVERLOADED';
    else if (capacityPercent > 50) statusBadge = 'PARTIAL';

    return {
      type,
      name: team.name,
      totalMembers: team.totalMembers,
      availableMembers: team.totalMembers - busyCount,
      busyMembers: busyCount,
      capacityPercent: Math.round(capacityPercent),
      statusBadge,
      avgResponseTime: team.avgResponseTime,
      backupNeeded: capacityPercent > 80
    };
  });

  res.json(loadStatus);
};

function mapEmergencyToTeam(emergencyType) {
  const mapping = {
    fire: 'fire',
    medical: 'medical',
    security: 'security'
  };
  return mapping[emergencyType] || 'security';
}

function calculateLoad(member) {
  return member.activeAssignments;
}
