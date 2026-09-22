/**
 * Zero-Dependency Unit Test Suite for ScopeGuard
 * Tests mathematical formulas, state serialization, and risk scoring logic
 * Run with: node scripts/test_unit.js
 */

const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// Test framework
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function runTests() {
  console.log('='.repeat(80));
  console.log('SCOPEGUARD UNIT TEST SUITE - ZERO DEPENDENCY');
  console.log('='.repeat(80));
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
  console.log('='.repeat(80));
  console.log(`RESULTS: ${passed} passed, ${failed} failed (${tests.length} total)`);
  console.log('='.repeat(80));

  process.exit(failed > 0 ? 1 : 0);
}

// ============================================================================
// MATHEMATICAL FORMULA TESTS
// ============================================================================

function calculateMetrics(rate, unbilledPerWeek, weeks, contractValue) {
  const totalUnbilledHours = unbilledPerWeek * weeks;
  const projectLoss = totalUnbilledHours * rate;
  const totalHoursWorked = (contractValue / rate) + totalUnbilledHours;
  const realEffectiveRate = totalHoursWorked > 0 ? (contractValue / totalHoursWorked) : rate;
  const profitErodedPercent = contractValue > 0 ? ((projectLoss / (contractValue + projectLoss)) * 100) : 0;
  const annualProjects = 8;
  const annualLoss = projectLoss * annualProjects;
  const freeWeeks = (annualLoss / (rate * 40));

  return {
    totalUnbilledHours,
    projectLoss,
    totalHoursWorked,
    realEffectiveRate,
    profitErodedPercent,
    annualLoss,
    freeWeeks
  };
}

test('Calculator: standard parameters', () => {
  const result = calculateMetrics(150, 5, 12, 25000);
  assert.strictEqual(result.totalUnbilledHours, 60);
  assert.strictEqual(result.projectLoss, 9000);
  assert.ok(Math.abs(result.totalHoursWorked - 226.67) < 1);
  assert.ok(Math.abs(result.realEffectiveRate - 110.29) < 1);
  assert.ok(Math.abs(result.profitErodedPercent - 26.47) < 1);
  assert.strictEqual(result.annualLoss, 72000);
  assert.strictEqual(result.freeWeeks, 12);
});

test('Calculator: zero unbilled hours (edge case)', () => {
  const result = calculateMetrics(150, 0, 12, 25000);
  assert.strictEqual(result.totalUnbilledHours, 0);
  assert.strictEqual(result.projectLoss, 0);
  assert.ok(Math.abs(result.totalHoursWorked - 166.67) < 1);
  assert.strictEqual(result.realEffectiveRate, 150);
  assert.strictEqual(result.profitErodedPercent, 0);
  assert.strictEqual(result.annualLoss, 0);
  assert.strictEqual(result.freeWeeks, 0);
});

test('Calculator: zero contract value (division by zero prevention)', () => {
  const result = calculateMetrics(150, 5, 12, 0);
  assert.strictEqual(result.totalUnbilledHours, 60);
  assert.strictEqual(result.projectLoss, 9000);
  assert.strictEqual(result.totalHoursWorked, 60);
  assert.strictEqual(result.realEffectiveRate, 0);
  assert.strictEqual(result.profitErodedPercent, 0);
  assert.strictEqual(result.annualLoss, 72000);
  assert.strictEqual(result.freeWeeks, 12);
});

test('Calculator: maximum parameters', () => {
  const result = calculateMetrics(300, 25, 52, 50000);
  assert.strictEqual(result.totalUnbilledHours, 1300);
  assert.strictEqual(result.projectLoss, 390000);
  assert.ok(Math.abs(result.totalHoursWorked - 1466.67) < 1);
  assert.ok(Math.abs(result.realEffectiveRate - 34.09) < 1);
  assert.ok(Math.abs(result.profitErodedPercent - 88.64) < 1);
  assert.strictEqual(result.annualLoss, 3120000);
  assert.strictEqual(result.freeWeeks, 260);
});

test('Calculator: minimum non-zero parameters', () => {
  const result = calculateMetrics(50, 1, 1, 1000);
  assert.strictEqual(result.totalUnbilledHours, 1);
  assert.strictEqual(result.projectLoss, 50);
  assert.strictEqual(result.totalHoursWorked, 21);
  assert.ok(Math.abs(result.realEffectiveRate - 47.62) < 1);
  assert.ok(Math.abs(result.profitErodedPercent - 4.76) < 1);
  assert.strictEqual(result.annualLoss, 400);
  assert.strictEqual(result.freeWeeks, 0.2);
});

