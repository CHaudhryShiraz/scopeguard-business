/**
 * ScopeGuard Telemetry Operations Console UI
 * Enhanced admin/user-visible console with comprehensive metrics
 */

// HTML escape utility
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Render enhanced Telemetry Operations Console
 */
function renderEnhancedTelemetryConsole() {
  if (typeof ScopeguardTelemetry === 'undefined') {
    console.warn('[Telemetry Console] ScopeguardTelemetry not available, using fallback');
    renderLegacyTelemetryData();
    return;
  }

  const metrics = ScopeguardTelemetry.getMetrics();
  const stats = ScopeguardTelemetry.getStats();
  const recentEvents = ScopeguardTelemetry.getRecentEvents(20);
  const leads = ScopeguardTelemetry.getLeads();

  // Update summary metrics
  updateElement('tel-total-events', stats.totalEvents);
  updateElement('tel-total-leads', leads.length);
  updateElement('tel-pro-status', AppState.isPro ? 'PRO' : 'Free');

  // Update detailed metrics
  updateElement('tel-loss-calculations', metrics.lossCalculations);
  updateElement('tel-change-orders-generated', metrics.changeOrdersGenerated);
  updateElement('tel-change-orders-printed', metrics.changeOrdersPrinted);
  updateElement('tel-change-orders-exported', metrics.changeOrdersExported);
  updateElement('tel-risk-quizzes', metrics.riskQuizzesCompleted);
  updateElement('tel-email-scripts', metrics.emailScriptsCopied);
  updateElement('tel-vault-leads', metrics.vaultLeadsCaptured);
  updateElement('tel-affiliate-clicks', metrics.affiliateLinkClicks);
  updateElement('tel-total-loss', `$${metrics.totalCalculatedLoss.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
  updateElement('tel-documents-drafted', metrics.documentsGenerated);

  // Update latest event time
  if (stats.latestEventTime) {
    const latestTime = new Date(stats.latestEventTime);
    updateElement('tel-latest-event-time', latestTime.toLocaleString());
  } else {
    updateElement('tel-latest-event-time', 'No events yet');
  }

  // Update privacy indicators
  updateElement('tel-storage-type', 'localStorage Only');
  updateElement('tel-network-calls', 'Zero');
  updateElement('tel-cookies-used', 'None');

  // Render leads list
  renderLeadsList(leads);

  // Render events stream
  renderEventsStream(recentEvents);
}

/**
 * Update element text content safely
 */
function updateElement(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

/**
 * Render leads list
 */
function renderLeadsList(leads) {
  const container = document.getElementById('tel-leads-list');
  if (!container) return;

  if (leads.length === 0) {
    container.innerHTML = '<p class="text-muted" style="padding:12px; font-size:13px; text-align:center;">No leads captured yet.</p>';
    return;
  }

  container.innerHTML = leads.slice(-50).reverse().map((lead, i) => `
    <div style="display:flex; justify-content:space-between; padding:8px 12px; border-bottom:1px solid var(--border-color); font-size:13px;">
      <span><strong>#${i + 1}</strong> ${escapeHtml(lead.email)}</span>
      <span class="text-muted" style="font-size:11px;">${new Date(lead.capturedAt || lead.date).toLocaleString()}</span>
    </div>
  `).join('');

  updateElement('tel-lead-count', leads.length);
}

/**
 * Render events stream
 */
function renderEventsStream(events) {
  const container = document.getElementById('tel-events-stream');
  if (!container) return;

  if (events.length === 0) {
    container.innerHTML = '<p class="text-muted" style="padding:12px; font-size:13px; text-align:center;">No events recorded yet.</p>';
    return;
  }

  container.innerHTML = events.map(event => {
    const time = new Date(event.timestamp);
    const metadata = event.metadata || event.data || {};
    const metaStr = Object.keys(metadata).length > 0 ?
      ` • ${Object.entries(metadata).map(([k, v]) => `${k}: ${v}`).join(', ')}` : '';

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 12px; border-bottom:1px solid var(--border-color); font-size:12px;">
        <div style="flex:1;">
          <span style="font-family:var(--font-mono); color:var(--primary); font-weight:500;">${escapeHtml(event.name)}</span>
          <span class="text-muted" style="font-size:11px;">${escapeHtml(metaStr)}</span>
        </div>
        <span class="text-muted" style="font-size:11px; white-space:nowrap; margin-left:12px;">${time.toLocaleTimeString()}</span>
      </div>
    `;
  }).join('');
}

