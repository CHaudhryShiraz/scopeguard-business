/**
 * Unit Tests for ScopeGuard Privacy-First Local Telemetry System
 * Tests pure functions, data sanitization, event counting, loss calculation, and storage fallback
 */

const {
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
} = require('../telemetry.js');

// Mock localStorage for Node.js environment
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new LocalStorageMock();

// Test Runner
function runTests() {
  console.log('=== ScopeGuard Telemetry Unit Tests ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Test createTelemetryEvent
  try {
    const event = createTelemetryEvent('loss_calculation_run', { amount: 1500, duration: 4 });
    assert(event.name === 'loss_calculation_run', 'createTelemetryEvent sets event name');
    assert(event.metadata.amount === 1500, 'createTelemetryEvent preserves valid metadata');
    assert(typeof event.timestamp === 'string', 'createTelemetryEvent includes ISO timestamp');
    assert(event.eventId.startsWith('evt_'), 'createTelemetryEvent generates eventId');
  } catch (e) {
    assert(false, `createTelemetryEvent failed: ${e.message}`);
  }

  // 2. Test sanitizeMetadata - Privacy Preservation
  try {
    const dirtyMetadata = {
      amount: 2500,
      clientName: 'Secret Client LLC', // PII - should be filtered
      projectNotes: 'Confidential feature list', // Sensitive - should be filtered
      score: 85,
      type: 'fixed',
      userEmail: 'ceo@agency.com' // PII - should be filtered
    };
    const sanitized = sanitizeMetadata(dirtyMetadata);
    assert(sanitized.amount === 2500, 'sanitizeMetadata allows approved numerical properties');
    assert(sanitized.score === 85, 'sanitizeMetadata allows score property');
    assert(sanitized.type === 'fixed', 'sanitizeMetadata allows type property');
    assert(!sanitized.clientName, 'sanitizeMetadata strips clientName');
    assert(!sanitized.projectNotes, 'sanitizeMetadata strips projectNotes');
    assert(!sanitized.userEmail, 'sanitizeMetadata strips userEmail');
  } catch (e) {
    assert(false, `sanitizeMetadata failed: ${e.message}`);
  }

  // 3. Test countEventsByType
  try {
    const mockEvents = [
      { name: 'loss_calculation_run', metadata: { amount: 1000 } },
      { name: 'loss_calculation_run', metadata: { amount: 2000 } },
      { name: 'change_order_generated', metadata: { count: 1 } },
      { name: 'risk_quiz_completed', metadata: { score: 45 } },
      { name: 'email_script_copied', metadata: { category: 'defense' } }
    ];
    assert(countEventsByType(mockEvents, 'loss_calculation_run') === 2, 'countEventsByType counts multiple occurrences');
    assert(countEventsByType(mockEvents, 'change_order_generated') === 1, 'countEventsByType counts single occurrence');
    assert(countEventsByType(mockEvents, 'non_existent_event') === 0, 'countEventsByType returns 0 for missing events');
  } catch (e) {
    assert(false, `countEventsByType failed: ${e.message}`);
  }

  // 4. Test calculateTotalLoss
  try {
    const mockLossEvents = [
      { name: 'loss_calculation_run', metadata: { amount: 1200 } },
      { name: 'loss_calculation_run', metadata: { amount: 800 } },
      { name: 'change_order_generated', metadata: { amount: 9999 } }, // should not count towards loss
      { name: 'loss_calculation_run', metadata: { amount: 500 } }
    ];
    const totalLoss = calculateTotalLoss(mockLossEvents);
    assert(totalLoss === 2500, `calculateTotalLoss aggregates correctly (expected 2500, got ${totalLoss})`);
  } catch (e) {
    assert(false, `calculateTotalLoss failed: ${e.message}`);
  }

  // 5. Test calculateTelemetryStats
  try {
    const sampleEvents = [
      { name: 'loss_calculation_run', timestamp: new Date(Date.now() - 10000).toISOString() },
      { name: 'risk_quiz_completed', timestamp: new Date().toISOString() }
    ];
    const stats = calculateTelemetryStats(sampleEvents);
    assert(stats.totalEvents === 2, 'calculateTelemetryStats calculates total count');
    assert(stats.eventsByType['loss_calculation_run'] === 1, 'calculateTelemetryStats groups by type');
    assert(stats.eventsLast24Hours === 2, 'calculateTelemetryStats calculates recency counts');
    assert(stats.latestEventTime !== null, 'calculateTelemetryStats identifies latest event time');
  } catch (e) {
    assert(false, `calculateTelemetryStats failed: ${e.message}`);
  }

  // 6. Test safeJSONParse and safeJSONStringify
  try {
    const validJson = safeJSONParse('{"key":"value"}', {});
    const invalidJson = safeJSONParse('invalid-json', { fallback: true });
    assert(validJson.key === 'value', 'safeJSONParse parses valid JSON');
    assert(invalidJson.fallback === true, 'safeJSONParse returns fallback on invalid JSON');
    assert(safeJSONStringify({ a: 1 }) === '{"a":1}', 'safeJSONStringify returns valid JSON string');
  } catch (e) {
    assert(false, `JSON utility tests failed: ${e.message}`);
  }

  // 7. Test TelemetryManager tracking and metrics aggregation
  try {
    localStorage.clear();
    const manager = new TelemetryManager();

    // Track required events
    manager.track('loss_calculation_run', { amount: 1800 });
    manager.track('change_order_generated', { count: 1 });
    manager.track('change_order_pdf_printed', { count: 1 });
    manager.track('change_order_json_exported', { count: 1 });
    manager.track('risk_quiz_completed', { score: 75 });
    manager.track('email_script_copied', { category: 'defense' });
    manager.track('vault_lead_captured', { count: 1 });
    manager.track('affiliate_link_clicked', { category: 'recommendation' });

    const metrics = manager.getMetrics();
    assert(metrics.lossCalculations === 1, 'TelemetryManager tracks loss_calculation_run');
    assert(metrics.changeOrdersGenerated === 1, 'TelemetryManager tracks change_order_generated');
    assert(metrics.changeOrdersPrinted === 1, 'TelemetryManager tracks change_order_pdf_printed');
    assert(metrics.changeOrdersExported === 1, 'TelemetryManager tracks change_order_json_exported');
    assert(metrics.riskQuizzesCompleted === 1, 'TelemetryManager tracks risk_quiz_completed');
    assert(metrics.emailScriptsCopied === 1, 'TelemetryManager tracks email_script_copied');
    assert(metrics.vaultLeadsCaptured === 1, 'TelemetryManager tracks vault_lead_captured');
    assert(metrics.affiliateLinkClicks === 1, 'TelemetryManager tracks affiliate_link_clicked');
    assert(metrics.totalCalculatedLoss === 1800, 'TelemetryManager calculates totalCalculatedLoss');
    assert(metrics.documentsGenerated === 2, 'TelemetryManager aggregates documents generated count');

    // Test JSON Export
    const exportData = manager.exportData();
    assert(exportData.version === '1.0.0', 'exportData includes version');
    assert(exportData.privacy.storageType === 'localStorage', 'exportData includes privacy metadata');
    assert(exportData.events.length === 8, 'exportData contains all recorded events');

    // Test Reset
    const resetSuccess = manager.resetAll(true);
    assert(resetSuccess === true, 'resetAll returns true on confirmation');
    assert(manager.events.length === 0, 'resetAll clears in-memory events');
    assert(manager.getMetrics().lossCalculations === 0, 'resetAll resets metric counts');
  } catch (e) {
    assert(false, `TelemetryManager tests failed: ${e.message}`);
  }

  // 8. Test Storage Fallback when localStorage fails
  try {
    const storage = new TelemetryStorage();
    // Simulate localStorage quota exceeded or error
    storage.storageAvailable = false;

    storage.saveEvents([{ name: 'test_event', timestamp: new Date().toISOString() }]);
    const events = storage.getEvents();
    assert(events.length === 1 && events[0].name === 'test_event', 'Storage gracefully falls back to memory storage');
  } catch (e) {
    assert(false, `Storage fallback test failed: ${e.message}`);
  }

  console.log(`\nTests Completed: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  return failed === 0;
}

if (require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}

module.exports = { runTests };
