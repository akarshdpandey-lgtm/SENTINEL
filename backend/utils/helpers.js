// Haversine distance calculation for geo-fencing
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format time remaining for SLA
export const formatTimeRemaining = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Simulate network delay
export const simulateDelay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Cache for Gemini responses
class ResponseCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 60 * 60 * 1000; // 1 hour
  }

  set(key, value) {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

export const geminiCache = new ResponseCache();

// Calculate SLA thresholds
export const SLA_THRESHOLDS = {
  CRITICAL: { responseTime: 180, escalationTime: 90 },
  HIGH: { responseTime: 300, escalationTime: 150 },
  MEDIUM: { responseTime: 480, escalationTime: 240 },
  LOW: { responseTime: 720, escalationTime: 360 }
};

export const getPriorityLevel = (urgencyScore) => {
  if (urgencyScore >= 9) return 'CRITICAL';
  if (urgencyScore >= 7) return 'HIGH';
  if (urgencyScore >= 4) return 'MEDIUM';
  return 'LOW';
};