/**
 * Export telemetry data as JSON
 */
function exportTelemetryJSON() {
  if (typeof ScopeguardTelemetry === 'undefined') {
    showToast('⚠️ Enhanced telemetry system not available');
    return;
  }

  const data = ScopeguardTelemetry.exportData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `ScopeGuard_Telemetry_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);

  showToast('📊 Telemetry data exported as JSON');
}

/**
 * Export leads as CSV
 */
function exportTelemetryLeadsCSV() {
  if (typeof ScopeguardTelemetry === 'undefined') {
    exportLeadsCSV(); // Fallback to legacy function
    return;
  }

  const leads = ScopeguardTelemetry.getLeads();

  if (leads.length === 0) {
    showToast('⚠️ No leads captured yet');
    return;
  }

  const csvRows = [['Email', 'Captured_Timestamp', 'Lead_ID']];
  leads.forEach(lead => {
    csvRows.push([
      `"${lead.email}"`,
      `"${lead.capturedAt || lead.date}"`,
      `"${lead.leadId || 'legacy'}"`
    ]);
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ScopeGuard_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('📥 Leads exported as CSV');
}

/**
 * Reset all telemetry data with confirmation
 */
function resetTelemetryData() {
  const confirmed = confirm(
    '⚠️ RESET LOCAL TELEMETRY DATA\n\n' +
    'This will permanently delete:\n' +
    '• All tracked events\n' +
    '• All captured leads\n' +
    '• All telemetry statistics\n\n' +
    'This action CANNOT be undone.\n\n' +
    'Are you sure you want to proceed?'
  );

  if (!confirmed) return;

  if (typeof ScopeguardTelemetry !== 'undefined') {
    const success = ScopeguardTelemetry.resetAll(true);
    if (success) {
      // Also clear legacy AppState
      AppState.events = [];
      AppState.leads = [];
      try {
        localStorage.removeItem('sg_events');
        localStorage.removeItem('sg_leads');
      } catch (e) {}

      renderEnhancedTelemetryConsole();
      showToast('✅ All local telemetry data has been reset');
    } else {
      showToast('❌ Failed to reset telemetry data');
    }
  } else {
    // Fallback to legacy reset
    AppState.events = [];
    AppState.leads = [];
    try {
      localStorage.removeItem('sg_events');
      localStorage.removeItem('sg_leads');
    } catch (e) {}
    renderLegacyTelemetryData();
    showToast('✅ Local data reset (legacy mode)');
  }
}

/**
 * Fallback to legacy telemetry rendering
 */
function renderLegacyTelemetryData() {
  if (typeof renderTelemetryData === 'function') {
    renderTelemetryData();
  }
}

/**
 * Initialize telemetry console when modal opens
 */
function openEnhancedTelemetryModal() {
  renderEnhancedTelemetryConsole();
  const modal = document.getElementById('telemetry-modal');
  if (modal) modal.classList.add('active');

  if (typeof ScopeguardTelemetry !== 'undefined') {
    ScopeguardTelemetry.track('telemetry_console_opened', {});
  }
}

// Export functions for global access
if (typeof window !== 'undefined') {
  window.renderEnhancedTelemetryConsole = renderEnhancedTelemetryConsole;
  window.exportTelemetryJSON = exportTelemetryJSON;
  window.exportTelemetryLeadsCSV = exportTelemetryLeadsCSV;
  window.resetTelemetryData = resetTelemetryData;
  window.openEnhancedTelemetryModal = openEnhancedTelemetryModal;
}
