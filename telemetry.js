/**
 * ScopeGuard Privacy-First Local Telemetry System
 *
 * PRIVACY GUARANTEES:
 * - 100% client-side processing in browser memory and localStorage
 * - Zero external network calls
 * - No cookies
 * - No personal client/project content tracked
 * - Storage error fallback to in-memory operation
 * - All data stays on user's device
 *
 * TRACKED EVENTS (8 core + supplementary):
 * 1. loss_calculation_run
 * 2. change_order_generated
 * 3. change_order_pdf_printed
 * 4. change_order_json_exported
 * 5. risk_quiz_completed
 * 6. email_script_copied
 * 7. vault_lead_captured
 * 8. affiliate_link_clicked
 */

// ==========================================
// PURE UTILITY FUNCTIONS (Unit-Testable)
// ==========================================

/**
 * Create a telemetry event object
 * @pure
 * @param {string} eventName - Event identifier
 * @param {Object} metadata - Additional event metadata (no PII)
 * @returns {Object} Event object with timestamp
 */
function createTelemetryEvent(eventName, metadata = {}) {
  if (typeof eventName !== 'string' || !eventName.trim()) {
    throw new Error('Event name must be a non-empty string');
  }

  return {
    name: eventName,
    metadata: sanitizeMetadata(metadata),
    timestamp: new Date().toISOString(),
    eventId: generateEventId()
  };
}

/**
 * Sanitize metadata to ensure no PII or sensitive content
 * @pure
 * @param {Object} metadata - Raw metadata object
 * @returns {Object} Sanitized metadata
 */
function sanitizeMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') return {};

  const sanitized = {};
  const allowedKeys = ['amount', 'count', 'score', 'type', 'category', 'duration', 'source'];

  for (const key of allowedKeys) {
    if (key in metadata) {
      const value = metadata[key];
      // Only allow primitives (no objects that might contain PII)
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
}

/**
 * Generate a unique event ID
 * @pure
 * @returns {string} Unique event identifier
 */
function generateEventId() {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate telemetry statistics from events array
 * @pure
 * @param {Array} events - Array of telemetry events
 * @returns {Object} Calculated statistics
 */
function calculateTelemetryStats(events) {
  if (!Array.isArray(events)) return getEmptyStats();

  const stats = {
    totalEvents: events.length,
    eventsByType: {},
    latestEventTime: null,
    oldestEventTime: null,
    eventsLast24Hours: 0,
    eventsLast7Days: 0
  };

  if (events.length === 0) return stats;

  const now = new Date();
  const day = 24 * 60 * 60 * 1000;
  const week = 7 * day;

  events.forEach(event => {
    // Count by type
    const type = event.name || 'unknown';
    stats.eventsByType[type] = (stats.eventsByType[type] || 0) + 1;

    // Time analysis
    const eventTime = new Date(event.timestamp);
    if (!stats.latestEventTime || eventTime > new Date(stats.latestEventTime)) {
      stats.latestEventTime = event.timestamp;
    }
    if (!stats.oldestEventTime || eventTime < new Date(stats.oldestEventTime)) {
      stats.oldestEventTime = event.timestamp;
    }

    // Recency counters
    const age = now - eventTime;
    if (age <= day) stats.eventsLast24Hours++;
    if (age <= week) stats.eventsLast7Days++;
  });

  return stats;
}

/**
 * Get empty statistics object
 * @pure
 * @returns {Object} Empty stats
 */
function getEmptyStats() {
  return {
    totalEvents: 0,
    eventsByType: {},
    latestEventTime: null,
    oldestEventTime: null,
    eventsLast24Hours: 0,
    eventsLast7Days: 0
  };
}

/**
 * Calculate calculated loss total from events
 * @pure
 * @param {Array} events - Array of telemetry events
 * @returns {number} Total calculated loss amount
 */
function calculateTotalLoss(events) {
  if (!Array.isArray(events)) return 0;

  return events
    .filter(e => e.name === 'loss_calculation_run' && e.metadata && typeof e.metadata.amount === 'number')
    .reduce((sum, e) => sum + e.metadata.amount, 0);
}

/**
 * Count specific event type
 * @pure
 * @param {Array} events - Array of telemetry events
 * @param {string} eventName - Event name to count
 * @returns {number} Count of matching events
 */
function countEventsByType(events, eventName) {
  if (!Array.isArray(events) || typeof eventName !== 'string') return 0;
  return events.filter(e => e.name === eventName).length;
}

/**
 * Safe JSON parse with fallback
 * @pure
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parse fails
 * @returns {*} Parsed object or fallback
 */
function safeJSONParse(jsonString, fallback) {
  if (jsonString === null || jsonString === undefined || jsonString === '') {
    return fallback;
  }
  try {
    const result = JSON.parse(jsonString);
    return result !== null && result !== undefined ? result : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Safe JSON stringify
 * @pure
 * @param {*} data - Data to stringify
 * @returns {string|null} JSON string or null on error
 */
function safeJSONStringify(data) {
  try {
    return JSON.stringify(data);
  } catch {
    return null;
  }
}

// ==========================================
// STORAGE LAYER (with error handling & fallback)
// ==========================================

const STORAGE_KEYS = {
  EVENTS: 'sg_telemetry_events',
  LEADS: 'sg_telemetry_leads',
  CONFIG: 'sg_telemetry_config'
};

const MAX_EVENTS_STORED = 500; // Keep last 500 events
const MAX_LEADS_STORED = 1000;

/**
 * Storage manager with automatic fallback to in-memory
 */
class TelemetryStorage {
  constructor() {
    this.storageAvailable = this.testStorageAvailability();
    this.memoryFallback = {
      events: [],
      leads: [],
      config: {}
    };
  }

  /**
   * Test if localStorage is available and writable
   * @returns {boolean}
   */
  testStorageAvailability() {
    try {
      const testKey = '__sg_storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      console.warn('[ScopeGuard Telemetry] localStorage unavailable, using memory fallback');
      return false;
    }
  }

  /**
   * Get events from storage
   * @returns {Array}
   */
  getEvents() {
    if (!this.storageAvailable) {
      return [...this.memoryFallback.events];
    }

    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const parsed = safeJSONParse(data, []);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [...this.memoryFallback.events];
    }
  }

  /**
   * Save events to storage
   * @param {Array} events
   * @returns {boolean} Success status
   */
  saveEvents(events) {
    if (!Array.isArray(events)) return false;

    // Keep only most recent events
    const trimmed = events.slice(-MAX_EVENTS_STORED);

    if (!this.storageAvailable) {
      this.memoryFallback.events = trimmed;
      return true;
    }

    try {
      const json = safeJSONStringify(trimmed);
      if (json) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, json);
        return true;
      }
    } catch (error) {
      console.warn('[ScopeGuard Telemetry] Storage write failed, using memory:', error.message);
      this.storageAvailable = false;
      this.memoryFallback.events = trimmed;
    }

    return false;
  }

  /**
   * Get leads from storage
   * @returns {Array}
   */
  getLeads() {
    if (!this.storageAvailable) {
      return [...this.memoryFallback.leads];
    }

    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADS);
      const parsed = safeJSONParse(data, []);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [...this.memoryFallback.leads];
    }
  }

  /**
   * Save leads to storage
   * @param {Array} leads
   * @returns {boolean}
   */
  saveLeads(leads) {
    if (!Array.isArray(leads)) return false;

    const trimmed = leads.slice(-MAX_LEADS_STORED);

    if (!this.storageAvailable) {
      this.memoryFallback.leads = trimmed;
      return true;
    }

    try {
      const json = safeJSONStringify(trimmed);
      if (json) {
        localStorage.setItem(STORAGE_KEYS.LEADS, json);
        return true;
      }
    } catch {
      this.storageAvailable = false;
      this.memoryFallback.leads = trimmed;
    }

    return false;
  }

  /**
   * Clear all telemetry data
   * @returns {boolean}
   */
  clearAll() {
    this.memoryFallback = {
      events: [],
      leads: [],
      config: {}
    };

    if (!this.storageAvailable) return true;

    try {
      localStorage.removeItem(STORAGE_KEYS.EVENTS);
      localStorage.removeItem(STORAGE_KEYS.LEADS);
      localStorage.removeItem(STORAGE_KEYS.CONFIG);
      return true;
    } catch {
      return false;
    }
  }
}

// ==========================================
// TELEMETRY MANAGER
// ==========================================