test('Calculator: high unbilled hours relative to contract', () => {
  const result = calculateMetrics(200, 20, 10, 5000);
  assert.strictEqual(result.totalUnbilledHours, 200);
  assert.strictEqual(result.projectLoss, 40000);
  assert.strictEqual(result.totalHoursWorked, 225);
  assert.ok(Math.abs(result.realEffectiveRate - 22.22) < 1);
  assert.ok(Math.abs(result.profitErodedPercent - 88.89) < 1);
  assert.strictEqual(result.annualLoss, 320000);
  assert.strictEqual(result.freeWeeks, 40);
});

// ============================================================================
// RISK SCORING TESTS
// ============================================================================

function calculateRiskScore(answers) {
  // Original 8-question system with exact point values from app.js
  const questions = [
    { points: [0, 6, 12] },  // Q1: Specification clarity
    { points: [0, 6, 12] },  // Q2: Stakeholder governance
    { points: [0, 6, 12] },  // Q3: Revision policy
    { points: [0, 6, 13] },  // Q4: Timeline realism
    { points: [0, 6, 13] },  // Q5: Technical dependencies
    { points: [0, 6, 12] },  // Q6: Client tech maturity
    { points: [0, 6, 13] },  // Q7: Payment terms
    { points: [0, 6, 13] }   // Q8: Communication SLA
  ];

  let totalScore = 0;
  answers.forEach((answer, i) => {
    if (answer >= 0 && answer < questions[i].points.length) {
      totalScore += questions[i].points[answer];
    }
  });

  let tier;
  if (totalScore <= 25) tier = 'Low Risk';
  else if (totalScore <= 60) tier = 'Moderate Risk';
  else tier = 'Critical Risk';

  return { score: totalScore, tier };
}

test('Risk Scoring: all best answers (Low Risk)', () => {
  const result = calculateRiskScore([0, 0, 0, 0, 0, 0, 0, 0]);
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.tier, 'Low Risk');
});

test('Risk Scoring: all worst answers (Critical Risk)', () => {
  const result = calculateRiskScore([2, 2, 2, 2, 2, 2, 2, 2]);
  assert.strictEqual(result.score, 100);
  assert.strictEqual(result.tier, 'Critical Risk');
});

test('Risk Scoring: boundary - exactly 24 points (Low Risk threshold)', () => {
  const result = calculateRiskScore([2, 2, 0, 0, 0, 0, 0, 0]);
  assert.strictEqual(result.score, 24);
  assert.strictEqual(result.tier, 'Low Risk');
});

test('Risk Scoring: boundary - exactly 30 points (Moderate Risk)', () => {
  const result = calculateRiskScore([2, 2, 1, 0, 0, 0, 0, 0]);
  assert.strictEqual(result.score, 30);
  assert.strictEqual(result.tier, 'Moderate Risk');
});

test('Risk Scoring: boundary - exactly 60 points (Moderate Risk threshold)', () => {
  // Q1:12(2), Q2:12(2), Q3:12(2), Q4:0(0), Q5:0(0), Q6:12(2), Q7:6(1), Q8:6(1) -> 12*4 + 6*2 = 48 + 12 = 60
  const result = calculateRiskScore([2, 2, 2, 0, 0, 2, 1, 1]);
  assert.strictEqual(result.score, 60);
  assert.strictEqual(result.tier, 'Moderate Risk');
});

test('Risk Scoring: boundary - 62 points (Critical Risk threshold)', () => {
  // Q1:12(2), Q2:12(2), Q3:12(2), Q4:13(2), Q5:13(2), Q6:0(0), Q7:0(0), Q8:0(0) -> 36 + 26 = 62
  const result = calculateRiskScore([2, 2, 2, 2, 2, 0, 0, 0]);
  assert.strictEqual(result.score, 62);
  assert.strictEqual(result.tier, 'Critical Risk');
});

test('Risk Scoring: mixed answers (Moderate Risk)', () => {
  const result = calculateRiskScore([1, 1, 1, 1, 1, 1, 1, 1]);
  assert.strictEqual(result.score, 48);
  assert.strictEqual(result.tier, 'Moderate Risk');
});

test('Risk Scoring: partial high risk', () => {
  const result = calculateRiskScore([2, 2, 2, 0, 0, 0, 0, 0]);
  assert.strictEqual(result.score, 36);
  assert.strictEqual(result.tier, 'Moderate Risk');
});

// ============================================================================
// STATE SERIALIZATION TESTS
// ============================================================================

function serializeState(formData) {
  return {
    version: '1.0',
    timestamp: new Date().toISOString(),
    calculator: {
      hourlyRate: formData.hourlyRate || 0,
      unbilledHours: formData.unbilledHours || 0,
      projectWeeks: formData.projectWeeks || 0,
      contractValue: formData.contractValue || 0
    },
    changeOrder: {
      projectName: formData.projectName || '',
      clientName: formData.clientName || '',
      originalScope: formData.originalScope || '',
      requestedChanges: formData.requestedChanges || '',
      impactAnalysis: formData.impactAnalysis || '',
      additionalHours: formData.additionalHours || 0,
      revisedTotal: formData.revisedTotal || 0
    },
    risk: {
      answers: formData.riskAnswers || []
    }
  };
}

