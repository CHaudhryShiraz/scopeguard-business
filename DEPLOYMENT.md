# ScopeGuard — Production Deployment & Architecture Guide

**Version:** 1.0.0 (Free Public Beta / Preview)  
**Architecture:** Zero-Dependency Client-Side Static Single Page Application (SPA)  
**Security & Privacy:** 100% Client-Side Execution / Privacy-First Local Persistence  

---

## 1. Executive Summary & Release Positioning

ScopeGuard is an autonomous, privacy-first business utility built for freelance software engineers, creative agencies, consultants, and contractors to combat unpaid scope creep. 

ScopeGuard v1.0.0 is released under a **"Deploy Now, Payments Later" (Free Public Beta / Preview)** model. All core loss calculation models, the 8-dimension risk diagnostic quiz, the two-way change order amendment builder, vector PDF/print generation, JSON draft serialization, email defense scripts, and lead capture vaults operate **100% free of charge directly in the user's browser with zero backend dependencies**.

---

## 2. Static SPA Architecture & Privacy Model

### Pure Client-Side Architecture
- **No Node.js runtime or build step required**: Uses standard semantic HTML5, modern CSS3 custom properties with adaptive dark/light themes, and Vanilla ES6+ JavaScript.
- **Privacy-First Client-Side Architecture**: Financial figures, hourly rates, client names, project descriptions, and legal amendment drafts are processed strictly in browser memory. No project data or calculation metrics are ever transmitted to any external server.
- **Local Persistence Layer**:
  - `sg_theme`: Persistent UI theme choice (`dark` or `light`).
  - `sg_leads`: Locally captured email waitlist entries.
  - `sg_events`: Client-side diagnostic telemetry ring buffer (capped at 100 events).
  - `sg_is_pro`: Beta Pro Preview flag.

---

## 3. Multi-Cloud Static Hosting Instructions

ScopeGuard is pre-configured with zero build configuration for instant static hosting across all leading cloud providers:

### Option A: GitHub Pages (Automated CI/CD Workflow)
The repository includes `.github/workflows/pages.yml` for automated deployment upon git push:
1. Push this repository to GitHub on branch `main` or `master`.
2. Go to **Settings > Pages** in your GitHub repository.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. The workflow will automatically deploy the static files to `https://<username>.github.io/<repo-name>/`.