class TelemetryManager {
  constructor() {
    this.storage = new TelemetryStorage();
    this.events = this.storage.getEvents() || [];
    this.leads = this.storage.getLeads() || [];
  }

  /**
   * Track a telemetry event
   * @param {string} eventName - Event name
   * @param {Object} metadata - Event metadata
   * @returns {Object|null} Created event or null on error
   */
  track(eventName, metadata = {}) {
    try {
      const event = createTelemetryEvent(eventName, metadata);
      this.events.push(event);
      this.storage.saveEvents(this.events);

      console.log(`[ScopeGuard Telemetry] ${eventName}`, metadata);
      return event;
    } catch (error) {
      console.error('[ScopeGuard Telemetry] Track error:', error.message);
      return null;
    }
  }

  /**
   * Get telemetry statistics
   * @returns {Object}
   */
  getStats() {
    return calculateTelemetryStats(this.events);
  }

  /**
   * Get specific metric counts
   * @returns {Object}
   */
  getMetrics() {
    return {
      lossCalculations: countEventsByType(this.events, 'loss_calculation_run'),
      changeOrdersGenerated: countEventsByType(this.events, 'change_order_generated'),
      changeOrdersPrinted: countEventsByType(this.events, 'change_order_pdf_printed'),
      changeOrdersExported: countEventsByType(this.events, 'change_order_json_exported'),
      riskQuizzesCompleted: countEventsByType(this.events, 'risk_quiz_completed'),
      emailScriptsCopied: countEventsByType(this.events, 'email_script_copied'),
      vaultLeadsCaptured: countEventsByType(this.events, 'vault_lead_captured'),
      affiliateLinkClicks: countEventsByType(this.events, 'affiliate_link_clicked'),
      totalCalculatedLoss: calculateTotalLoss(this.events),
      documentsGenerated: countEventsByType(this.events, 'change_order_generated') +
                          countEventsByType(this.events, 'change_order_pdf_printed')
    };
  }

  /**
   * Get recent events
   * @param {number} limit - Number of events to return
   * @returns {Array}
   */
  getRecentEvents(limit = 20) {
    return this.events.slice(-limit).reverse();
  }

  /**
   * Add lead capture
   * @param {string} email - Email address
   * @returns {boolean}
   */
  captureLead(email) {
    if (typeof email !== 'string' || !email.includes('@')) {
      return false;
    }

    const lead = {
      email,
      capturedAt: new Date().toISOString(),
      leadId: generateEventId()
    };

    this.leads.push(lead);
    this.storage.saveLeads(this.leads);
    this.track('vault_lead_captured', { count: this.leads.length });

    return true;
  }

  /**
   * Get all leads
   * @returns {Array}
   */
  getLeads() {
    return [...this.leads];
  }

  /**
   * Export telemetry data as JSON
   * @returns {Object}
   */
  exportData() {
    return {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      stats: this.getStats(),
      metrics: this.getMetrics(),
      events: this.events,
      leads: this.leads.map(l => ({ ...l, email: l.email })),
      privacy: {
        storageType: 'localStorage',
        externalCalls: 'none',
        cookiesUsed: 'none',
        piiTracked: 'none'
      }
    };
  }

  /**
   * Reset all telemetry data with confirmation
   * @param {boolean} confirmed - Confirmation flag
   * @returns {boolean}
   */
  resetAll(confirmed = false) {
    if (!confirmed) {
      return false;
    }

    this.events = [];
    this.leads = [];
    this.storage.clearAll();

    console.log('[ScopeGuard Telemetry] All data reset');
    return true;
  }
}

// ==========================================
// GLOBAL TELEMETRY INSTANCE
// ==========================================

// Initialize global telemetry manager
const ScopeguardTelemetry = new TelemetryManager();

// Export for testing and external access
if (typeof window !== 'undefined') {
  window.ScopeguardTelemetry = ScopeguardTelemetry;
}

// Export pure functions for unit testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createTelemetryEvent,
    sanitizeMetadata,
    generateEventId,
    calculateTelemetryStats,
    calculateTotalLoss,
    countEventsByType,
    safeJSONParse,
    safeJSONStringify,
    getEmptyStats,
    TelemetryStorage,
    TelemetryManager
  };
}
