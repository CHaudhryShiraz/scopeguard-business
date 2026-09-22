/* ============================================================
   ScopeGuard — 10-Script Master Tactical Playbook
   Expansion of scripts-view section
   ============================================================
   PLACEHOLDER GRAMMAR USED IN ALL TEMPLATES:
     {{CLIENT_NAME}}        — Recipient's name
     {{YOUR_NAME}}          — Sender's name
     {{PROJECT_NAME}}       — Project title
     {{MILESTONE}}          — Current milestone or deliverable
     {{DATE}}               — Specific date (e.g. April 12, 2026)
     {{AMOUNT}}             — Dollar amount (e.g. $650)
     {{PERCENT}}            — Percentage (e.g. 30%)
     {{DAYS}}               — Day count (e.g. 5)
     {{REVISIONS}}          — Revision rounds already used vs cap
     {{RATE}}               — Hourly rate
     {{EST_HOURS}}          — Estimated hours
     {{STAKEHOLDER}}        — New stakeholder name
     {{FEATURE}}            — Specific feature/tweak description
     {{SPRINT}}             — Sprint or phase identifier
     {{DRIFT_REASON}}       — Why the meeting overran
     {{PROJECT_DEADLINE}}   — Original final delivery date
     {{INVOICE_NUM}}        — Invoice reference number
     {{DUE_DATE}}           — Date payment was due
     {{BALANCE}}            — Outstanding amount
     {{SETTLEMENT_FEE}}     — Kill fee amount
     {{SOW_REF}}            — Master SOW reference number
   ============================================================ */

/* ============================================================
   1. POLITE PUSHBACK — PHASE 2 QUEUE (Script #1)
   ============================================================ */
const SG_SCRIPT_1 = `Hi {{CLIENT_NAME}},

Thanks so much for sending {{FEATURE}} over — I can absolutely see how that would strengthen the final product, and I appreciate you flagging it now while we still have planning room.

Because this falls outside the deliverables enumerated in our original Statement of Work for {{PROJECT_NAME}} (which is centered on {{MILESTONE}}), we have two clean paths to keep your launch on schedule and your budget under your control:

1. **Queue it for Phase 2 (recommended):** We lock in our current launch trajectory, ship the agreed {{MILESTONE}} on {{PROJECT_DEADLINE}}, and immediately slot {{FEATURE}} into our post-launch sprint as the first Phase 2 backlog item. You'll get priority scheduling once the current milestone closes.

2. **Execute a fast-track Change Order now:** I can draft a one-page amendment adding {{FEATURE}} into the current milestone for {{AMOUNT}}, with a {{DAYS}}-day timeline extension and 2 consolidated revision rounds. We can have it signed and start work within 24 hours.

Which option aligns best with your launch priorities? If you'd like, I can put the Change Order on the calendar for tomorrow's review.

Best regards,
{{YOUR_NAME}}`;

/* ============================================================
   2. FAST CHANGE ORDER PROPOSAL (Script #2)
   ============================================================ */
const SG_SCRIPT_2 = `Hi {{CLIENT_NAME}},

Following up on our discussion about {{FEATURE}} — I've drafted the formal Change Order Amendment so we can lock this in cleanly and protect both of our timelines.

**Change Order Summary — {{PROJECT_NAME}}**
- **Out-of-Scope Deliverable:** {{FEATURE}}
- **Additional Compensation:** {{AMOUNT}} (fixed lump-sum, OR {{RATE}}/hr × ~{{EST_HOURS}} hrs with cap)
- **Timeline Adjustment:** +{{DAYS}} business days added to current milestone close
- **Revision Cap:** 2 rounds of consolidated written feedback
- **Payment Trigger:** 50% deposit before kickoff, 50% on delivery

I've attached the signed PDF for your countersignature. Once the deposit clears and we have your written sign-off (a reply email works fine), I'll slot {{FEATURE}} into {{SPRINT}} and re-issue the project calendar with the new delivery date.

If anything in the scope description or pricing needs a quick adjustment before you sign, just reply with the change and I'll re-issue the document within the hour.

Thanks for moving fast on this — the sooner we sign, the sooner we ship.

Best regards,
{{YOUR_NAME}}`;

/* ============================================================
   3. THE "QUICK FAVOR" PIVOT — Small Tweaks That Add Up (Script #3)
   ============================================================ */
