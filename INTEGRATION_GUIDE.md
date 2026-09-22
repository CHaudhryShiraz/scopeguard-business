# ScopeGuard — 10-Script Tactical Playbook Integration Guide

## Overview
This guide provides complete integration instructions for expanding the ScopeGuard email negotiation scripts from 6 to 10 tactical scripts with dynamic placeholder replacement.

## Files Delivered

1. **scripts-playbook.js** — Complete JavaScript implementation with all 10 scripts
2. **INTEGRATION_GUIDE.md** — This file
3. **styles-additions.css** — Required CSS for new form components

## Integration Steps

### Step 1: Add CSS Styles to `styles.css`

Add the following styles to the end of your `styles.css` file:

```css
/* ============================================================
   SCRIPT PLAYBOOK FORM STYLES
   ============================================================ */
.sg-card {
  position: relative;
}

.sg-form-details {
  margin: 16px 0;
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  overflow: hidden;
}

.sg-form-details summary {
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  font-weight: 600;
  font-size: 14px;
  color: var(--primary);
  background: rgba(99, 102, 241, 0.05);
  transition: background 0.2s;
  list-style: none;
}

.sg-form-details summary::-webkit-details-marker {
  display: none;
}

.sg-form-details summary:hover {
  background: rgba(99, 102, 241, 0.1);
}

.sg-form-details[open] summary {
  border-bottom: 1px solid var(--border-color);
}

.sg-form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 16px;
}

@media (min-width: 768px) {
  .sg-form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.sg-field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.sg-field input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.sg-field input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn-cluster {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
}

@media (max-width: 640px) {
  .btn-cluster {
    flex-direction: column;
  }
  
  .btn-cluster .btn {
    width: 100%;
  }
}
```

### Step 2: Load the New Script File

Add the script tag **after** the existing `app.js` script tag, right before the closing `</body>` tag in `index.html`:

```html
  <script src="app.js"></script>
  <script src="scripts-playbook.js"></script>
</body>
</html>
```

### Step 3: Initialize the Playbook Renderer

Add the following line inside the existing `DOMContentLoaded` listener in `app.js`, right after the `renderRiskQuiz()` call (around line 57):

```javascript
  // Initialize Risk Quiz questions
  renderRiskQuiz();

  // Initialize 10-Script Tactical Playbook (NEW)
  renderScriptPlaybook();

  // Navigation tab listeners
  document.querySelectorAll('.nav-link').forEach(link => {
```

### Step 4: Replace the Scripts Section in `index.html`

Replace the entire `<!-- VIEW 4: BATTLE-TESTED SCOPE DEFENSE EMAIL SCRIPTS -->` section (lines 563-713) with:

```html
    <!-- VIEW 4: BATTLE-TESTED SCOPE DEFENSE EMAIL SCRIPTS -->
    <section id="scripts-view" class="view-panel">
      <div class="panel-header">
        <div>
          <h2>10-Script Master Tactical Playbook</h2>
          <p class="text-muted">Battle-tested negotiation scripts for turning out-of-scope requests into paid opportunities without alienating clients. Each script includes dynamic placeholder replacement.</p>
        </div>
      </div>

      <div class="scripts-grid" id="scripts-catalog">
        <!-- Dynamically populated by renderScriptPlaybook() -->
      </div>
    </section>
```

## Script Architecture

### Data Structure

Each script in `SG_SCRIPT_PLAYBOOK` contains:
- **id**: Unique identifier (script-1 through script-10)
- **tag**: Short category label
- **tagClass**: CSS class for tag styling
- **title**: Full scenario name
- **context**: Usage guidance
- **body**: Email template with {{PLACEHOLDERS}}
- **placeholders**: Array of required placeholder keys

### Placeholder System

Placeholders follow the pattern `{{PLACEHOLDER_NAME}}` and are automatically:
1. Extracted from each template
2. Converted to labeled form fields
3. Applied in real-time to the preview
4. Validated before copy

Common placeholders:
- `{{CLIENT_NAME}}` — Recipient's name
- `{{YOUR_NAME}}` — Sender's name
- `{{PROJECT_NAME}}` — Project title
- `{{AMOUNT}}` — Dollar amounts
- `{{DAYS}}` — Day counts
- `{{RATE}}` — Hourly rate
- `{{FEATURE}}` — Feature/tweak description