### Option B: Vercel (Edge Network)
The project includes `vercel.json` with pre-configured clean URLs and HTTP security headers:
```bash
# Using Vercel CLI (interactive or linked token)
vercel deploy --prod
```
Or import the Git repository into the [Vercel Dashboard](https://vercel.com/new). No build command or output directory configuration is needed (Root Directory: `./`).

### Option C: Netlify (Global CDN)
The project includes `netlify.toml` pre-configured with `publish = "."` and strict security headers:
```bash
# Using Netlify CLI
netlify deploy --prod --dir=.
```
Or connect your GitHub/GitLab repository via the [Netlify App Console](https://app.netlify.com/).

### Option D: Cloudflare Pages / AWS S3 / Nginx
- **Cloudflare Pages**: Connect Git repo -> Framework preset: `None` -> Build output: `.`
- **Nginx / Apache**: Copy all root files (`index.html`, `styles.css`, `app.js`, `robots.txt`, `sitemap.xml`) to the web server root (`/var/www/html/`).

---

## 4. Security & HTTP Header Hardening

Both `vercel.json` and `netlify.toml` enforce production-grade HTTP security headers:

| Header | Value | Purpose |
| :--- | :--- | :--- |
| `X-Frame-Options` | `DENY` | Prevents clickjacking attacks by forbidding iframe embedding |
| `X-Content-Type-Options` | `nosniff` | Blocks MIME-type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Protects referral privacy |

---

## 5. ScopeGuard Core Functional Modules

1. **Financial Scope Loss Engine**:
   - Real-time computation of direct unbilled loss:
     $$\text{Direct Loss} = \text{Unbilled Hours} \times \text{Hourly Rate}$$
   - Effective hourly rate compression:
     $$\text{Effective Rate} = \frac{\text{Contract Value}}{\text{Planned Hours} + \text{Unbilled Hours}}$$
   - Realized profit margin reduction and annualized revenue leakage.

2. **Two-Way Change Order Amendment Builder**:
   - Bi-directional reactive DOM synchronization.
   - Legally structured Amendment to Statement of Work (SOW) layout.
   - Instant JSON draft export (`Blob` download) and JSON draft file import (`FileReader`).
   - Browser-native Vector Print/PDF engine (`window.print()` with custom `@media print` CSS isolating the legal document and stripping UI chrome).

3. **8-Dimension Project Risk Diagnostic Quiz**:
   - Real-time risk scoring across 8 operational axes: SOW clarity, decision maker authority, revision caps, timeline buffers, communications discipline, payment terms/deposits, client technical proficiency, and third-party dependencies.
   - Dynamic mitigation recommendations and risk classification (Low / Moderate / High / Critical).

4. **Scope Defense Email Scripts**:
   - 6 copy-ready negotiation and boundary-setting email templates with one-click clipboard copying.

5. **Lead Capture & Scope Defense Vault**:
   - Privacy-friendly lead collection (`localStorage.sg_leads`) with CSV export capability.
   - Instant downloadable legal clause pack for contractor agreements.

---

## 6. Future v1.1 Payment & Backend Architecture Roadmap

When commercial monetization is activated in ScopeGuard v1.1, the backend will be integrated with the following architectural specifications:

### Target Database Schema (PostgreSQL / Supabase)
```sql
-- Users & Accounts
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_pro BOOLEAN DEFAULT FALSE,
    pro_activated_at TIMESTAMPTZ
);

-- Payment Transactions & Webhook Audit Log
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'jazzcash', 'easypaisa', 'sadapay', 'stripe'
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    tier VARCHAR(50) NOT NULL DEFAULT 'lifetime_29',
    status VARCHAR(50) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
    idempotency_key VARCHAR(255) UNIQUE,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Captured Lead Magnets
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    source VARCHAR(100) DEFAULT 'vault_modal',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Multi-Provider Gateway Architecture
1. **Local Pakistani Payment Rails**:
   - **JazzCash / Easypaisa Merchant APIs**: Direct mobile wallet and OTC account debits via secure serverless webhook endpoints with HMAC-SHA256 signature verification.
   - **SadaPay / NayaPay Business**: Fast virtual IBAN checkout and debit card processing.
2. **International Payment Rails**:
   - **Stripe / Lemon Squeezy**: Hosted checkout sessions with webhook verification for worldwide credit/debit card purchases ($29 Lifetime Pass).
3. **Webhook Verification & Idempotency**:
   - Serverless functions (e.g. `/api/webhooks/payment`) verifying raw request signatures before updating database records.
   - Strict idempotency key checks preventing duplicate credit grant on network retries.
4. **License Delivery**:
   - Transactional email dispatch via **Resend API** containing the permanent Pro access key.

---

## 7. Pre-Flight Quality Assurance & Verification Summary

- [x] **Zero Build Dependencies**: Runs cleanly from static file server.
- [x] **Zero Syntax Errors**: Verified with `node -c app.js`.
- [x] **Zero Fake Checkouts**: All dummy checkout invocations (`simulateCheckout`) and promo coupon codes (`AUTONOMOUS100`) completely removed.
- [x] **Pro Modal State**: Pro Upgrade modal cleanly presents the upcoming $29 Lifetime Pass with disabled "Pro — Coming Soon" state.
- [x] **Telemetry Pro Status**: Telemetry operations console accurately displays `PRO PREVIEW (Beta)` / `FREE PREVIEW`.
- [x] **Vector PDF / Print Styling**: Tested `@media print` rules ensure clean, margin-aligned Change Order legal printouts.
- [x] **Lead Capture & Local Vault**: Tested lead submission, local CSV export, and client-side legal pack downloads.
- [x] **Multi-Cloud Ready**: Validated `vercel.json`, `netlify.toml`, and `.github/workflows/pages.yml`.