const SG_SCRIPT_3 = `Hi {{CLIENT_NAME}},

Got it — happy to take a look at {{FEATURE}}. Before I dive in, a quick logistical heads-up so we're on the same page:

We've now crossed {{REVISIONS}} "quick tweaks" beyond our original Statement of Work on {{PROJECT_NAME}}. Individually each one is genuinely small (15–30 minutes), but when I add them up, I'm tracking roughly {{EST_HOURS}} unbilled hours of post-launch refinement since {{DATE}} — time I genuinely don't mind spending, but time I also can't sustainably absorb if it keeps up through final delivery.

Here are the cleanest options moving forward:

1. **Reset and consolidate:** We pause briefly, you send me one consolidated "tweaks list" with all remaining refinements, and I knock them out in a single 2-round revision sprint that's already included in our scope.

2. **Add a Tweak-Pack Change Order:** I add a 5-hour "post-launch tweak reserve" to the contract at {{RATE}}/hr ({{AMOUNT}}) for any additional micro-adjustments. Use it or roll it over.

3. **Hourly on demand:** Anything beyond the consolidated sprint is billed at {{RATE}}/hr in 30-minute increments, invoiced weekly.

Option 1 is free and gets us back on track fastest — Option 2 is best if you'd like a buffer for the rest of the project. Which works for you?

Best regards,
{{YOUR_NAME}}`;

/* ============================================================
   4. MEETING DISCIPLINE REQUEST — Billing Runaway Strategy Calls (Script #4)
   ============================================================ */
const SG_SCRIPT_4 = `Hi {{CLIENT_NAME}},

I want to be transparent about something before it becomes friction on {{PROJECT_NAME}} — our strategy and review meetings have been running longer than our original scope anticipated.

Per our Statement of Work, the project budget includes **2 hours per week of scheduled meeting time** (sync calls, async Loom reviews, stakeholder alignment sessions). Over the last {{DAYS}} days, we've tracked:

- **{{EST_HOURS}} hours** of unscheduled strategy calls
- **{{DAYS}} hours** of weekend Slack huddles on {{DRIFT_REASON}}
- Multiple ad-hoc Zooms that weren't on the agenda

I'm not raising this to be difficult — these conversations have actually moved the project forward in important ways, and I value the partnership. But I want to keep our economics honest so I can keep giving you my full attention.

**Going forward, I'd like to propose a Meeting Discipline Framework:**

1. **Scheduled meetings stay in-scope** (2 hrs/week, agenda-driven).
2. **Out-of-scope strategy work** (deep dives, additional stakeholder syncs, post-mortems, exploration sessions) is billed at {{RATE}}/hr in 30-minute increments, OR rolled into a "Strategy Reserve" of {{AMOUNT}} for 10 additional hours.
3. **Async by default:** If we can replace a 1-hour Zoom with a 5-minute Loom + written doc, we save you money and ship faster.

I'll continue treating the in-scope meetings as a partnership cost — I just need to draw a clean line around anything beyond that so we both have predictable numbers.

Let me know if you'd like to hop on a 15-minute call this week to align on the framework, or if you'd like me to just send over the Strategy Reserve Change Order for signature.

Best regards,
{{YOUR_NAME}}`;

/* ============================================================
   5. ENDLESS REVISION CAP ENFORCER (Script #5)
   ============================================================ */
const SG_SCRIPT_5 = `Hi {{CLIENT_NAME}},

I've gone through the latest feedback round on {{MILESTONE}} of {{PROJECT_NAME}}, and I want to flag where we are on revisions before I scope the work.

Per our signed agreement, this milestone includes **{{REVISIONS}} rounds of consolidated revisions.** As of today's message, we are at:

- **Round 1** (submitted {{DATE}}): 14 specific items, fully addressed
- **Round 2** (submitted {{DATE}}): 22 specific items, fully addressed
- **Round 3** (this submission, {{DATE}}): {{EST_HOURS}} items across {{DAYS}} different documents

To honor the agreement we both signed and protect the final delivery date of {{PROJECT_DEADLINE}}, I have two responsible options:

**Option A — Reset to a fresh consolidated round:**
Please take 3 business days to gather ALL remaining feedback from {{STAKEHOLDER}} and every other stakeholder, send it to me as a single numbered list (max 15 items), and I'll execute Round 3 properly within 5 business days. This stays in-scope.

**Option B — Move to paid refinement sprint:**
If rounds 3+ need to keep flowing without consolidation, I'll execute them as a refinement sprint at {{RATE}}/hr (estimated {{EST_HOURS}} hours = {{AMOUNT}}), billed against a new Change Order attached for your sign-off.

I genuinely want to deliver an excellent final product — and the consolidation step is what makes "excellent" possible without us both burning out before launch. Let me know which path you'd like to take.

Best regards,
{{YOUR_NAME}}`;

