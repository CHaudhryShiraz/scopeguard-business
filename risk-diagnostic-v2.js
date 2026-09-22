/**
 * ScopeGuard Risk Diagnostic v2.0
 * 12-Dimension Project Risk Assessment Engine
 * Zero-dependency, client-side, privacy-first architecture
 *
 * ARCHITECTURAL PRINCIPLES:
 * - Additive module (preserves legacy 8-question quiz)
 * - 0-10 input validation with boundary protection
 * - Transparent weighted scoring algorithm
 * - 4-tier risk categorization (Low/Moderate/High/Severe)
 * - Actionable contract recommendations per dimension
 * - Direct Change Order builder integration
 */

const RiskDiagnosticV2 = {
  /**
   * 12 Risk Dimensions with Weights
   * Total weights = 100 for transparent scoring
   */
  dimensions: [
    {
      id: 'spec-clarity',
      name: 'Specification & Requirements Clarity',
      weight: 12,
      question: 'How clearly defined and documented are the project requirements, deliverables, and acceptance criteria?',
      scale: {
        0: 'No written requirements or scope document exists',
        5: 'Basic outline provided but many ambiguities remain',
        10: 'Crystal-clear specifications with measurable acceptance criteria'
      },
      recommendations: {
        low: 'Insert Change Order clause: "Work will not commence until client provides written acceptance of detailed specification document including functional requirements, acceptance criteria, and wireframes/mockups where applicable."',
        moderate: 'Insert Change Order clause: "Any ambiguity in requirements discovered during execution will trigger mandatory clarification meeting within 48 hours. Silence = acceptance of contractor interpretation."',
        high: 'Insert Change Order clause: "Due to specification gaps, contractor reserves right to implement industry-standard approach for undefined features. Client retrospective changes to undefined scope constitute new Change Order."'
      }
    },
    {
      id: 'stakeholder-governance',
      name: 'Stakeholder Governance & Decision Makers',
      weight: 10,
      question: 'Is there a single authorized decision-maker, or are multiple stakeholders capable of altering scope?',
      scale: {
        0: 'Multiple stakeholders with unclear authority hierarchy',
        5: 'Primary contact exists but defers to others regularly',
        10: 'Single empowered decision-maker with full authority'
      },
      recommendations: {
        low: 'Insert Change Order clause: "All scope changes, design approvals, and milestone sign-offs require written approval from single designated Project Owner [Name]. Requests from other stakeholders will be routed to Project Owner for authorization."',
        moderate: 'Insert Change Order clause: "Approval authority matrix must be documented within 3 business days. Conflicting direction from multiple stakeholders will pause work until unified decision is provided in writing."',
        high: 'Insert Change Order clause: "Work will proceed based on instructions from designated Project Owner only. Contractor is not responsible for reconciling conflicting stakeholder requests. Decision paralysis exceeding 5 business days will extend timeline 1:1."'
      }
    },
    {
      id: 'revision-limit',
      name: 'Revision Limit Policy',
      weight: 9,
      question: 'Are revision rounds capped, or does the client expect unlimited iterations?',
      scale: {
        0: 'No revision limits discussed or implied unlimited changes',
        5: 'Informal understanding but not documented',
        10: 'Explicit revision cap in contract (e.g., 2 rounds)'
      },
      recommendations: {
        low: 'Insert Change Order clause: "This scope includes maximum 2 rounds of consolidated revisions. Additional revision rounds beyond Round 2 will be billed at $[rate]/hour with 48-hour notice. Revisions must be submitted as single consolidated feedback document."',
        moderate: 'Insert Change Order clause: "Revision rounds are capped at [N] rounds. Each round must address all feedback at once. Piecemeal or incremental requests do not constitute valid revision rounds and will be billed separately."',
        high: 'Insert Change Order clause: "No revision rounds included in this Change Order pricing. All changes post-delivery will be quoted and billed separately. Client accepts work as-is upon delivery unless defects prevent core functionality."'
      }
    },
    {
      id: 'timeline-realism',
      name: 'Timeline Realism & Buffer',
      weight: 8,
      question: 'Does the proposed timeline include buffer for unknowns, or is it based on best-case execution?',
      scale: {
        0: 'Aggressive deadline with zero buffer for risks',
        5: 'Reasonable timeline but no explicit contingency built in',
        10: 'Padded timeline with 25%+ buffer for unforeseen issues'
      },
      recommendations: {
        low: 'Insert Change Order clause: "This timeline assumes zero client-side delays, immediate responses to all requests, and no scope changes. Any delay in client deliverables (credentials, content, approvals) will extend deadline 1:1. Force majeure events extend timeline automatically."',
        moderate: 'Insert Change Order clause: "Timeline contingency: Client feedback/approval delays exceeding 3 business days will extend project deadline by 2x the delay period. Third-party integration delays beyond contractor control will extend timeline accordingly."',
        high: 'Insert Change Order clause: "Expedited timeline accepted with following provisions: (1) Client commits to 24-hour response SLA, (2) After-hours work may be required, (3) Scope freeze effective immediately - any changes will de-prioritize original deliverables or extend timeline."'
      }
    },
    {
      id: 'technical-dependencies',
      name: 'Technical Dependencies & Integrations',
      weight: 10,
      question: 'How many third-party APIs, services, or client-controlled systems does this project depend on?',
      scale: {
        0: '5+ external dependencies or legacy system integrations',
        5: '2-3 external dependencies with documented APIs',
        10: 'Zero external dependencies or fully self-contained system'
      },
      recommendations: {
        low: 'Insert Change Order clause: "Client must provide production API keys, test environment access, and technical documentation for all third-party services within 2 business days of Change Order execution. Integration delays caused by vendor API changes, downtime, or inadequate documentation will extend timeline and may trigger additional billable hours."',
        moderate: 'Insert Change Order clause: "Third-party service integration timeline assumes stable, documented APIs. Breaking changes or deprecated endpoints discovered during integration will be addressed as separate Change Order. Contractor is not liable for third-party service performance or availability."',
        high: 'Insert Change Order clause: "Due to extensive technical dependencies, contractor provides integration layer only - not guarantees of third-party service functionality. Each integration failure requiring workaround will add [N] days to timeline. Client accepts risk of vendor service changes."'
      }
    },
    {
      id: 'client-technical-maturity',
      name: 'Client Technical Maturity',
      weight: 7,
      question: 'Does the client understand technical concepts, or will significant education/hand-holding be required?',
      scale: {
        0: 'Non-technical client requiring extensive explanations',
        5: 'Moderate technical literacy, occasional clarification needed',
        10: 'Highly technical client who understands architecture and constraints'
      },
      recommendations: {
        low: 'Insert Change Order clause: "Up to [N] hours of technical consultation and explanation included. Additional client education, training sessions, or technical documentation requests beyond this allocation will be billed at $[rate]/hour."',
        moderate: 'Insert Change Order clause: "Technical decision-making: When client requests technically infeasible or inadvisable approaches, contractor will provide written recommendation. If client insists on non-recommended approach, contractor is released from quality/performance guarantees for that component."',
        high: 'Insert Change Order clause: "Contractor reserves right to document technically unviable client requests and implement industry-standard alternatives. Excessive back-and-forth on settled technical decisions will be billed as consulting time at $[rate]/hour."'
      }
    },
    {
      id: 'payment-terms',
      name: 'Payment Milestones & Deposit Terms',
      weight: 11,
      question: 'What percentage is paid upfront, and are milestone payments tied to clear deliverables?',
      scale: {
        0: 'Payment on final completion only, no deposit',
        5: 'Small deposit (10-25%) with backend-heavy payment',
        10: '50%+ upfront deposit with milestone-based payments'
      },
      recommendations: {
        low: 'Insert Change Order clause: "Payment terms: 50% non-refundable deposit due upon Change Order execution, 50% due upon deliverable completion. Work will not commence until deposit clears. Final deliverables released only after full payment received."',
        moderate: 'Insert Change Order clause: "Milestone payment schedule: [%] upon kickoff, [%] at midpoint review, [%] upon final delivery. Each milestone payment must clear before subsequent phase begins. Invoices unpaid >10 days will pause all work."',
        high: 'Insert Change Order clause: "High-risk payment structure accepted with following terms: (1) All work remains contractor intellectual property until full payment, (2) Partial work will not be delivered until payment milestones met, (3) Late payment (>14 days) terminates contract and client forfeits access to work product."'
      }
    },
    {
      id: 'communication-sla',
      name: 'Communication SLA & Channels',
      weight: 6,
      question: 'Are communication expectations and response times explicitly defined?',
      scale: {
        0: 'No defined communication protocol or expected response times',
        5: 'Informal understanding of check-ins and updates',
        10: 'Documented SLA with response times and communication channels'
      },
      recommendations: {
        low: 'Insert Change Order clause: "Communication protocol: Contractor will provide weekly progress updates via [channel]. Client questions submitted via [channel] will receive response within 2 business days. After-hours/weekend communication not guaranteed. Urgent requests require [N]-hour notice minimum."',
        moderate: 'Insert Change Order clause: "Response SLA: Contractor 48-hour response time for non-urgent requests, 4-hour response for blocking issues during business hours. Client must respond to approval/feedback requests within 3 business days or contractor will proceed with reasonable interpretation."',
        high: 'Insert Change Order clause: "Communication boundaries: Contractor availability limited to [hours/days]. Requests outside defined channels (e.g., personal phone, unscheduled calls) will not be addressed. Emergency contact protocol requires [conditions]. Client non-responsiveness >5 business days will pause project and extend timeline."'
      }
    },
    {
      id: 'acceptance-criteria',
      name: 'Acceptance Criteria & Definition of Done',
      weight: 9,
      question: 'Is "done" objectively measurable, or subject to client\'s subjective judgment?',
      scale: {
        0: 'Highly subjective criteria (e.g., "looks good", "feels right")',
        5: 'Mix of objective and subjective acceptance criteria',
        10: 'Purely objective, testable acceptance criteria documented'
      },
      recommendations: {
        low: 'Insert Change Order clause: "Acceptance criteria: Deliverables deemed complete when [objective criteria met]. Subjective feedback ("I don\'t like the color") does not constitute rejection of deliverable. Client has 5 business days to identify objective defects preventing core functionality, or work is deemed accepted."',
        moderate: 'Insert Change Order clause: "Definition of Done: [List objective criteria]. Client acceptance/rejection must reference specific criteria from this list. General dissatisfaction without objective defect identification will not delay final payment or deliverable release."',
        high: 'Insert Change Order clause: "Due to subjective acceptance risk, contractor will deliver to documented specification only. Client accepts that aesthetic preferences, stylistic choices, and subjective opinions are not grounds for rejection. Only defects preventing documented functionality constitute valid rejection."'
      }
    },
    {
      id: 'change-order-protocol',
      name: 'Scope Change & Change Order Protocol',
      weight: 8,
      question: 'Does the client understand and accept that scope changes require formal change orders?',
      scale: {
        0: 'Client expects fluid scope with no change order process',
        5: 'Client aware of concept but may resist formal process',
        10: 'Client fully committed to documented change order workflow'
      },
      recommendations: {
        low: 'Insert Change Order clause: "Scope change protocol: Any request outside documented scope will trigger formal Change Order including cost estimate, timeline impact, and client written approval before work begins. Verbal agreements are non-binding. Contractor will not perform out-of-scope work without executed Change Order."',
        moderate: 'Insert Change Order clause: "Change freeze: Scope is locked as of [date]. All subsequent change requests will be logged, quoted, and queued for post-delivery implementation as separate engagement. In-flight changes will de-prioritize original deliverables."',
        high: 'Insert Change Order clause: "Due to scope volatility risk, contractor reserves right to pause work and re-quote project if cumulative change requests exceed 20% of original scope. Client attempting to bypass change order process via incremental requests will trigger contract renegotiation."'
      }
    },
    {
      id: 'asset-dependency',
      name: 'Asset / Input Dependency SLA',
      weight: 5,
      question: 'Are client-supplied assets (content, credentials, data) guaranteed to be delivered on time?',
      scale: {
        0: 'No commitment or history of client missing deadlines',
        5: 'Client commits to timelines but no penalty for delays',
        10: 'Client contractually bound to asset delivery SLA with consequences'
      },
      recommendations: {
        low: 'Insert Change Order clause: "Client asset delivery SLA: All content, credentials, brand materials, and input data must be delivered per attached schedule. Each day of client delay extends project deadline by 2 days. Work requiring missing assets will be paused. Prolonged delays (>10 business days) may terminate contract with payment for work completed."',
        moderate: 'Insert Change Order clause: "Asset dependency risk: Contractor will implement placeholder content for delayed client deliverables and invoice for rework time upon final asset receipt. Client delay exceeding [N] days will convert project to hourly billing model."',
        high: 'Insert Change Order clause: "Critical path assets: Client failure to deliver [specific assets] by [date] will automatically extend deadline and may trigger contract termination with client liable for [%] of total project fee as kill fee."'
      }
    },
    {
      id: 'vendor-risk',
      name: 'Third-Party Vendor / Infrastructure Risk',
      weight: 5,
      question: 'How much project success depends on vendors/infrastructure outside your control (hosting, CI/CD, etc.)?',
      scale: {
        0: 'Critical dependencies on client-managed or unstable infrastructure',
        5: 'Some reliance on third-party vendors with known risks',
        10: 'Contractor controls all infrastructure or zero external dependencies'
      },
      recommendations: {
        low: 'Insert Change Order clause: "Third-party vendor risk: Contractor provides best-effort integration with client-specified vendors but does not guarantee vendor uptime, performance, or feature availability. Vendor-caused delays, API deprecations, or service outages will extend timeline without contractor liability."',
        moderate: 'Insert Change Order clause: "Infrastructure disclaimer: Project assumes [vendor/platform] remains operational and API-stable. Vendor service disruptions, breaking changes, or discontinuation will trigger re-assessment of deliverables and may require Change Order for alternative approach."',
        high: 'Insert Change Order clause: "Critical vendor dependency: Success of this engagement is contingent on [vendor] continued operation and support. Contractor is not liable for project failure due to vendor issues. Client accepts risk of vendor lock-in and potential migration costs if vendor becomes unavailable."'
      }
    }
  ],

  /**
   * Risk tier thresholds and classifications
   */
  riskTiers: {
    low: { min: 0, max: 25, label: 'Low Risk', color: '#10b981', icon: '✅' },
    moderate: { min: 26, max: 55, label: 'Moderate Risk', color: '#f59e0b', icon: '⚠️' },
    high: { min: 56, max: 80, label: 'High Risk', color: '#ef4444', icon: '🚨' },
    severe: { min: 81, max: 100, label: 'Severe Risk', color: '#991b1b', icon: '🔥' }
  },

  /**
   * Validate and clamp input to 0-10 range
   * Handles null, undefined, NaN, strings, negative, and out-of-bounds values
   */
  validateInput(value) {
    // Reject non-primitive or invalid types (null, undefined, arrays, objects, booleans, symbols)
    if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'object' || typeof value === 'symbol') {
      return null;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '' || !/^-?\d+(\.\d+)?$/.test(trimmed)) {
        return null;
      }
    }

    // Convert to number
    const num = Number(value);

    // Check for NaN or non-finite
    if (isNaN(num) || !isFinite(num)) {
      return null;
    }

    // Clamp to 0-10 range and round to nearest integer
    return Math.max(0, Math.min(10, Math.round(num)));
  },

  /**
   * Calculate total risk score from dimension inputs
   * Returns { score: 0-100, tier: 'low'|'moderate'|'high'|'severe', breakdown: [...] }
   */
  calculateRiskScore(inputs) {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    const breakdown = [];

    this.dimensions.forEach(dim => {
      const rawInput = inputs[dim.id];
      const validatedInput = this.validateInput(rawInput);

      if (validatedInput === null) {
        // Skip dimensions with invalid input
        breakdown.push({
          dimension: dim.name,
          input: 'Invalid',
          contribution: 0,
          weight: dim.weight
        });
        return;
      }

      // Invert score: 10 = safest (0% risk), 0 = riskiest (100% risk)
      const riskLevel = (10 - validatedInput) / 10; // 0.0 to 1.0
      const dimensionRiskScore = riskLevel * dim.weight;

      totalWeightedScore += dimensionRiskScore;
      totalWeight += dim.weight;

      breakdown.push({
        dimension: dim.name,
        input: validatedInput,
        riskLevel: riskLevel,
        contribution: dimensionRiskScore,
        weight: dim.weight
      });
    });

    // Normalize to 0-100 scale
    const finalScore = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 0;

    // Determine tier
    let tier = 'low';
    if (finalScore >= this.riskTiers.severe.min) tier = 'severe';
    else if (finalScore >= this.riskTiers.high.min) tier = 'high';
    else if (finalScore >= this.riskTiers.moderate.min) tier = 'moderate';

    return {
      score: finalScore,
      tier: tier,
      breakdown: breakdown,
      tierInfo: this.riskTiers[tier]
    };
  },

  /**
   * Generate actionable recommendations based on risk profile
   * Returns array of { dimension, recommendation, priority }
   */
  generateRecommendations(inputs) {
    const recommendations = [];

    this.dimensions.forEach(dim => {
      const rawInput = inputs[dim.id];
      const validatedInput = this.validateInput(rawInput);

      if (validatedInput === null) {
        return; // Skip invalid inputs
      }

      // Determine risk level for this dimension
      let riskLevel = 'low';
      if (validatedInput <= 3) riskLevel = 'high';
      else if (validatedInput <= 6) riskLevel = 'moderate';

      if (riskLevel !== 'low') {
        recommendations.push({
          dimension: dim.name,
          dimensionId: dim.id,
          input: validatedInput,
          riskLevel: riskLevel,
          recommendation: dim.recommendations[riskLevel],
          priority: riskLevel === 'high' ? 'critical' : 'important'
        });
      }
    });

    // Sort by priority (critical first) then by input score (lowest first)
    recommendations.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority === 'critical' ? -1 : 1;
      }
      return a.input - b.input;
    });

    return recommendations;
  },

  /**
   * Insert selected recommendation into Change Order special notes field
   */
  insertRecommendationToChangeOrder(recommendation) {
    const coNotesField = document.getElementById('co-special-notes');
    if (!coNotesField) {
      console.error('Change Order special notes field not found');
      return false;
    }

    const currentValue = coNotesField.value.trim();
    const newClause = recommendation.recommendation;

    // Append with proper spacing
    coNotesField.value = currentValue
      ? `${currentValue}\n\n${newClause}`
      : newClause;

    // Trigger update of Change Order preview
    if (typeof updateChangeOrderPreview === 'function') {
      updateChangeOrderPreview();
    }

    // Show confirmation toast
    if (typeof showToast === 'function') {
      showToast(`✅ Protection clause added to Change Order: ${recommendation.dimension}`);
    }

    return true;
  },

  /**
   * Render the v2 diagnostic UI
   */
  renderUI(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    let html = '<div class="risk-diagnostic-v2-container">';
    html += '<div class="diagnostic-header">';
    html += '<h3>12-Dimension Risk Diagnostic (v2.0)</h3>';
    html += '<p class="text-muted">Rate each dimension from 0 (highest risk) to 10 (lowest risk)</p>';
    html += '</div>';

    html += '<form id="risk-diagnostic-v2-form" class="diagnostic-form">';

    this.dimensions.forEach((dim, index) => {
      html += `
        <div class="diagnostic-dimension-group">
          <div class="dimension-header">
            <label class="dimension-label">
              <span class="dimension-number">${index + 1}.</span>
              <span class="dimension-name">${dim.name}</span>
              <span class="dimension-weight">(Weight: ${dim.weight}%)</span>
            </label>
          </div>
          <p class="dimension-question">${dim.question}</p>
          <div class="dimension-scale-hints">
            <small class="scale-hint scale-0">0 = ${dim.scale[0]}</small>
            <small class="scale-hint scale-5">5 = ${dim.scale[5]}</small>
            <small class="scale-hint scale-10">10 = ${dim.scale[10]}</small>
          </div>
          <input
            type="number"
            id="rdv2-${dim.id}"
            name="${dim.id}"
            min="0"
            max="10"
            step="1"
            class="dimension-input"
            placeholder="0-10"
            required
          />
        </div>
      `;
    });

    html += '<button type="submit" class="btn btn-primary diagnostic-submit-btn">Calculate Risk Profile</button>';
    html += '</form>';

    html += '<div id="rdv2-results" class="diagnostic-results" style="display:none;"></div>';

    html += '</div>';

    container.innerHTML = html;

    // Attach form submit handler
    const form = document.getElementById('risk-diagnostic-v2-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }
  },

  /**
   * Handle form submission and display results
   */
  handleFormSubmit() {
    const form = document.getElementById('risk-diagnostic-v2-form');
    if (!form) return;

    // Collect inputs
    const inputs = {};
    this.dimensions.forEach(dim => {
      const field = document.getElementById(`rdv2-${dim.id}`);
      inputs[dim.id] = field ? field.value : null;
    });

    // Calculate score
    const result = this.calculateRiskScore(inputs);

    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs);

    // Render results
    this.renderResults(result, recommendations);

    // Log event if telemetry available
    if (typeof logEvent === 'function') {
      logEvent('risk_diagnostic_v2_calculated', {
        score: result.score,
        tier: result.tier,
        recommendationCount: recommendations.length
      });
    }
  },

  /**
   * Render results UI
   */
  renderResults(result, recommendations) {
    const resultsContainer = document.getElementById('rdv2-results');
    if (!resultsContainer) return;

    let html = '<div class="diagnostic-results-content">';

    // Score display
    html += '<div class="risk-meter-wrapper">';
    html += `<div class="risk-score-circle" style="border-color: ${result.tierInfo.color};">`;
    html += `<span class="risk-number" style="color: ${result.tierInfo.color};">${result.score}</span>`;
    html += '<span class="risk-total">/ 100</span>';
    html += '</div>';
    html += '<div class="risk-verdict-content">';
    html += `<h3 style="color: ${result.tierInfo.color};">${result.tierInfo.icon} ${result.tierInfo.label}</h3>`;
    html += `<p class="text-muted">Overall Project Risk Score: ${result.score}%</p>`;
    html += '</div>';
    html += '</div>';

    // Recommendations
    if (recommendations.length > 0) {
      html += '<div class="actionable-clauses-box mt-4">';
      html += `<h4>⚖️ ${recommendations.length} Recommended Contract Protections</h4>`;
      html += '<p class="text-muted">Click any recommendation to insert it into your Change Order builder</p>';
      html += '<ul class="recommendations-list">';

      recommendations.forEach((rec, index) => {
        const priorityBadge = rec.priority === 'critical'
          ? '<span class="priority-badge badge-critical">Critical</span>'
          : '<span class="priority-badge badge-important">Important</span>';

        html += `
          <li class="recommendation-item" data-rec-index="${index}">
            <div class="recommendation-header">
              <strong>${rec.dimension}</strong>
              ${priorityBadge}
              <span class="rec-score">Score: ${rec.input}/10</span>
            </div>
            <div class="recommendation-text">${rec.recommendation}</div>
            <button
              class="btn btn-sm btn-secondary insert-rec-btn"
              onclick="RiskDiagnosticV2.insertRecommendationToChangeOrder(${JSON.stringify(rec).replace(/"/g, '&quot;')})"
            >
              📝 Insert into Change Order
            </button>
          </li>
        `;
      });

      html += '</ul>';
      html += '</div>';
    } else {
      html += '<div class="no-recommendations mt-4">';
      html += '<p class="text-muted">✅ No critical risk factors detected. This project profile appears well-structured.</p>';
      html += '</div>';
    }

    // Score breakdown (collapsible)
    html += '<details class="score-breakdown mt-4">';
    html += '<summary>View Detailed Score Breakdown</summary>';
    html += '<table class="breakdown-table">';
    html += '<thead><tr><th>Dimension</th><th>Your Rating</th><th>Weight</th><th>Risk Contribution</th></tr></thead>';
    html += '<tbody>';
    result.breakdown.forEach(item => {
      html += `
        <tr>
          <td>${item.dimension}</td>
          <td>${item.input !== 'Invalid' ? `${item.input}/10` : 'N/A'}</td>
          <td>${item.weight}%</td>
          <td>${item.contribution.toFixed(1)}</td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    html += '</details>';

    html += '</div>';

    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

// Export for CommonJS / Node.js testing environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RiskDiagnosticV2;
}

// Export to window global for browser environments
if (typeof window !== 'undefined') {
  window.RiskDiagnosticV2 = RiskDiagnosticV2;
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Auto-render if target container exists
    const targetContainer = document.getElementById('risk-diagnostic-v2-container');
    if (targetContainer) {
      RiskDiagnosticV2.renderUI('risk-diagnostic-v2-container');
    }
  });
}