### Functions Added

1. **renderScriptPlaybook()** — Generates all 10 script cards with forms
2. **updateScriptPreview(scriptId)** — Live placeholder replacement
3. **copyScriptFilled(scriptId)** — Copies template with placeholders filled
4. **clearScriptFields(scriptId)** — Resets form fields
5. **sgExtractPlaceholders(body)** — Parses template for placeholders
6. **sgFriendlyLabel(ph)** — Converts PLACEHOLDER_NAME to human labels
7. **sgApplyPlaceholders(template, values)** — Replaces placeholders with values

## The 10 Scripts

1. **Polite Pushback (Phase 2 Queue)** — Deflect mid-build additions without conflict
2. **Fast Change Order Proposal** — Lock terms and get sign-off quickly
3. **"Quick Favor" Pivot** — Reset expectations when micro-tweaks accumulate
4. **Meeting Discipline Request** — Bill for runaway strategy calls
5. **Endless Revision Cap Enforcer** — Enforce contracted revision limits
6. **Client Delay / Timeline Reset** — Formal timeline reset after client delays
7. **Budget Exhaustion Notice** — Raise budget ceiling before overrun
8. **Slack/WhatsApp Scope Boundary Reset** — Move informal requests to tickets
9. **Late Payment / Work Pause Notice** — Pause work on overdue invoices
10. **Scope Creep Kill-Fee Settlement** — Structured project termination

## User Workflow

1. User clicks scenario card in Scripts tab
2. Expands "Customize Placeholders" accordion
3. Fills in relevant fields (client name, amounts, dates)
4. Preview updates in real-time below
5. Clicks "Copy with Placeholders Filled" button
6. Pastes polished email into Gmail/Outlook

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern mobile browsers

## Testing Checklist

- [ ] All 10 script cards render correctly
- [ ] Placeholder forms expand/collapse properly
- [ ] Real-time preview updates as user types
- [ ] Copy buttons work for both raw and filled templates
- [ ] Unfilled placeholder validation shows toast warning
- [ ] Clear fields button resets form
- [ ] Responsive layout works on mobile (400px width)
- [ ] Dark/light theme applies correctly to new elements
- [ ] Toast notifications appear for copy actions
- [ ] Telemetry events log script interactions

## Advanced Customization

### Adding New Scripts

To add an 11th script:

```javascript
SG_SCRIPT_PLAYBOOK.push({
  id: 'script-11',
  tag: 'New Category',
  tagClass: 'tag-warning',
  title: '11. Your New Script Title',
  context: 'When to use this script...',
  body: `Your email template with {{PLACEHOLDERS}}`,
  placeholders: ['CLIENT_NAME', 'YOUR_NAME', 'CUSTOM_FIELD']
});
```

Then add the friendly label mapping in `sgFriendlyLabel()`:

```javascript
CUSTOM_FIELD: 'Custom Field Label'
```

### Styling Adjustments

Tag color classes:
- `tag-standard` — Blue (neutral scenarios)
- `tag-success` — Green (positive/fast-track)
- `tag-warning` — Yellow (moderate risk)
- `tag-danger` — Red (critical/termination)

## Troubleshooting

**Scripts not rendering:**
- Check browser console for JavaScript errors
- Verify `scripts-playbook.js` loads after `app.js`
- Confirm `renderScriptPlaybook()` is called in DOMContentLoaded

**Placeholders not replacing:**
- Check that input fields have correct `data-script` and `data-ph` attributes
- Verify `updateScriptPreview()` is triggered on input events
- Console log the `values` object to debug

**Copy button not working:**
- Ensure clipboard API is supported (requires HTTPS or localhost)
- Check for browser permissions blocking clipboard access
- Fall back to manual copy if needed

## Support & Maintenance

For issues or enhancements:
1. Check browser console for errors
2. Verify all integration steps completed
3. Test with sample data before production use
4. Review telemetry logs in Executive Console

---

**Version:** 1.0  
**Last Updated:** 2026-09-21  
**Compatibility:** ScopeGuard v1.0 Beta