/* ============================================================
   6. CLIENT DELAY / TIMELINE RESET NOTICE (Script #6)
   ============================================================ */
const SG_SCRIPT_6 = `Hi {{CLIENT_NAME}},

I want to give you a transparent status update on {{PROJECT_NAME}} and reset our timeline expectations before we lose any more ground.

**Current Status — As of {{DATE}}:**
- Pending from your side: {{FEATURE}}
- Last received asset / feedback: {{DUE_DATE}} ({{DAYS}} days ago)
- Project originally scheduled to close: {{PROJECT_DEADLINE}}
- Revised projected close (based on current pace): {{AMOUNT}} days late

Per the Client Cooperation clause in our Statement of Work (Section 4), milestone deadlines depend on receiving required inputs within 3 business days. Because we've been waiting on the items above, our team's production calendar has shifted twice and I've had to reallocate {{EST_HOURS}} hours of engineering capacity to other client commitments to keep my other launch promises.

**Here is what I'd like to propose to get us back on track:**

1. **Hard deadline reset:** Effective today, all future milestones shift by +{{DAYS}} business days. Final delivery is now {{PROJECT_DEADLINE}}.

2. **Dependency SLA:** To prevent further drift, please send a confirmed delivery date for the outstanding assets by {{DUE_DATE}}. Anything received after that will trigger an additional 1:1 timeline extension per day of delay.

3. **Re-mobilization fee (waived this once):** Normally a project pause of {{DAYS}}+ days triggers a {{AMOUNT}} re-allocation surcharge to recover lost sprint slot. I'm waiving it as a one-time courtesy because I know these things happen — but I do need the dependency SLA above so we don't repeat it.

Let me know if {{DUE_DATE}} works for the asset delivery, and I'll issue the revised project calendar by end of day.

Best regards,
{{YOUR_NAME}}`;

/* ============================================================
   7. BUDGET EXHAUSTION NOTICE (Script #7)
   ============================================================ */
const SG_SCRIPT_7 = `Hi {{CLIENT_NAME}},

I want to surface something important before it becomes an awkward surprise on {{PROJECT_NAME}}.

**Budget Status — As of {{DATE}}:**
- Original contract value: {{AMOUNT}}
- Hours expended to date: {{EST_HOURS}} of {{REVISIONS}} contracted hours
- Remaining contracted hours: ~{{REVISIONS}} hours
- Pending work (your request, not yet started): {{FEATURE}}

We are approaching the contracted budget ceiling. To complete {{FEATURE}} and the remaining {{MILESTONE}} deliverables properly, I need to either:

**Option 1 — Phase {{FEATURE}} into a Change Order:**
I add {{FEATURE}} as a separate amendment for {{AMOUNT}} ({{RATE}}/hr × ~{{EST_HOURS}} hours), preserving the remaining {{REVISIONS}} hours for the originally scoped {{MILESTONE}} deliverables. We sign and proceed.

**Option 2 — Reduce remaining scope:**
We deprioritize or remove certain originally-scoped items to fit {{FEATURE}} into the remaining budget. I'll send a revised scope breakdown for your review.

**Option 3 — Pause and re-budget:**
We pause work at a clean milestone, you review the full scope-vs-budget picture, and we negotiate a fresh Statement of Work covering everything remaining.

I want to be upfront: I would rather raise this now — when we still have {{REVISIONS}} clean hours of runway — than discover at hour 0 that we're stuck. This is exactly the conversation the original "Budget & Scope Ceiling" clause was designed to facilitate.

Which option works best for you? Happy to hop on a 20-minute call to walk through the numbers if that's helpful.

Best regards,
{{YOUR_NAME}}`;

/* ============================================================
   8. SLACK / WHATSAPP SCOPE BOUNDARY RESET (Script #8)
   ============================================================ */