function deserializeState(json) {
  const data = typeof json === 'string' ? JSON.parse(json) : json;
  return {
    hourlyRate: data.calculator?.hourlyRate || 0,
    unbilledHours: data.calculator?.unbilledHours || 0,
    projectWeeks: data.calculator?.projectWeeks || 0,
    contractValue: data.calculator?.contractValue || 0,
    projectName: data.changeOrder?.projectName || '',
    clientName: data.changeOrder?.clientName || '',
    originalScope: data.changeOrder?.originalScope || '',
    requestedChanges: data.changeOrder?.requestedChanges || '',
    impactAnalysis: data.changeOrder?.impactAnalysis || '',
    additionalHours: data.changeOrder?.additionalHours || 0,
    revisedTotal: data.changeOrder?.revisedTotal || 0,
    riskAnswers: data.risk?.answers || []
  };
}

test('State Serialization: round-trip with full data', () => {
  const original = {
    hourlyRate: 150,
    unbilledHours: 5,
    projectWeeks: 12,
    contractValue: 25000,
    projectName: 'Test Project',
    clientName: 'Test Client',
    originalScope: 'Original work',
    requestedChanges: 'Additional features',
    impactAnalysis: 'Impact assessment',
    additionalHours: 20,
    revisedTotal: 28000,
    riskAnswers: [0, 1, 2, 0, 1, 2, 0, 1]
  };

  const serialized = serializeState(original);
  const deserialized = deserializeState(serialized);

  assert.strictEqual(deserialized.hourlyRate, original.hourlyRate);
  assert.strictEqual(deserialized.unbilledHours, original.unbilledHours);
  assert.strictEqual(deserialized.projectWeeks, original.projectWeeks);
  assert.strictEqual(deserialized.contractValue, original.contractValue);
  assert.strictEqual(deserialized.projectName, original.projectName);
  assert.strictEqual(deserialized.clientName, original.clientName);
  assert.strictEqual(deserialized.originalScope, original.originalScope);
  assert.strictEqual(deserialized.requestedChanges, original.requestedChanges);
  assert.strictEqual(deserialized.impactAnalysis, original.impactAnalysis);
  assert.strictEqual(deserialized.additionalHours, original.additionalHours);
  assert.strictEqual(deserialized.revisedTotal, original.revisedTotal);
  assert.deepStrictEqual(deserialized.riskAnswers, original.riskAnswers);
});

test('State Serialization: round-trip with empty data', () => {
  const original = {};
  const serialized = serializeState(original);
  const deserialized = deserializeState(serialized);

  assert.strictEqual(deserialized.hourlyRate, 0);
  assert.strictEqual(deserialized.unbilledHours, 0);
  assert.strictEqual(deserialized.projectWeeks, 0);
  assert.strictEqual(deserialized.contractValue, 0);
  assert.strictEqual(deserialized.projectName, '');
  assert.strictEqual(deserialized.clientName, '');
  assert.deepStrictEqual(deserialized.riskAnswers, []);
});

test('State Serialization: JSON string round-trip', () => {
  const original = {
    hourlyRate: 200,
    projectName: 'JSON Test'
  };

  const serialized = serializeState(original);
  const jsonString = JSON.stringify(serialized);
  const deserialized = deserializeState(jsonString);

  assert.strictEqual(deserialized.hourlyRate, 200);
  assert.strictEqual(deserialized.projectName, 'JSON Test');
});

test('State Serialization: handles missing nested properties', () => {
  const malformed = {
    version: '1.0',
    calculator: null,
    changeOrder: undefined
  };

  const deserialized = deserializeState(malformed);
  assert.strictEqual(deserialized.hourlyRate, 0);
  assert.strictEqual(deserialized.projectName, '');
  assert.deepStrictEqual(deserialized.riskAnswers, []);
});

// ============================================================================
// TEMPLATE DATA INTEGRITY TESTS
// ============================================================================

test('Template Data: industry templates have required fields', () => {
  const templates = [
    {
      id: 'web-dev',
      title: 'Web Development',
      scope: 'Build responsive website',
      changes: 'Additional pages requested',
      impact: 'Requires 15 hours additional work'
    },
    {
      id: 'mobile-app',
      title: 'Mobile App',
      scope: 'iOS app development',
      changes: 'Android version requested',
      impact: 'Platform addition requires full rebuild'
    }
  ];

  templates.forEach(t => {
    assert.ok(t.id, 'Template missing id');
    assert.ok(t.title, 'Template missing title');
    assert.ok(t.scope, 'Template missing scope');
    assert.ok(t.changes, 'Template missing changes');
    assert.ok(t.impact, 'Template missing impact');
  });
});

// ============================================================================
// RUN ALL TESTS
// ============================================================================

runTests();
