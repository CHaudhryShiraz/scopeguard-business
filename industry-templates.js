/**
 * ScopeGuard Industry-Specific Change Order Templates
 * 6 Pre-Populated Templates for Rapid Client Deployment
 */

const IndustryTemplates = {
  'web-software': {
    name: 'Web & Mobile Software Development',
    icon: '💻',
    color: '#6366f1',
    template: {
      scopeDesc: 'Integration of real-time WebSocket notification system, user analytics dashboard with 12 custom KPI widgets, and OAuth2 social login for Google, GitHub, and Microsoft accounts — features requested after technical architecture freeze.',
      feeType: 'fixed',
      fixedAmount: 2850,
      hourlyRate: 125,
      estimatedHours: 24,
      timelineExtension: 8,
      revisionCap: '1 round of minor revisions',
      paymentTerms: '50% deposit upfront, 50% upon deliverable completion',
      specialNotes: 'Client must provide production API keys for OAuth providers and analytics platform credentials within 2 business days of Change Order approval. Any third-party service integration delays will extend timeline 1:1.'
    },
    sampleItems: [
      'Real-time WebSocket notification layer',
      'Custom analytics dashboard (12 KPI widgets)',
      'OAuth2 multi-provider authentication',
      'Admin role-based access control (RBAC)',
      'Automated backup & recovery system',
      'API rate limiting middleware'
    ]
  },

  'uiux-design': {
    name: 'UI/UX & Brand Design',
    icon: '🎨',
    color: '#ec4899',
    template: {
      scopeDesc: 'Design and delivery of complete brand identity package including primary logo (8 variants), secondary brand marks, 40-page comprehensive brand style guide, custom icon library (60 icons), and social media template kit for Instagram, LinkedIn, and Twitter — expanded from original single-logo brief.',
      feeType: 'fixed',
      fixedAmount: 1950,
      hourlyRate: 95,
      estimatedHours: 22,
      timelineExtension: 10,
      revisionCap: '2 rounds of consolidated revisions',
      paymentTerms: '50% deposit upfront, 50% upon deliverable completion',
      specialNotes: 'Revision rounds must be submitted as single consolidated feedback document within 5 business days of presentation. Piecemeal requests from multiple stakeholders will not constitute a valid revision round. Client delay in feedback submission extends final delivery date by 2x the delay period.'
    },
    sampleItems: [
      'Full brand identity system (8 logo variants)',
      '40-page brand style guide',
      'Custom icon library (60 icons)',
      'Social media template kit (3 platforms)',
      'Business card & letterhead designs',
      'Brand presentation deck template'
    ]
  },

  'seo-marketing': {
    name: 'SEO & Digital Marketing',
    icon: '📊',
    color: '#10b981',
    template: {
      scopeDesc: 'Execution of comprehensive technical SEO audit covering 200+ pages, implementation of structured Schema.org markup for 8 content types, creation of 12 high-authority backlink acquisition campaigns, and setup of Google Search Console + Analytics 4 conversion tracking for 15 custom events — services added beyond agreed monthly retainer scope.',
      feeType: 'fixed',
      fixedAmount: 1650,
      hourlyRate: 110,
      estimatedHours: 16,
      timelineExtension: 12,
      revisionCap: '1 round of minor revisions',
      paymentTerms: '100% upfront prior to commencing out-of-scope work',
      specialNotes: 'Client must grant Google Search Console admin access, Google Analytics admin privileges, and website CMS backend credentials within 48 hours of Change Order execution. SEO results are measured over 90-day period post-implementation and cannot be guaranteed due to external search algorithm factors.'
    },
    sampleItems: [
      'Technical SEO audit (200+ pages)',
      'Schema.org markup (8 content types)',
      'Backlink acquisition campaigns (12 targets)',
      'Google Analytics 4 conversion tracking',
      'Core Web Vitals optimization',
      'XML sitemap & robots.txt strategy'
    ]
  },

  'copywriting': {
    name: 'Copywriting & Content Strategy',
    icon: '✍️',
    color: '#f59e0b',
    template: {
      scopeDesc: 'Development and delivery of complete website content refresh including 15 SEO-optimized landing pages (1,200-1,500 words each), 8 case study narratives with client interviews, email nurture sequence (12 emails), and conversion-focused homepage hero copy with A/B test variants — content volume tripled from original 5-page brief.',
      feeType: 'hourly',
      fixedAmount: 1450,
      hourlyRate: 85,
      estimatedHours: 18,
      timelineExtension: 14,
      revisionCap: '2 rounds of consolidated revisions',
      paymentTerms: '50% deposit upfront, 50% upon deliverable completion',
      specialNotes: 'Client must provide brand voice guidelines, approved keyword research, customer interview access, and prior case study data within 3 business days. Each round of revisions limited to factual corrections, tone adjustments, and keyword optimization — substantive rewrites constitute new scope and will be quoted separately.'
    },
    sampleItems: [
      '15 SEO-optimized landing pages (1,200+ words)',
      '8 customer case study narratives',
      'Email nurture sequence (12 emails)',
      'Homepage hero copy + A/B variants',
      'Product descriptions (50 SKUs)',
      'Blog content strategy (6-month calendar)'
    ]
  },

  'video-production': {
    name: 'Video Production & Motion Graphics',
    icon: '🎬',
    color: '#8b5cf6',
    template: {
      scopeDesc: 'Production and delivery of 90-second brand explainer video with full custom 2D animation, professional voiceover talent recording (3 takes), original background music licensing, and 16:9 + 1:1 + 9:16 multi-format exports optimized for YouTube, Instagram feed, Instagram Stories, and LinkedIn — expanded from agreed 30-second static graphic video.',
      feeType: 'fixed',
      fixedAmount: 3200,
      hourlyRate: 150,
      estimatedHours: 24,
      timelineExtension: 10,
      revisionCap: '1 round of minor revisions',
      paymentTerms: '50% deposit upfront, 50% upon deliverable completion',
      specialNotes: 'Revision round covers timing adjustments, color grading tweaks, and minor copy edits only. Storyboard changes, character redesigns, or new animation sequences after initial approval will trigger separate Change Order. Client must provide final script, brand assets, and voiceover direction within 2 business days of kickoff.'
    },
    sampleItems: [
      '90-second custom 2D animated explainer',
      'Professional voiceover (3 recording takes)',
      'Original music licensing',
      'Multi-format exports (16:9, 1:1, 9:16)',
      'Closed captions & subtitle files',
      'Brand intro/outro animation bumpers'
    ]
  },

  'construction': {
    name: 'Construction & Subcontractor Trade',
    icon: '🏗️',
    color: '#ef4444',
    template: {
      scopeDesc: 'Installation of upgraded HVAC climate control system in conference room wing (4 rooms), replacement of standard door hardware with commercial-grade ADA-compliant lever sets (18 doors), application of premium moisture-resistant paint in 3 bathrooms, and remediation of water damage to drywall discovered during inspection — work items added after original fixed-price contract execution.',
      feeType: 'fixed',
      fixedAmount: 4850,
      hourlyRate: 95,
      estimatedHours: 52,
      timelineExtension: 7,
      revisionCap: '0 (Additional revisions billed at standard hourly rate)',
      paymentTerms: '50% deposit upfront, 50% upon deliverable completion',
      specialNotes: 'Work scheduled during business hours (8AM-5PM weekdays). Client must ensure site access, clear work areas, and provide temporary power/water shutoff authorization. Material cost fluctuations exceeding 10% due to supply chain factors will be reconciled at project completion. Concealed conditions (e.g., structural issues, mold, code violations) discovered during work will be documented and quoted separately.'
    },
    sampleItems: [
      'HVAC system upgrade (4-room wing)',
      'ADA-compliant door hardware (18 units)',
      'Premium moisture-resistant paint (3 bathrooms)',
      'Drywall water damage remediation',
      'Electrical outlet code compliance upgrade',
      'Fire-rated door installation (2 units)'
    ]
  }
};