const SG_SCRIPT_8 = `Hi {{CLIENT_NAME}},

I want to take 2 minutes to reset a process that has been quietly costing both of us time and clarity on {{PROJECT_NAME}}. I think you'll agree it's overdue.

**What's been happening:**
Over the last {{DAYS}} days, we've exchanged {{EST_HOURS}} informal requests across Slack DMs, WhatsApp voice notes, and text messages — {{FEATURE}}, quick copy edits, screenshot annotations, and ad-hoc approval pings. These messages are fast and convenient, but they've created three real problems:

1. **Things fall through the cracks.** A DM at 11pm doesn't reliably make it into my production queue the next morning.
2. **Scope is invisible.** A "tiny tweak" over Slack still costs my team 30–90 minutes each, and those hours aren't tracked in our Statement of Work.
3. **No paper trail.** When decisions get made in a DM thread, we lose the audit trail if anything goes sideways later.

**The Reset — Effective {{DATE}}, all project work requests go through our project tracker:**

- **For minor requests (≤30 min):** Open a single ticket titled "[{{PROJECT_NAME}}] Quick tweak: [brief description]" and assign to me. I'll batch these every Tuesday and Friday.
- **For meaningful changes (≥30 min):** Same ticket workflow, but I'll respond with a Change Order estimate within 24 hours before starting work.
- **For emergencies:** Page me by email with "URGENT" in the subject line — I'll respond within 1 business hour.

I will continue to monitor Slack/WhatsApp for casual chat and quick clarifications, but **no work will start from those channels anymore.** This protects your timeline, your budget, and our partnership.

Thanks for understanding — I think this will actually make our collaboration smoother, not more bureaucratic.

Best regards,
{{YOUR_NAME}}`;

/* ============================================================
   9. LATE PAYMENT / MILESTONE WORK PAUSE NOTICE (Script #9)
   ============================================================ */
const SG_SCRIPT_9 = `Hi {{CLIENT_NAME}},

I want to address an outstanding invoice before it has any further impact on {{PROJECT_NAME}}.

**Invoice Status — As of {{DATE}}:**
- Invoice {{INVOICE_NUM}}
- Original amount: {{AMOUNT}}
- Due date: {{DUE_DATE}}
- Days overdue: {{DAYS}}
- Current balance: {{BALANCE}}

Per the Payment Terms clause in our Statement of Work (Section 5), milestone work pauses when any invoice is more than 7 calendar days past due. Because we are now {{DAYS}} days past due, I am officially pausing active production on {{PROJECT_NAME}} as of {{DATE}}.

**What this means practically:**
- Any in-progress milestone work is being archived and code committed to a clean branch.
- Production scheduling for your project is released back to my general pool.
- No new work will commence until {{BALANCE}} is settled in full.

**How we resolve this and get back to building:**

1. **Settle the full balance today:** Work resumes within 24 hours of payment clearing. I'll honor the original delivery date of {{PROJECT_DEADLINE}} if payment lands within 48 hours.

2. **Negotiate a payment plan:** If cash flow is genuinely tight, let's schedule a 15-minute call this week to agree on a 2-installment plan. The project resumes after the first installment clears.

3. **Reassess the relationship:** If the project economics no longer make sense for either side, I'm open to a graceful closeout — we settle outstanding hours, I hand over all completed work, and we part as professionals.

I genuinely value the work we've done together on {{PROJECT_NAME}}, and I want to resolve this in a way that preserves the relationship. Please reply with which option works for your team, or give me a call at your convenience.

Best regards,
{{YOUR_NAME}}`;

/* ============================================================
   10. SCOPE CREEP KILL-FEE / SOW TERMINATION SETTLEMENT (Script #10)
   ============================================================ */
