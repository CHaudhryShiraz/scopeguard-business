/**
 * Boundary Test Suite for Risk Diagnostic v2.0
 * Tests input validation, edge cases, and scoring algorithm
 * Run with: node scripts/test_risk_diagnostic.js
 */

// Load the module
const path = require('path');
const RiskDiagnosticV2 = require('./risk-diagnostic-v2.js');

// Test framework
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function runTests() {
  console.log('='.repeat(70));
  console.log('RISK DIAGNOSTIC V2.0 - BOUNDARY TEST SUITE');
  console.log('='.repeat(70));
  console.log();

  tests.forEach(({ name, fn }) => {
    try {
      fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (error) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   ${error.message}`);
      failed++;
    }
  });

  console.log();
  console.log('='.repeat(70));
  console.log(`RESULTS: ${passed} passed, ${failed} failed (${tests.length} total)`);
  console.log('='.repeat(70));

  process.exit(failed > 0 ? 1 : 0);
}

// ============================================================================
// INPUT VALIDATION TESTS
// ============================================================================

test('validateInput: accepts valid integer 0', () => {
  const result = RiskDiagnosticV2.validateInput(0);
  assertEquals(result, 0);
});

test('validateInput: accepts valid integer 10', () => {
  const result = RiskDiagnosticV2.validateInput(10);
  assertEquals(result, 10);
});

test('validateInput: accepts valid integer 5', () => {
  const result = RiskDiagnosticV2.validateInput(5);
  assertEquals(result, 5);
});

test('validateInput: clamps negative value to 0', () => {
  const result = RiskDiagnosticV2.validateInput(-5);
  assertEquals(result, 0);
});

test('validateInput: clamps value above 10 to 10', () => {
  const result = RiskDiagnosticV2.validateInput(15);
  assertEquals(result, 10);
});

test('validateInput: clamps extreme negative to 0', () => {
  const result = RiskDiagnosticV2.validateInput(-999);
  assertEquals(result, 0);
});

test('validateInput: clamps extreme positive to 10', () => {
  const result = RiskDiagnosticV2.validateInput(999);
  assertEquals(result, 10);
});

test('validateInput: rounds decimal down', () => {
  const result = RiskDiagnosticV2.validateInput(7.3);
  assertEquals(result, 7);
});

test('validateInput: rounds decimal up', () => {
  const result = RiskDiagnosticV2.validateInput(7.8);
  assertEquals(result, 8);
});

test('validateInput: handles null as invalid', () => {
  const result = RiskDiagnosticV2.validateInput(null);
  assertEquals(result, null);
});

test('validateInput: handles undefined as invalid', () => {
  const result = RiskDiagnosticV2.validateInput(undefined);
  assertEquals(result, null);
});

test('validateInput: handles empty string as invalid', () => {
  const result = RiskDiagnosticV2.validateInput('');
  assertEquals(result, null);
});

test('validateInput: handles non-numeric string as invalid', () => {
  const result = RiskDiagnosticV2.validateInput('abc');
  assertEquals(result, null);
});

test('validateInput: handles NaN as invalid', () => {
  const result = RiskDiagnosticV2.validateInput(NaN);
  assertEquals(result, null);
});

test('validateInput: converts numeric string to number', () => {
  const result = RiskDiagnosticV2.validateInput('7');
  assertEquals(result, 7);
});

test('validateInput: converts negative string and clamps', () => {
  const result = RiskDiagnosticV2.validateInput('-3');
  assertEquals(result, 0);
});

test('validateInput: handles object as invalid', () => {
  const result = RiskDiagnosticV2.validateInput({});
  assertEquals(result, null);
});

test('validateInput: handles array as invalid', () => {
  const result = RiskDiagnosticV2.validateInput([5]);
  assertEquals(result, null);
});

// ============================================================================
// SCORING ALGORITHM TESTS
// ============================================================================

test('calculateRiskScore: perfect score (all 10s) returns 0% risk', () => {
  const inputs = {};
  RiskDiagnosticV2.dimensions.forEach(dim => {
    inputs[dim.id] = 10;
  });
  const result = RiskDiagnosticV2.calculateRiskScore(inputs);
  assertEquals(result.score, 0, 'Perfect score should be 0% risk');
  assertEquals(result.tier, 'low');
});

test('calculateRiskScore: worst score (all 0s) returns 100% risk', () => {
  const inputs = {};
  RiskDiagnosticV2.dimensions.forEach(dim => {
    inputs[dim.id] = 0;
  });
  const result = RiskDiagnosticV2.calculateRiskScore(inputs);
  assertEquals(result.score, 100, 'Worst score should be 100% risk');
  assertEquals(result.tier, 'severe');
});

test('calculateRiskScore: middle score (all 5s) returns moderate risk', () => {
  const inputs = {};
  RiskDiagnosticV2.dimensions.forEach(dim => {
    inputs[dim.id] = 5;
  });
  const result = RiskDiagnosticV2.calculateRiskScore(inputs);
  assert(result.score >= 40 && result.score <= 60, 'Middle score should be ~50% risk');
  assertEquals(result.tier, 'moderate');
});

test('calculateRiskScore: skips invalid inputs in calculation', () => {
  const inputs = {
    'spec-clarity': 10,
    'stakeholder-governance': null,
    'revision-limit': 'invalid',
    'timeline-realism': 10
  };
  RiskDiagnosticV2.dimensions.forEach(dim => {
    if (!inputs.hasOwnProperty(dim.id)) {
      inputs[dim.id] = 10;
    }
  });
  const result = RiskDiagnosticV2.calculateRiskScore(inputs);
  // Should still calculate based on valid inputs only
  assert(result.score >= 0 && result.score <= 100, 'Score should be in valid range');
});

test('calculateRiskScore: handles all invalid inputs gracefully', () => {
  const inputs = {};
  RiskDiagnosticV2.dimensions.forEach(dim => {
    inputs[dim.id] = null;
  });
  const result = RiskDiagnosticV2.calculateRiskScore(inputs);
  assertEquals(result.score, 0, 'All invalid should return 0');
});

test('calculateRiskScore: breakdown includes all dimensions', () => {
  const inputs = {};
  RiskDiagnosticV2.dimensions.forEach(dim => {
    inputs[dim.id] = 5;
  });
  const result = RiskDiagnosticV2.calculateRiskScore(inputs);
  assertEquals(result.breakdown.length, RiskDiagnosticV2.dimensions.length);
});

test('calculateRiskScore: tier boundaries - low risk threshold', () => {
  const inputs = {};
  RiskDiagnosticV2.dimensions.forEach(dim => {
    inputs[dim.id] = 9; // High safety = low risk
  });
  const result = RiskDiagnosticV2.calculateRiskScore(inputs);
  assert(result.score <= 25, 'Should be low risk');
  assertEquals(result.tier, 'low');
});

test('calculateRiskScore: tier boundaries - severe risk threshold', () => {
  const inputs = {};
  RiskDiagnosticV2.dimensions.forEach(dim => {
    inputs[dim.id] = 1; // Very high risk
  });
  const result = RiskDiagnosticV2.calculateRiskScore(inputs);
  assert(result.score >= 81, 'Should be severe risk');
  assertEquals(result.tier, 'severe');
});

// ============================================================================
// RECOMMENDATION GENERATION TESTS
// ============================================================================

test('generateRecommendations: returns empty for all 10s (low risk)', () => {
  const inputs = {};
  RiskDiagnosticV2.dimensions.forEach(dim => {
    inputs[dim.id] = 10;
  });
  const recommendations = RiskDiagnosticV2.generateRecommendations(inputs);
  assertEquals(recommendations.length, 0, 'Perfect scores should have no recommendations');
});

test('generateRecommendations: returns recommendations for low scores', () => {
  const inputs = {};
  RiskDiagnosticV2.dimensions.forEach(dim => {
    inputs[dim.id] = 2; // High risk
  });
  const recommendations = RiskDiagnosticV2.generateRecommendations(inputs);
  assert(recommendations.length > 0, 'High risk scores should generate recommendations');
});

test('generateRecommendations: prioritizes critical over important', () => {
  const inputs = {};
  inputs['spec-clarity'] = 2; // Critical
  inputs['stakeholder-governance'] = 5; // Moderate
  RiskDiagnosticV2.dimensions.forEach(dim => {
    if (!inputs.hasOwnProperty(dim.id)) {
      inputs[dim.id] = 10;
    }
  });
  const recommendations = RiskDiagnosticV2.generateRecommendations(inputs);
  assert(recommendations.length >= 2, 'Should have at least 2 recommendations');
  assertEquals(recommendations[0].priority, 'critical', 'First should be critical');
});

test('generateRecommendations: skips invalid inputs', () => {
  const inputs = {
    'spec-clarity': null,
    'stakeholder-governance': 2,
    'revision-limit': 'invalid'
  };
  RiskDiagnosticV2.dimensions.forEach(dim => {
    if (!inputs.hasOwnProperty(dim.id)) {
      inputs[dim.id] = 10;
    }
  });
  const recommendations = RiskDiagnosticV2.generateRecommendations(inputs);
  // Should only recommend for valid low scores
  assert(recommendations.length > 0, 'Should have recommendations for valid risks');
  recommendations.forEach(rec => {
    assert(rec.input !== 'Invalid', 'Should not recommend for invalid inputs');
  });
});

test('generateRecommendations: includes dimension name and recommendation text', () => {
  const inputs = {};
  inputs['spec-clarity'] = 2;
  RiskDiagnosticV2.dimensions.forEach(dim => {
    if (!inputs.hasOwnProperty(dim.id)) {
      inputs[dim.id] = 10;
    }
  });
  const recommendations = RiskDiagnosticV2.generateRecommendations(inputs);
  assert(recommendations.length > 0, 'Should have recommendations');
  assert(recommendations[0].dimension, 'Should include dimension name');
  assert(recommendations[0].recommendation, 'Should include recommendation text');
  assert(recommendations[0].recommendation.length > 50, 'Recommendation should be substantive');
});

// ============================================================================
// WEIGHTS VALIDATION
// ============================================================================

test('dimension weights sum to 100', () => {
  const totalWeight = RiskDiagnosticV2.dimensions.reduce((sum, dim) => sum + dim.weight, 0);
  assertEquals(totalWeight, 100, 'Total dimension weights must equal 100%');
});

test('all dimensions have required fields', () => {
  RiskDiagnosticV2.dimensions.forEach(dim => {
    assert(dim.id, `Dimension missing id: ${JSON.stringify(dim)}`);
    assert(dim.name, `Dimension ${dim.id} missing name`);
    assert(dim.weight > 0, `Dimension ${dim.id} has invalid weight`);
    assert(dim.question, `Dimension ${dim.id} missing question`);
    assert(dim.scale, `Dimension ${dim.id} missing scale`);
    assert(dim.scale[0], `Dimension ${dim.id} missing scale[0]`);
    assert(dim.scale[5], `Dimension ${dim.id} missing scale[5]`);
    assert(dim.scale[10], `Dimension ${dim.id} missing scale[10]`);
    assert(dim.recommendations, `Dimension ${dim.id} missing recommendations`);
    assert(dim.recommendations.low, `Dimension ${dim.id} missing recommendations.low`);
    assert(dim.recommendations.moderate, `Dimension ${dim.id} missing recommendations.moderate`);
    assert(dim.recommendations.high, `Dimension ${dim.id} missing recommendations.high`);
  });
});

test('exactly 12 dimensions defined', () => {
  assertEquals(RiskDiagnosticV2.dimensions.length, 12, 'Must have exactly 12 dimensions');
});

// ============================================================================
// RUN ALL TESTS
// ============================================================================

runTests();
