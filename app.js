/**
 * ScopeGuard — Master Application Engine & State Controller
 * Fully client-side, zero-dependency, privacy-preserving business tool.
 */

// ==========================================
// 1. STATE & STORAGE
// ==========================================
const AppState = {
  theme: localStorage.getItem('sg_theme') || 'dark',
  isPro: localStorage.getItem('sg_is_pro') === 'true',
  leads: JSON.parse(localStorage.getItem('sg_leads') || '[]'),
  events: JSON.parse(localStorage.getItem('sg_events') || '[]'),
  currentView: 'calc-view'
};

// Log internal business event
function logEvent(name, data = {}) {
  const evt = { name, data, timestamp: new Date().toISOString() };
  AppState.events.push(evt);
  try {
    localStorage.setItem('sg_events', JSON.stringify(AppState.events.slice(-100)));
  } catch (e) {}
  console.log(`[ScopeGuard Event] ${name}:`, data);
}

// ==========================================
// 2. THEME & INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Apply initial theme
  document.documentElement.setAttribute('data-theme', AppState.theme);
  updateThemeIcon();

  // Theme toggle listener
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Initialize date in change order
  const dateInput = document.getElementById('co-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  // Bind calculator slider inputs
  setupCalculatorListeners();
  runCalculator();

  // Bind Change Order real-time input listeners
  setupChangeOrderListeners();
  updateChangeOrderPreview();

  // Initialize Risk Quiz questions
  renderRiskQuiz();

  // Navigation tab listeners
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab');
      if (targetTab) switchView(targetTab);
    });
  });

  logEvent('app_loaded', { theme: AppState.theme, isPro: AppState.isPro });
});

function toggleTheme() {
  AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', AppState.theme);
  localStorage.setItem('sg_theme', AppState.theme);
  updateThemeIcon();
  logEvent('theme_toggled', { theme: AppState.theme });
}

function updateThemeIcon() {
  const iconSpan = document.querySelector('.theme-icon');
  if (iconSpan) {
    iconSpan.textContent = AppState.theme === 'dark' ? '☀️' : '🌙';
  }
}

// ==========================================
// 3. TAB VIEW SWITCHER
// ==========================================
function switchView(viewId) {
  AppState.currentView = viewId;

  // Toggle View Panels
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const activePanel = document.getElementById(viewId);
  if (activePanel) activePanel.classList.add('active');

  // Toggle Tab Switcher Buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`.tab-btn[onclick*="${viewId}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Toggle Nav Links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-tab') === viewId) {
      link.classList.add('active');
    }
  });

  window.scrollTo({ top: 380, behavior: 'smooth' });
  logEvent('view_switched', { view: viewId });
}

// ==========================================
// 4. SCOPE CREEP CALCULATOR ENGINE
// ==========================================
function setupCalculatorListeners() {
  const inputs = [
    'calc-hourly-rate',
    'calc-unbilled-hours',
    'calc-project-weeks',
    'calc-contract-value',
    'calc-annual-projects'
  ];

  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', runCalculator);
    }
  });
}