/**
 * Load a specific industry template into the Change Order form
 */
function loadIndustryTemplate(industryKey) {
  const template = IndustryTemplates[industryKey];
  if (!template) {
    showToast('❌ Template not found');
    return;
  }

  const data = template.template;

  // Populate form fields
  document.getElementById('co-scope-desc').value = data.scopeDesc;
  document.getElementById('co-fee-type').value = data.feeType;
  document.getElementById('co-fixed-amount').value = data.fixedAmount;
  document.getElementById('co-hourly-rate').value = data.hourlyRate;
  document.getElementById('co-estimated-hours').value = data.estimatedHours;
  document.getElementById('co-timeline-extension').value = data.timelineExtension;
  document.getElementById('co-revision-cap').value = data.revisionCap;
  document.getElementById('co-payment-terms').value = data.paymentTerms;
  document.getElementById('co-special-notes').value = data.specialNotes;

  toggleFeeInputs();
  updateChangeOrderPreview();

  showToast(`✨ ${template.name} template loaded!`);
  logEvent('industry_template_loaded', { industry: industryKey, name: template.name });
}

/**
 * Render industry template selector UI
 */
function renderIndustryTemplateSelector() {
  const container = document.getElementById('industry-template-selector');
  if (!container) return;

  let html = '<div class="industry-selector-header"><h4>Quick-Load Industry Templates</h4><p class="text-muted">Pre-populated with realistic scope items, rates, and terms</p></div>';
  html += '<div class="industry-template-grid">';

  Object.keys(IndustryTemplates).forEach(key => {
    const template = IndustryTemplates[key];
    html += `
      <button class="industry-template-card" onclick="loadIndustryTemplate('${key}')" style="border-left: 3px solid ${template.color};">
        <div class="template-icon" style="font-size: 28px;">${template.icon}</div>
        <div class="template-name">${template.name}</div>
        <div class="template-meta">
          <span class="template-rate">$${template.template.fixedAmount.toLocaleString()}</span>
          <span class="template-days">+${template.template.timelineExtension} days</span>
        </div>
      </button>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

// Initialize on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    renderIndustryTemplateSelector();
  });
}