const SG_SCRIPT_10 = `Hi {{CLIENT_NAME}},

After careful reflection, I am writing to formally propose a structured closeout of {{PROJECT_NAME}}, effective {{DATE}}.

Over the course of this engagement, {{PROJECT_NAME}} has accumulated scope that materially exceeds the parameters set in our original Statement of Work {{SOW_REF}}. Specifically:

- **{{EST_HOURS}} unbilled hours** of incremental requests beyond the original SOW
- **{{REVISIONS}} revision rounds** delivered against a {{REVISIONS}}-round cap
- **{{DAYS}} days** of timeline extension already absorbed
- Multiple Change Order conversations that did not convert to signed agreements

I have enjoyed the work and value the relationship, but continuing under the current arrangement is no longer sustainable for my business. Rather than let the partnership erode, I'd like to propose a **clean termination settlement** that protects both of us.

**Termination Settlement — {{PROJECT_NAME}}:**

1. **Final Deliverable Handover:** Within 5 business days of settlement, I will deliver all completed work — design files, codebase (with documentation), staging environment credentials, and a 60-minute handover walkthrough.

2. **Kill-Fee / Settlement Payment:** To compensate for the unbilled scope absorbed and the business opportunity cost of project closeout, a one-time settlement of **{{SETTLEMENT_FEE}}** is due within 7 business days. This is offered at a {{PERCENT}} discount to the actual unbilled hours accrued and represents a full and final release for both parties.

3. **Mutual Non-Disparagement:** We both agree to handle the closeout professionally, without public commentary on the partnership.

4. **IP & Asset Transfer:** All paid-for deliverables transfer to {{CLIENT_NAME}} upon settlement clearance. Pre-existing IP, internal tooling, and unrelated work product remain mine.

5. **Mutual Release:** Upon settlement, both parties release any and all claims related to {{PROJECT_NAME}}.

If you would like to continue the engagement under a freshly negotiated SOW with the protective clauses we've discussed, I'm open to that conversation — but it needs to begin from a clean slate, with a signed agreement and paid deposit.

I genuinely wish this had gone differently, and I appreciate the work we've built together. Please let me know how you'd like to proceed, and I'll send the formal Settlement Agreement by end of week.

Best regards,
{{YOUR_NAME}}`;

/* ============================================================
   SCRIPT REGISTRY — used by the render + copy functions
   ============================================================ */
const SG_SCRIPT_PLAYBOOK = [
  {
    id: 'script-1',
    tag: 'Phase 2 Queue',
    tagClass: 'tag-standard',
    title: '1. The Polite Pushback (Phase 2 Queue)',
    context: 'When a client slips a "small addition" into mid-build conversation and you want to deflect without conflict.',
    body: SG_SCRIPT_1,
    placeholders: ['CLIENT_NAME','FEATURE','PROJECT_NAME','MILESTONE','PROJECT_DEADLINE','AMOUNT','DAYS','YOUR_NAME']
  },
  {
    id: 'script-2',
    tag: 'Fast Track',
    tagClass: 'tag-success',
    title: '2. The Fast Change Order Proposal',
    context: 'When you have client buy-in on a change but need to lock the terms and sign-off quickly.',
    body: SG_SCRIPT_2,
    placeholders: ['CLIENT_NAME','PROJECT_NAME','FEATURE','AMOUNT','RATE','EST_HOURS','DAYS','SPRINT','YOUR_NAME']
  },
  {
    id: 'script-3',
    tag: 'Micro-Tweaks',
    tagClass: 'tag-warning',
    title: '3. The "Quick Favor" Pivot (Small Tweaks That Add Up)',
    context: 'When drift from endless micro-tweaks is silently eating your margin — reset expectations professionally.',
    body: SG_SCRIPT_3,
    placeholders: ['CLIENT_NAME','FEATURE','PROJECT_NAME','REVISIONS','EST_HOURS','DATE','RATE','AMOUNT','YOUR_NAME']
  },
  {
    id: 'script-4',
    tag: 'Meeting Bill',
    tagClass: 'tag-warning',
    title: '4. The Meeting Discipline Request',
    context: 'When strategy calls and Zoom syncs have expanded beyond the contracted scope — establish a paid framework.',
    body: SG_SCRIPT_4,
    placeholders: ['CLIENT_NAME','PROJECT_NAME','DAYS','EST_HOURS','DRIFT_REASON','RATE','AMOUNT','YOUR_NAME']
  },
  {
    id: 'script-5',
    tag: 'Revision Cap',
    tagClass: 'tag-danger',
    title: '5. The Endless Revision Cap Enforcer',
    context: 'When you have exceeded the contracted revision rounds and need to enforce the original agreement.',
    body: SG_SCRIPT_5,
    placeholders: ['CLIENT_NAME','MILESTONE','PROJECT_NAME','REVISIONS','DATE','EST_HOURS','DAYS','STAKEHOLDER','PROJECT_DEADLINE','RATE','AMOUNT','YOUR_NAME']
  },
  {
    id: 'script-6',
    tag: 'Timeline Reset',
    tagClass: 'tag-danger',
    title: '6. The Client Delay / Timeline Reset Notice',
    context: 'When client-side delays have stalled production and your timeline needs a formal reset.',
    body: SG_SCRIPT_6,
    placeholders: ['CLIENT_NAME','PROJECT_NAME','DATE','FEATURE','DUE_DATE','DAYS','PROJECT_DEADLINE','EST_HOURS','AMOUNT','YOUR_NAME']
  },
  {
    id: 'script-7',
    tag: 'Budget Ceiling',
    tagClass: 'tag-danger',
    title: '7. The Budget Exhaustion Notice',
    context: 'When you are about to overrun the contracted budget — raise it cleanly before you hit the wall.',
    body: SG_SCRIPT_7,
    placeholders: ['CLIENT_NAME','PROJECT_NAME','DATE','AMOUNT','EST_HOURS','REVISIONS','FEATURE','MILESTONE','RATE','YOUR_NAME']
  },
  {
    id: 'script-8',
    tag: 'Channel Reset',
    tagClass: 'tag-standard',
    title: '8. The Slack / WhatsApp Scope Boundary Reset',
    context: 'When informal messaging has become a scope-creep vector — move work to a formal ticket system.',
    body: SG_SCRIPT_8,
    placeholders: ['CLIENT_NAME','PROJECT_NAME','DAYS','EST_HOURS','FEATURE','DATE','YOUR_NAME']
  },
  {
    id: 'script-9',
    tag: 'Work Pause',
    tagClass: 'tag-danger',
    title: '9. The Late Payment / Milestone Work Pause Notice',
    context: 'When an invoice is overdue and you need to formally pause work per your contract terms.',
    body: SG_SCRIPT_9,
    placeholders: ['CLIENT_NAME','PROJECT_NAME','DATE','INVOICE_NUM','AMOUNT','DUE_DATE','DAYS','BALANCE','PROJECT_DEADLINE','YOUR_NAME']
  },
  {
    id: 'script-10',
    tag: 'Settlement',
    tagClass: 'tag-danger',
    title: '10. The Scope Creep Kill-Fee / SOW Termination Settlement',
    context: 'When the project has drifted beyond recovery — propose a structured, professional closeout.',
    body: SG_SCRIPT_10,
    placeholders: ['CLIENT_NAME','PROJECT_NAME','DATE','SOW_REF','EST_HOURS','REVISIONS','DAYS','SETTLEMENT_FEE','PERCENT','YOUR_NAME']
  }
];