function runCalculator() {
  const rate = parseFloat(document.getElementById('calc-hourly-rate').value) || 75;
  const unbilledPerWeek = parseFloat(document.getElementById('calc-unbilled-hours').value) || 4;
  const weeks = parseFloat(document.getElementById('calc-project-weeks').value) || 6;
  const contractValue = parseFloat(document.getElementById('calc-contract-value').value) || 4500;
  const annualProjects = parseFloat(document.getElementById('calc-annual-projects').value) || 8;

  // Update slider badge labels
  document.getElementById('val-hourly-rate').textContent = `$${rate}/hr`;
  document.getElementById('val-unbilled-hours').textContent = `${unbilledPerWeek} hrs/wk`;
  document.getElementById('val-project-weeks').textContent = `${weeks} weeks`;
  document.getElementById('val-contract-value').textContent = `$${contractValue.toLocaleString()}`;
  document.getElementById('val-annual-projects').textContent = `${annualProjects} projects/yr`;

  // Calculations
  const totalUnbilledHours = unbilledPerWeek * weeks;
  const projectLoss = totalUnbilledHours * rate;
  const totalHoursWorked = (contractValue / rate) + totalUnbilledHours;
  const realEffectiveRate = totalHoursWorked > 0 ? (contractValue / totalHoursWorked) : rate;
  const profitErodedPercent = contractValue > 0 ? ((projectLoss / (contractValue + projectLoss)) * 100) : 0;
  const annualLoss = projectLoss * annualProjects;
  const freeWeeks = (annualLoss / (rate * 40));

  // Render outputs
  document.getElementById('res-project-loss').textContent = `$${projectLoss.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  document.getElementById('res-hours-wasted').textContent = `${totalUnbilledHours.toFixed(1)} unpaid hours absorbed on this project`;
  document.getElementById('res-margin-squeeze').textContent = `-${profitErodedPercent.toFixed(1)}% Profit Reduction`;
  document.getElementById('res-real-rate').textContent = `$${realEffectiveRate.toFixed(2)} / hr (Agreed: $${rate})`;
  document.getElementById('res-annual-leak').textContent = `$${annualLoss.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} / year`;
  document.getElementById('res-free-weeks').textContent = `${freeWeeks.toFixed(1)} Entire Work Weeks`;

  // Update Hero Stat Banner
  document.getElementById('hero-stat-loss').textContent = `$${projectLoss.toLocaleString()}`;
  document.getElementById('hero-stat-hours').textContent = `${totalUnbilledHours.toFixed(0)} hrs`;
  document.getElementById('hero-stat-recovered').textContent = `$${(projectLoss * 0.9).toLocaleString(undefined, {maximumFractionDigits: 0})}`;
}

function resetCalculator() {
  document.getElementById('calc-hourly-rate').value = 75;
  document.getElementById('calc-unbilled-hours').value = 4;
  document.getElementById('calc-project-weeks').value = 6;
  document.getElementById('calc-contract-value').value = 4500;
  document.getElementById('calc-annual-projects').value = 8;
  runCalculator();
  showToast('Calculator parameters reset to standard industry averages');
}

function transferToChangeOrder() {
  const rate = parseFloat(document.getElementById('calc-hourly-rate').value) || 75;
  const unbilledPerWeek = parseFloat(document.getElementById('calc-unbilled-hours').value) || 4;
  const weeks = parseFloat(document.getElementById('calc-project-weeks').value) || 6;
  const totalExtraHours = unbilledPerWeek * weeks;
  const totalCalculatedLoss = totalExtraHours * rate;

  // Prepopulate Change Order with calculator findings
  document.getElementById('co-scope-desc').value = `Incorporation of ${totalExtraHours.toFixed(1)} hours of accumulated client revisions, impromptu design enhancements, and secondary feature deliverables outside primary Statement of Work.`;
  document.getElementById('co-fixed-amount').value = Math.round(totalCalculatedLoss);
  document.getElementById('co-timeline-extension').value = Math.max(3, Math.round(weeks * 0.5));

  updateChangeOrderPreview();
  switchView('co-view');
  showToast('✨ Calculator findings automatically mapped into Change Order!');
  logEvent('calc_transferred_to_co', { loss: totalCalculatedLoss, hours: totalExtraHours });
}

// ==========================================
// 5. CHANGE ORDER GENERATOR & PREVIEW
// ==========================================
function setupChangeOrderListeners() {
  const fields = [
    'co-client-name', 'co-provider-name', 'co-project-title', 'co-number',
    'co-date', 'co-scope-desc', 'co-fee-type', 'co-fixed-amount', 'co-hourly-rate',
    'co-estimated-hours', 'co-timeline-extension', 'co-revision-cap',
    'co-payment-terms', 'co-special-notes'
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateChangeOrderPreview);
      el.addEventListener('change', updateChangeOrderPreview);
    }
  });
}

function toggleFeeInputs() {
  const feeType = document.getElementById('co-fee-type').value;
  const fixedGroup = document.getElementById('group-fixed-fee');
  const hourlyGroup = document.getElementById('group-hourly-rate');

  if (feeType === 'fixed') {
    fixedGroup.style.display = 'block';
    hourlyGroup.style.display = 'none';
  } else {
    fixedGroup.style.display = 'none';
    hourlyGroup.style.display = 'block';
  }
  updateChangeOrderPreview();
}

function updateChangeOrderPreview() {
  const clientName = document.getElementById('co-client-name').value.trim() || 'Apex Digital Ltd.';
  const providerName = document.getElementById('co-provider-name').value.trim() || 'Shezi Studio';
  const projectTitle = document.getElementById('co-project-title').value.trim() || 'Custom Shopify Redesign';
  const coNum = document.getElementById('co-number').value.trim() || 'CO-001';
  const rawDate = document.getElementById('co-date').value;
  const scopeDesc = document.getElementById('co-scope-desc').value.trim() || 'Integration of multi-currency checkout gateway, custom tax calculator module, and 3 additional animated landing page sections not in original Statement of Work.';
  const feeType = document.getElementById('co-fee-type').value;
  const fixedAmount = parseFloat(document.getElementById('co-fixed-amount').value) || 850;
  const hourlyRate = parseFloat(document.getElementById('co-hourly-rate').value) || 85;
  const estHours = parseFloat(document.getElementById('co-estimated-hours').value) || 10;
  const timelineExt = document.getElementById('co-timeline-extension').value.trim() || '5';
  const revisionCap = document.getElementById('co-revision-cap').value;
  const paymentTerms = document.getElementById('co-payment-terms').value;
  const specialNotes = document.getElementById('co-special-notes').value.trim();

  // Format Date nicely
  let formattedDate = 'September 21, 2026';
  if (rawDate) {
    try {
      const d = new Date(rawDate + 'T00:00:00');
      formattedDate = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch(e) {}
  }

  // Format Fee String
  let feeString = `$${fixedAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD (Fixed Lump-Sum)`;
  if (feeType === 'hourly') {
    const totalEst = hourlyRate * estHours;
    feeString = `$${hourlyRate}/hr × ~${estHours} hrs (Estimated: $${totalEst.toLocaleString(undefined, {minimumFractionDigits: 2})} USD)`;
  }

  // Populate Document Sheet
  document.getElementById('doc-out-number').textContent = `Reference: ${coNum}`;
  document.getElementById('doc-out-date').textContent = formattedDate;
  document.getElementById('doc-out-client').textContent = clientName;
  document.getElementById('doc-out-provider').textContent = providerName;
  document.getElementById('doc-out-project').innerHTML = `This Change Order amends the original Master Services Agreement / Statement of Work for: <strong>${projectTitle}</strong>.`;
  document.getElementById('doc-out-scope').textContent = scopeDesc;
  document.getElementById('doc-out-fee').textContent = feeString;
  document.getElementById('doc-out-payment').textContent = paymentTerms;
  document.getElementById('doc-out-timeline').textContent = `+${timelineExt} business days added to original milestone completion date`;
  document.getElementById('doc-out-revisions').textContent = revisionCap;

  // Special Notes
  const specialNoteEl = document.getElementById('doc-out-special-note');
  if (specialNotes) {
    specialNoteEl.innerHTML = `<br>4. <strong>Special Clause:</strong> ${specialNotes}`;
    specialNoteEl.style.display = 'inline';
  } else {
    specialNoteEl.style.display = 'none';
  }

  // Signatures
  document.getElementById('doc-sig-client').textContent = `Name: ${clientName} (or authorized rep)`;
  document.getElementById('doc-sig-provider').textContent = `Name: ${providerName}`;
}

function loadSampleChangeOrder() {
  document.getElementById('co-client-name').value = 'Meridian Health Tech / Alex Vance';
  document.getElementById('co-provider-name').value = 'Shezi Cloud Architecture';
  document.getElementById('co-project-title').value = 'Patient Portal Web App API Integration';
  document.getElementById('co-number').value = 'CO-104';
  document.getElementById('co-scope-desc').value = 'Implementation of HIPAA-compliant SMS notification webhook and automated two-factor biometric verification workflow requested after architectural freeze.';
  document.getElementById('co-fixed-amount').value = 1450;
  document.getElementById('co-timeline-extension').value = 7;
  document.getElementById('co-special-notes').value = 'Client must provide active Twilio Health SIP credentials prior to test deployment.';
  updateChangeOrderPreview();
  showToast('Sample Change Order dataset loaded!');
}

function clearChangeOrderForm() {
  document.getElementById('co-client-name').value = '';
  document.getElementById('co-provider-name').value = '';
  document.getElementById('co-project-title').value = '';
  document.getElementById('co-scope-desc').value = '';
  document.getElementById('co-special-notes').value = '';
  updateChangeOrderPreview();
  showToast('Change Order form cleared');
}

function printChangeOrder() {
  updateChangeOrderPreview();
  logEvent('co_printed', { client: document.getElementById('co-client-name').value });
  window.print();
}

function copyMarkdownDocument() {
  updateChangeOrderPreview();
  const clientName = document.getElementById('doc-out-client').textContent;
  const providerName = document.getElementById('doc-out-provider').textContent;
  const coNum = document.getElementById('doc-out-number').textContent;
  const dateStr = document.getElementById('doc-out-date').textContent;
  const project = document.getElementById('co-project-title').value || 'Project';
  const scope = document.getElementById('doc-out-scope').textContent;
  const fee = document.getElementById('doc-out-fee').textContent;
  const payment = document.getElementById('doc-out-payment').textContent;
  const timeline = document.getElementById('doc-out-timeline').textContent;
  const revisions = document.getElementById('doc-out-revisions').textContent;

  const markdown = `# CHANGE ORDER AMENDMENT (${coNum})
**Date:** ${dateStr}
**Status:** PENDING WRITTEN AUTHORIZATION

---

### PARTIES:
- **Client:** ${clientName}
- **Service Provider:** ${providerName}
- **Project Reference:** ${project}

---

### 1. SCOPE OF ADDITIONAL WORK
${scope}

---

### 2. COMMERCIAL TERMS
| Item | Terms |
|---|---|
| **Additional Compensation** | ${fee} |
| **Payment Milestone** | ${payment} |
| **Timeline Adjustment** | ${timeline} |
| **Included Revision Rounds** | ${revisions} |

---

### 3. LEGAL COVENANTS & SIGN-OFF
1. Work shall commence solely upon receipt of written sign-off and required deposit.
2. All IP covenants and liability protections in the primary agreement remain in full effect.

**Client Signature:** ______________________  **Date:** ____________
**Provider Signature:** ____________________  **Date:** ____________

*Generated via ScopeGuard Autonomous Engine*
`;

  navigator.clipboard.writeText(markdown).then(() => {
    showToast('📋 Change Order copied as Markdown!');
    logEvent('co_copied_markdown');
  });
}

function copyChangeOrderText() {
  const text = document.getElementById('printable-change-order').innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Plain text document copied to clipboard!');
  });
}

// ==========================================
// 6. PROJECT RISK DIAGNOSTIC QUIZ (8 CRITICAL DIMENSIONS)
// ==========================================
const RiskQuestions = [
  {
    id: 'q1',
    title: '1. Specification Clarity: How clearly defined is the project scope & technical specifications?',
    options: [
      { text: 'A. Crystal clear, page-by-page Figma designs and bulletproof written functional specs', score: 0 },
      { text: 'B. General outline exists, but specific features and states are left to our discretion', score: 6 },
      { text: 'C. "We will know what we want when we see it" / High ambiguity and moving targets', score: 12 }
    ]
  },
  {
    id: 'q2',
    title: '2. Stakeholder Governance: How many client decision-makers must approve milestones?',
    options: [
      { text: 'A. Exactly 1 dedicated project owner with full signing authority', score: 0 },
      { text: 'B. 2-3 stakeholders who usually agree but occasionally request contrasting tweaks', score: 6 },
      { text: 'C. Committee / Board / Multiple executives with conflicting priorities and visions', score: 12 }
    ]
  },
  {
    id: 'q3',
    title: '3. Revision Policy: What revision cap is explicitly agreed in the contract?',
    options: [
      { text: 'A. Explicitly capped at 1 or 2 consolidated rounds in signed contract', score: 0 },
      { text: 'B. Vague "reasonable revisions" clause mentioned verbally or informally', score: 6 },
      { text: 'C. No revision cap stated at all / Client assumes unlimited redesigns & iterations', score: 12 }
    ]
  },
  {
    id: 'q4',
    title: '4. Timeline Realism: What are the client timeline expectations vs reality?',
    options: [
      { text: 'A. Generous buffer with realistic, flexible delivery milestones', score: 0 },
      { text: 'B. Tight deadline, but client provides assets and feedback promptly', score: 6 },
      { text: 'C. "We need this yesterday" / Hard immovable launch date with lagging client inputs', score: 13 }
    ]
  },
  {
    id: 'q5',
    title: '5. Technical Dependencies: Are there external APIs, legacy databases, or 3rd party blockers?',
    options: [
      { text: 'A. Zero external dependencies; modern, self-contained architecture', score: 0 },
      { text: 'B. Standard well-documented 3rd party APIs with test sandbox credentials provided', score: 6 },
      { text: 'C. Undocumented legacy systems, pending 3rd party vendor approvals, or untested APIs', score: 13 }
    ]
  },
  {
    id: 'q6',
    title: '6. Client Tech Maturity: How experienced is the client with digital workflows?',
    options: [
      { text: 'A. Highly tech-savvy; understands development lifecycle, staging servers, and git', score: 0 },
      { text: 'B. Moderate; understands basic web concepts but requires occasional guidance', score: 6 },
      { text: 'C. Non-technical; expects instant real-time changes directly on production with zero QA', score: 12 }
    ]
  },
  {
    id: 'q7',
    title: '7. Payment & Deposit Terms: What is the financial payment milestone structure?',
    options: [
      { text: 'A. 50% upfront deposit + milestone disbursements linked to written sign-offs', score: 0 },
      { text: 'B. 25-33% deposit with Net-15 balance on final delivery', score: 6 },
      { text: 'C. 0% upfront / "Pay on complete satisfaction" / Net-60 delayed terms', score: 13 }
    ]
  },
  {
    id: 'q8',
    title: '8. Communication SLA: How is feedback submitted and tracked?',
    options: [
      { text: 'A. Centralized issue tracker (Linear/Jira/Asana) with structured 48-hr SLA', score: 0 },
      { text: 'B. Email threads with occasional ad-hoc requests', score: 6 },
      { text: 'C. Fragmented WhatsApp, SMS, Slack DMs, and weekend phone calls at all hours', score: 13 }
    ]
  }
];

function renderRiskQuiz() {
  const container = document.getElementById('quiz-questions-box');
  if (!container) return;

  container.innerHTML = '';
  RiskQuestions.forEach(q => {
    const qCard = document.createElement('div');
    qCard.className = 'quiz-question-card';
    qCard.innerHTML = `
      <div class="quiz-q-title">${q.title}</div>
      <div class="quiz-options">
        ${q.options.map((opt, idx) => `
          <label class="quiz-opt-label">
            <input type="radio" name="${q.id}" value="${opt.score}" onchange="calculateRiskScore()">
            <span>${opt.text}</span>
          </label>
        `).join('')}
      </div>
    `;
    container.appendChild(qCard);
  });
}

function calculateRiskScore() {
  let totalScore = 0;
  let answeredCount = 0;

  RiskQuestions.forEach(q => {
    const selected = document.querySelector(`input[name="${q.id}"]:checked`);
    if (selected) {
      totalScore += parseInt(selected.value);
      answeredCount++;
    }
  });

  if (answeredCount === RiskQuestions.length) {
    const resultsBox = document.getElementById('quiz-results-box');
    resultsBox.style.display = 'block';

    const scoreVal = document.getElementById('quiz-score-val');
    scoreVal.textContent = totalScore;

    const badge = document.getElementById('risk-score-badge');
    const title = document.getElementById('quiz-verdict-title');
    const desc = document.getElementById('quiz-verdict-desc');
    const clausesList = document.getElementById('quiz-clauses-list');
    clausesList.innerHTML = '';

    if (totalScore <= 25) {
      badge.style.borderColor = 'var(--success)';
      badge.style.background = 'var(--success-bg)';
      scoreVal.style.color = 'var(--success)';
      title.textContent = '🟢 LOW RISK PROJECT (Safe to Proceed)';
      desc.textContent = 'This client exhibits healthy scoping maturity. Standard contract clauses and a standard 2-round revision cap will protect you adequately.';
      clausesList.innerHTML = `
        <li>✓ <strong>Standard 2-Round Revision Cap:</strong> Revisions consolidated in writing within 5 business days.</li>
        <li>✓ <strong>Client Dependency SLA:</strong> Client agrees to deliver brand assets and copy within 3 business days of request.</li>
      `;
    } else if (totalScore <= 60) {
      badge.style.borderColor = 'var(--warning)';
      badge.style.background = 'var(--warning-bg)';
      scoreVal.style.color = 'var(--warning)';
      title.textContent = '🟡 MODERATE RISK (Guardrails Mandatory)';
      desc.textContent = 'Significant scope leakage expected during mid-build review. You must introduce strict change order thresholds, consolidated feedback, and single-point-of-contact governance.';
      clausesList.innerHTML = `
        <li>⚠️ <strong>Single Point of Contact Clause:</strong> Client designates 1 primary representative with sole authority to issue approvals and change requests.</li>
        <li>⚠️ <strong>Consolidated Feedback Protocol:</strong> All revision requests must be collated into a single master document before work commences.</li>
        <li>⚠️ <strong>Hourly Overrun Gate:</strong> Any requested feature not explicitly enumerated in the Statement of Work is billed at your standard rate with 50% upfront deposit.</li>
        <li>⚠️ <strong>Third-Party Blocker Clause:</strong> Delays resulting from 3rd party API credentials automatically extend milestone delivery dates 1:1.</li>
      `;
    } else {
      badge.style.borderColor = 'var(--danger)';
      badge.style.background = 'var(--danger-bg)';
      scoreVal.style.color = 'var(--danger)';
      title.textContent = '🔴 CRITICAL RISK (High Financial Danger)';
      desc.textContent = 'WARNING: Highly chaotic project profile. Without aggressive upfront protection, you risk losing 30-50% of your profit margin to unbilled rework and endless unpaid cycles.';
      clausesList.innerHTML = `
        <li>🚨 <strong>Mandatory Paid Discovery Sprint:</strong> Do NOT quote fixed price upfront. Bill a non-refundable $1,500-$3,000 discovery sprint to draft complete technical specifications.</li>
        <li>🚨 <strong>Milestone Sign-Off Freeze:</strong> Once a design or code milestone receives written sign-off, any retroactive revisions automatically trigger a formal Change Order Amendment.</li>
        <li>🚨 <strong>Client Delay Compensation Rule:</strong> Client review delays exceeding 5 business days pause all work and incur a 10% project restart re-allocation fee.</li>
        <li>🚨 <strong>Out-of-Hours Communication Gate:</strong> All project communication must take place via official email or project management portal; weekend emergencies billed at 2x rate.</li>
      `;
    }

    logEvent('risk_quiz_completed', { score: totalScore });
  }
}

function resetRiskQuiz() {
  document.querySelectorAll('.quiz-options input[type="radio"]').forEach(r => r.checked = false);
  document.getElementById('quiz-results-box').style.display = 'none';
  showToast('Risk quiz reset');
}

function loadQuizClausesToChangeOrder() {
  const clauses = Array.from(document.querySelectorAll('#quiz-clauses-list li')).map(li => li.innerText).join('\n');
  document.getElementById('co-special-notes').value = clauses;
  updateChangeOrderPreview();
  switchView('co-view');
  showToast('🛡️ Protective clauses copied into Change Order builder!');
}

// ==========================================
// 7. SCRIPT COPIER
// ==========================================
function copyScript(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Email template copied to clipboard!');
    logEvent('script_copied', { scriptId: elementId });
  });
}

// ==========================================
// 8. VIRAL SHARING & DRAFT IMPORT/EXPORT
// ==========================================
function shareCalculation(platform) {
  const lossText = document.getElementById('res-project-loss').textContent || '$1,800.00';
  const annualLeak = document.getElementById('res-annual-leak').textContent || '$14,400.00';
  const shareUrl = window.location.origin && window.location.origin !== 'null' ? window.location.origin : 'https://scopeguard.app';

  const tweet = `I just calculated my freelance scope creep financial leak using ScopeGuard:\n💸 Project Loss: ${lossText}\n📉 Annual Leak: ${annualLeak}\n\nStop working for free. Calculate yours: ${shareUrl}`;

  if (platform === 'twitter') {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    logEvent('shared_calculation', { platform: 'twitter' });
  } else if (platform === 'linkedin') {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    logEvent('shared_calculation', { platform: 'linkedin' });
  } else if (platform === 'copy') {
    navigator.clipboard.writeText(tweet).then(() => {
      showToast('🔗 Calculation summary copied to clipboard!');
      logEvent('shared_calculation', { platform: 'copy' });
    });
  }
}

function saveDraftJSON() {
  const coNum = document.getElementById('co-number') ? document.getElementById('co-number').value : 'CO-001';
  const draftData = {
    version: '1.0',
    savedAt: new Date().toISOString(),
    formData: {
      clientName: document.getElementById('co-client-name')?.value || '',
      providerName: document.getElementById('co-provider-name')?.value || '',
      projectTitle: document.getElementById('co-project-title')?.value || '',
      coNumber: document.getElementById('co-number')?.value || 'CO-001',
      coDate: document.getElementById('co-date')?.value || '',
      scopeDesc: document.getElementById('co-scope-desc')?.value || '',
      feeType: document.getElementById('co-fee-type')?.value || 'fixed',
      fixedAmount: document.getElementById('co-fixed-amount')?.value || '850',
      hourlyRate: document.getElementById('co-hourly-rate')?.value || '85',
      estimatedHours: document.getElementById('co-estimated-hours')?.value || '10',
      timelineExtension: document.getElementById('co-timeline-extension')?.value || '5',
      revisionCap: document.getElementById('co-revision-cap')?.value || '1 consolidated round of minor tweaks',
      paymentTerms: document.getElementById('co-payment-terms')?.value || '100% upfront prior to commencing out-of-scope work',
      specialNotes: document.getElementById('co-special-notes')?.value || ''
    }
  };

  const blob = new Blob([JSON.stringify(draftData, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  const safeNum = (coNum || 'Draft').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `ScopeGuard_CO_${safeNum}_${new Date().toISOString().slice(0, 10)}.json`;
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);

  showToast('💾 Change order draft exported as JSON!');
  logEvent('draft_json_saved');
}

function triggerLoadDraftJSON() {
  document.getElementById('draft-file-input').click();
}

function handleDraftFileSelect(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const draft = JSON.parse(e.target.result);
      if (!draft.formData) {
        throw new Error('Invalid ScopeGuard draft format.');
      }
      const data = draft.formData;
      if (document.getElementById('co-client-name')) document.getElementById('co-client-name').value = data.clientName || data.clientCompany || '';
      if (document.getElementById('co-provider-name')) document.getElementById('co-provider-name').value = data.providerName || data.yourName || '';
      if (document.getElementById('co-project-title')) document.getElementById('co-project-title').value = data.projectTitle || '';
      if (document.getElementById('co-number')) document.getElementById('co-number').value = data.coNumber || data.amendmentNumber || 'CO-001';
      if (document.getElementById('co-date')) document.getElementById('co-date').value = data.coDate || data.issueDate || '';
      if (document.getElementById('co-scope-desc')) document.getElementById('co-scope-desc').value = data.scopeDesc || data.requestSummary || '';
      if (document.getElementById('co-fee-type')) {
        document.getElementById('co-fee-type').value = data.feeType || 'fixed';
        toggleFeeInputs();
      }
      if (document.getElementById('co-fixed-amount')) document.getElementById('co-fixed-amount').value = data.fixedAmount || data.costImpact || '850';
      if (document.getElementById('co-hourly-rate')) document.getElementById('co-hourly-rate').value = data.hourlyRate || '85';
      if (document.getElementById('co-estimated-hours')) document.getElementById('co-estimated-hours').value = data.estimatedHours || '10';
      if (document.getElementById('co-timeline-extension')) document.getElementById('co-timeline-extension').value = data.timelineExtension || data.timeImpact || '5';
      if (document.getElementById('co-revision-cap')) document.getElementById('co-revision-cap').value = data.revisionCap || '1 consolidated round of minor tweaks';
      if (document.getElementById('co-payment-terms')) document.getElementById('co-payment-terms').value = data.paymentTerms || '100% upfront prior to commencing out-of-scope work';
      if (document.getElementById('co-special-notes')) document.getElementById('co-special-notes').value = data.specialNotes || '';

      updateChangeOrderPreview();
      showToast('📂 Change order draft loaded successfully!');
      logEvent('draft_json_loaded');
    } catch (err) {
      showToast('❌ Failed to parse JSON draft: ' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// ==========================================
// 9. PRO MODAL & MONETIZATION
// ==========================================
function openProModal() {
  document.getElementById('pro-modal').classList.add('active');
  logEvent('pro_modal_opened');
}

function closeProModal() {
  document.getElementById('pro-modal').classList.remove('active');
}

function applyCoupon() {
  const code = document.getElementById('coupon-code').value.trim().toUpperCase();
  const feedback = document.getElementById('coupon-feedback');

  if (code === 'AUTONOMOUS100') {
    AppState.isPro = true;
    localStorage.setItem('sg_is_pro', 'true');
    feedback.innerHTML = '<span class="text-success" style="font-size:13px; font-weight:700;">🎉 100% OFF VIP Pass Activated! Pro Features Unlocked.</span>';
    showToast('✨ Welcome to ScopeGuard Pro Lifetime!');
    setTimeout(() => {
      closeProModal();
    }, 1500);
    logEvent('coupon_redeemed', { code });
  } else {
    feedback.innerHTML = '<span class="text-danger" style="font-size:13px;">Invalid coupon code. Try: AUTONOMOUS100</span>';
  }
}

function simulateCheckout(tier) {
  logEvent('checkout_initiated', { tier });
  showToast(`🚀 Initializing secure Stripe checkout for ${tier}...`);
  setTimeout(() => {
    alert(`[Stripe Checkout Hook]\n\nProduct: ScopeGuard ${tier}\nStatus: Ready for Live API Key.\n\nTo complete this transaction, connect your Stripe Payment Link in settings.`);
  }, 400);
}

// ==========================================
// 10. LEAD MAGNET & SCOPE DEFENSE VAULT
// ==========================================
function handleLeadCapture(e) {
  e.preventDefault();
  const emailInput = document.getElementById('lead-email');
  const email = emailInput.value.trim();

  if (email) {
    AppState.leads.push({ email, date: new Date().toISOString() });
    localStorage.setItem('sg_leads', JSON.stringify(AppState.leads));
    emailInput.value = '';
    showToast('🎉 Access Granted! Unlocking your Scope Defense Vault...');
    logEvent('lead_captured', { email });
    setTimeout(() => {
      openVaultModal();
    }, 600);
  }
}

function openVaultModal() {
  const modal = document.getElementById('vault-modal');
  if (modal) modal.classList.add('active');
  logEvent('vault_modal_opened');
}

function closeVaultModal() {
  const modal = document.getElementById('vault-modal');
  if (modal) modal.classList.remove('active');
}

function openLegalModal() {
  const modal = document.getElementById('legal-modal');
  if (modal) modal.classList.add('active');
  logEvent('legal_modal_opened');
}

function closeLegalModal() {
  const modal = document.getElementById('legal-modal');
  if (modal) modal.classList.remove('active');
}

function copyTextToClipboard(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Master legal clause copied to clipboard!');
    logEvent('vault_clause_copied', { id: elementId });
  });
}

function downloadVaultPack() {
  const clauses = `SCOPEGUARD AGENCY SCOPE DEFENSE VAULT
==================================================
CONFIDENTIAL FREELANCE & AGENCY MASTER LEGAL CLAUSES
Generated by ScopeGuard (https://scopeguard.app)

[CLAUSE 1: THE SINGLE-POINT-OF-CONTACT CLAUSE]
--------------------------------------------------
"Client designates one (1) primary project representative ('Authorized Representative') who possesses exclusive authority to request modifications, approve deliverables, and issue written sign-offs on behalf of Client. Contractor shall not be obligated to implement feedback, instructions, or critique provided by any other stakeholder or executive unless formally transmitted through the Authorized Representative."

[CLAUSE 2: THE CONSOLIDATED REVISION ROUND CLAUSE]
--------------------------------------------------
"Each milestone includes up to two (2) consolidated rounds of revisions. A 'round of revisions' is defined as a single, comprehensive, non-contradictory written list of specific modifications submitted simultaneously by Client within five (5) business days of deliverable submission. Piecemeal feedback, Slack/WhatsApp requests, or disjointed comments from multiple team members shall not constitute an actionable revision round."

[CLAUSE 3: THE RETROACTIVE REVISION CHANGE ORDER CLAUSE]
--------------------------------------------------
"Written approval or milestone payment acceptance of any design mockup, architectural blueprint, wireframe, or code sprint constitutes full and final acceptance of that milestone. Any subsequent request to modify approved deliverables shall be deemed Out-of-Scope and shall require the execution of a formal Change Order Amendment with separate compensation and timeline adjustments."

[CLAUSE 4: THE CLIENT DELAY TIMELINE EXTENSION CLAUSE]
--------------------------------------------------
"Project milestones and final delivery dates are strictly contingent upon timely Client cooperation. If Client fails to provide necessary assets, API credentials, copy, or milestone feedback within three (3) business days of Contractor's written request, all future milestone deadlines shall automatically be extended on a two-for-one (2:1) calendar day basis."

[CLAUSE 5: THE OUT-OF-SCOPE HOURLY RATE GATE]
--------------------------------------------------
"Any work, service, or consultation requested by Client that falls outside the explicit Statement of Work (SOW) shall be billed at Contractor's standard supplemental hourly rate of $XXX.00/hr in minimum 1-hour increments, requiring a 50% upfront deposit prior to execution."
`;

  const blob = new Blob([clauses], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'ScopeGuard_Master_Scope_Defense_Clauses.txt';
  link.click();
  URL.revokeObjectURL(link.href);

  showToast('📥 Master Scope Defense Vault downloaded!');
  logEvent('vault_pack_downloaded');
}

function trackAffiliateClick(toolName) {
  logEvent('affiliate_click', { tool: toolName });
}

// ==========================================
// 11. EXECUTIVE TELEMETRY & OPERATIONS CONSOLE
// ==========================================
function openTelemetryModal() {
  renderTelemetryData();
  const modal = document.getElementById('telemetry-modal');
  if (modal) modal.classList.add('active');
  logEvent('telemetry_modal_opened');
}

function closeTelemetryModal() {
  const modal = document.getElementById('telemetry-modal');
  if (modal) modal.classList.remove('active');
}

function renderTelemetryData() {
  const leadsCount = AppState.leads ? AppState.leads.length : 0;
  const eventsCount = AppState.events ? AppState.events.length : 0;

  const mLeads = document.getElementById('m-leads-count');
  const mEvents = document.getElementById('m-events-count');
  const mPro = document.getElementById('m-pro-status');
  const mDaily = document.getElementById('m-daily-runrate');

  if (mLeads) mLeads.textContent = leadsCount;
  if (mEvents) mEvents.textContent = eventsCount;
  if (mPro) mPro.textContent = AppState.isPro ? 'PRO (Active)' : 'FREE TIER';
  if (mDaily) mDaily.textContent = AppState.isPro ? '$29.00' : '$0.00';

  const logBody = document.getElementById('telemetry-event-logs');
  if (logBody) {
    if (!AppState.events || AppState.events.length === 0) {
      logBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:var(--text-muted); padding:16px;">No telemetry events recorded in this session yet.</td></tr>';
    } else {
      const recent = AppState.events.slice(-12).reverse();
      logBody.innerHTML = recent.map(ev => `
        <tr>
          <td style="color:var(--text-muted); font-size:11px;">${new Date(ev.timestamp).toLocaleTimeString()}</td>
          <td><span class="badge" style="background:rgba(99,102,241,0.15); color:var(--primary); font-size:11px; padding:2px 6px;">${escapeHtml(ev.name)}</span></td>
          <td style="color:var(--text-secondary); font-size:12px;">${escapeHtml(JSON.stringify(ev.payload || {}))}</td>
        </tr>
      `).join('');
    }
  }
}

function exportLeadsCSV() {
  if (!AppState.leads || AppState.leads.length === 0) {
    showToast('⚠️ No subscriber leads collected yet.');
    return;
  }

  const csvRows = [
    ['Email', 'Captured_Timestamp', 'Status']
  ];

  AppState.leads.forEach(l => {
    csvRows.push([`"${l.email}"`, `"${l.date}"`, '"Subscribed - Scope Vault"']);
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ScopeGuard_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('📥 Leads exported to CSV!');
  logEvent('leads_csv_exported');
}

// ==========================================
// 12. TOAST NOTIFICATION UTILITY
// ==========================================
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
