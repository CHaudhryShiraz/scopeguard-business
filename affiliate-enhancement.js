/**
 * Enhanced Affiliate Toolkit JavaScript Functions
 * Paste these functions into app.js after the existing trackAffiliateClick function
 */

// ==========================================
// CONTEXTUAL LOSS-BASED RECOMMENDATIONS
// ==========================================

/**
 * Check calculator results and show time-tracking recommendation if loss exceeds $5,000
 * Call this function after runCalculator() completes
 */
function checkAndShowLossRecommendation() {
  const rate = parseFloat(document.getElementById('calc-hourly-rate')?.value) || 75;
  const unbilledPerWeek = parseFloat(document.getElementById('calc-unbilled-hours')?.value) || 4;
  const weeks = parseFloat(document.getElementById('calc-project-weeks')?.value) || 6;
  const totalUnbilledHours = unbilledPerWeek * weeks;
  const projectLoss = totalUnbilledHours * rate;

  const alertCard = document.getElementById('loss-recommendation-alert');
  const lossAmountSpan = document.getElementById('alert-loss-amount');

  if (projectLoss >= 5000 && alertCard) {
    // Update loss amount in alert
    if (lossAmountSpan) {
      lossAmountSpan.textContent = `$${projectLoss.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
    }

    // Show alert with fade-in animation
    alertCard.style.display = 'flex';
    setTimeout(() => {
      alertCard.style.opacity = '1';
    }, 100);

    // Log recommendation trigger
    logEvent('loss_recommendation_shown', { projectLoss: projectLoss });
  } else if (alertCard) {
    // Hide alert if loss is below threshold
    alertCard.style.display = 'none';
  }
}

/**
 * Dismiss the loss recommendation alert
 */
function dismissLossAlert() {
  const alertCard = document.getElementById('loss-recommendation-alert');
  if (alertCard) {
    alertCard.style.opacity = '0';
    setTimeout(() => {
      alertCard.style.display = 'none';
    }, 300);
    logEvent('loss_recommendation_dismissed');
  }
}

/**
 * Scroll to a specific tool category pillar
 * @param {string} categoryId - The category ID to scroll to (e.g., 'time-tracking')
 */
function scrollToCategory(categoryId) {
  // First switch to affiliate view if not already there
  if (AppState.currentView !== 'affiliate-view') {
    switchView('affiliate-view');
  }

  // Wait for view switch animation, then scroll to category
  setTimeout(() => {
    const categoryMap = {
      'time-tracking': 'category-time-tracking',
      'contracts': 'category-contracts',
      'esign': 'category-esign',
      'proposals': 'category-proposals'
    };

    const targetId = categoryMap[categoryId] || categoryId;
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Add highlight pulse effect
      targetElement.style.transition = 'all 0.3s ease';
      targetElement.style.transform = 'scale(1.05)';
      targetElement.style.borderColor = 'var(--primary)';

      setTimeout(() => {
        targetElement.style.transform = 'scale(1)';
      }, 500);

      logEvent('category_scrolled', { category: categoryId });
    }
  }, 400);
}

/**
 * Enhanced affiliate click tracking with category context
 * @param {string} toolName - Name of the tool being clicked
 * @param {string} category - Category of the tool (optional)
 */
function trackAffiliateClickEnhanced(toolName, category = null) {
  const eventData = { tool: toolName };
  if (category) {
    eventData.category = category;
  }

  // Check if this was triggered by loss recommendation
  const alertVisible = document.getElementById('loss-recommendation-alert')?.style.display === 'flex';
  if (alertVisible) {
    eventData.source = 'loss_recommendation';
  }

  logEvent('affiliate_click', eventData);

  // Show confirmation toast
  showToast(`Opening ${toolName}... We may earn a commission to support ScopeGuard's free development.`);
}

// ==========================================
// COMPARISON MATRIX INTERACTIVITY
// ==========================================

/**
 * Highlight comparison table row on hover for better readability
 */
function initComparisonTableInteractivity() {
  const comparisonTable = document.querySelector('.comparison-table');
  if (!comparisonTable) return;

  const rows = comparisonTable.querySelectorAll('tbody tr');

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.background = 'rgba(99, 102, 241, 0.08)';
    });

    row.addEventListener('mouseleave', () => {
      row.style.background = '';
    });
  });
}

/**
 * Copy comparison table as plain text for sharing
 */
function copyComparisonMatrix() {
  const table = document.querySelector('.comparison-table');
  if (!table) {
    showToast('⚠️ Comparison table not found');
    return;
  }

  let textContent = '📊 ScopeGuard vs Full CRM Comparison\n\n';

  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    const rowText = Array.from(cells).map(cell => cell.textContent.trim()).join(' | ');
    textContent += rowText + '\n';
  });

  textContent += '\n🛡️ Generated by ScopeGuard - https://scopeguard.app';

  navigator.clipboard.writeText(textContent).then(() => {
    showToast('✓ Comparison table copied to clipboard!');
    logEvent('comparison_matrix_copied');
  }).catch(err => {
    console.error('Copy failed:', err);
    showToast('⚠️ Copy failed. Please try again.');
  });
}

// ==========================================
// PILLAR CATEGORY ANALYTICS
// ==========================================

/**
 * Track which tool categories users are most interested in
 */
function trackCategoryView(categoryName) {
  logEvent('category_viewed', { category: categoryName });
}

/**
 * Initialize intersection observer for category view tracking
 */
function initCategoryViewTracking() {
  const categories = document.querySelectorAll('.pillar-category');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const categoryId = entry.target.id;
          const categoryName = entry.target.querySelector('.pillar-title')?.textContent;
          if (categoryName) {
            trackCategoryView(categoryName);
          }
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px'
    });

    categories.forEach(category => observer.observe(category));
  }
}

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize all enhanced affiliate toolkit features
 * Call this in the main DOMContentLoaded event listener
 */
function initEnhancedAffiliateToolkit() {
  // Initialize comparison matrix interactivity
  initComparisonTableInteractivity();

  // Initialize category view tracking
  initCategoryViewTracking();

  // Check for loss recommendation on initial load
  checkAndShowLossRecommendation();

  console.log('[ScopeGuard] Enhanced Affiliate Toolkit initialized');
}

// ==========================================
// INTEGRATION HOOKS
// ==========================================

/**
 * IMPORTANT: Modify the existing runCalculator() function to trigger loss check
 * Add this line at the END of the runCalculator() function:
 *
 * checkAndShowLossRecommendation();
 */

/**
 * IMPORTANT: Add this to the existing DOMContentLoaded listener:
 *
 * initEnhancedAffiliateToolkit();
 */

/**
 * Export functions for global access
 */
if (typeof window !== 'undefined') {
  window.dismissLossAlert = dismissLossAlert;
  window.scrollToCategory = scrollToCategory;
  window.trackAffiliateClickEnhanced = trackAffiliateClickEnhanced;
  window.copyComparisonMatrix = copyComparisonMatrix;
  window.checkAndShowLossRecommendation = checkAndShowLossRecommendation;
  window.initEnhancedAffiliateToolkit = initEnhancedAffiliateToolkit;
}