/* ============================================================
   PLACEHOLDER EXTRACTION + FORM BUILDER
   ============================================================ */
function sgExtractPlaceholders(templateBody) {
  const re = /\{\{([A-Z_][A-Z0-9_]*)\}\}/g;
  const seen = new Set();
  const out = [];
  let m;
  while ((m = re.exec(templateBody)) !== null) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      out.push(m[1]);
    }
  }
  return out;
}

function sgFriendlyLabel(ph) {
  const map = {
    CLIENT_NAME: 'Client Name',
    YOUR_NAME: 'Your Name',
    PROJECT_NAME: 'Project Name',
    MILESTONE: 'Current Milestone / Deliverable',
    DATE: 'Date',
    AMOUNT: 'Amount (e.g. $650)',
    PERCENT: 'Percentage (e.g. 30%)',
    DAYS: 'Day Count',
    REVISIONS: 'Revision Rounds',
    RATE: 'Hourly Rate ($/hr)',
    EST_HOURS: 'Estimated Hours',
    STAKEHOLDER: 'Stakeholder Name',
    FEATURE: 'Feature / Tweak Description',
    SPRINT: 'Sprint Identifier',
    DRIFT_REASON: 'Reason for Drift',
    PROJECT_DEADLINE: 'Project Deadline',
    INVOICE_NUM: 'Invoice Number',
    DUE_DATE: 'Due Date',
    BALANCE: 'Outstanding Balance',
    SETTLEMENT_FEE: 'Settlement / Kill Fee',
    SOW_REF: 'SOW Reference Number'
  };
  return map[ph] || ph.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function sgApplyPlaceholders(template, values) {
  return template.replace(/\{\{([A-Z_][A-Z0-9_]*)\}\}/g, (_, key) => {
    const v = values[key];
    return (v && String(v).trim().length > 0) ? v : `{{${key}}}`;
  });
}

/* ============================================================
   CARD RENDERER — builds the 10 script cards with form + copy
   ============================================================ */
function renderScriptPlaybook(containerId = 'scripts-catalog') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Preserve the existing 6 original cards by NOT touching them; append new cards.
  container.innerHTML = SG_SCRIPT_PLAYBOOK.map((script, idx) => {
    const placeholders = sgExtractPlaceholders(script.body);
    const formFields = placeholders.map(ph => `
      <div class="form-group sg-field">
        <label for="${script.id}-${ph}">${sgFriendlyLabel(ph)}</label>
        <input type="text" id="${script.id}-${ph}" data-script="${script.id}" data-ph="${ph}" placeholder="${sgFriendlyLabel(ph)}" oninput="updateScriptPreview('${script.id}')">
      </div>
    `).join('');

    return `
      <div class="card script-card sg-card" id="${script.id}-card">
        <div class="script-header">
          <span class="script-tag ${script.tagClass}">${script.tag} · Scenario ${idx + 1}</span>
          <h3>${script.title}</h3>
        </div>
        <p class="script-context">${script.context}</p>

        <details class="sg-form-details" id="${script.id}-form-details">
          <summary>📝 Customize Placeholders (${placeholders.length})</summary>
          <div class="sg-form-grid">
            ${formFields}
            <button class="btn btn-outline btn-sm" type="button" onclick="clearScriptFields('${script.id}')">Clear Fields</button>
          </div>
        </details>

        <div class="script-body" id="${script.id}-text">${escapeHtml(script.body)}</div>

        <div class="btn-cluster">
          <button class="btn btn-secondary btn-sm" type="button" onclick="copyScript('${script.id}-text')">📋 Copy Script to Clipboard</button>
          <button class="btn btn-primary btn-sm" type="button" onclick="copyScriptFilled('${script.id}')">⚡ Copy with Placeholders Filled</button>
        </div>
      </div>
    `;
  }).join('');

  logEvent('scripts_playbook_rendered', { count: SG_SCRIPT_PLAYBOOK.length });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================
   LIVE PREVIEW UPDATER
   ============================================================ */
function updateScriptPreview(scriptId) {
  const script = SG_SCRIPT_PLAYBOOK.find(s => s.id === scriptId);
  if (!script) return;

  const values = {};
  document.querySelectorAll(`[data-script="${scriptId}"]`).forEach(input => {
    const ph = input.getAttribute('data-ph');
    values[ph] = input.value;
  });

  const textTarget = document.getElementById(`${scriptId}-text`);
  if (textTarget) {
    textTarget.textContent = sgApplyPlaceholders(script.body, values);
  }
}

/* ============================================================
   COPY FUNCTIONS
   ============================================================ */
function copyScript(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Email template copied to clipboard!');
    logEvent('script_copied', { scriptId: elementId });
  });
}

function copyScriptFilled(scriptId) {
  const script = SG_SCRIPT_PLAYBOOK.find(s => s.id === scriptId);
  if (!script) return;

  const values = {};
  document.querySelectorAll(`[data-script="${scriptId}"]`).forEach(input => {
    values[input.getAttribute('data-ph')] = input.value;
  });

  const remaining = sgExtractPlaceholders(sgApplyPlaceholders(script.body, values));
  const unfilled = remaining.filter(p => !values[p] || !values[p].toString().trim());

  if (unfilled.length > 0) {
    showToast(`⚠️ ${unfilled.length} placeholder(s) still blank: ${unfilled.join(', ')}`);
    return;
  }

  const finalText = sgApplyPlaceholders(script.body, values);
  navigator.clipboard.writeText(finalText).then(() => {
    showToast('⚡ Filled script copied — ready to send!');
    logEvent('script_copied_filled', { scriptId, filledCount: Object.keys(values).length });
  });
}

function clearScriptFields(scriptId) {
  document.querySelectorAll(`[data-script="${scriptId}"]`).forEach(input => { input.value = ''; });
  updateScriptPreview(scriptId);
  showToast('Fields cleared for this script');
}

/* ============================================================
   REGISTRATION — call renderScriptPlaybook() on app boot
   ============================================================ */
// Append this call inside the existing DOMContentLoaded listener in app.js:
//
//   renderScriptPlaybook();
//
