# ScopeGuard 🛡️

> **The Privacy-First Scope Creep Loss Calculator & SOW Change Order Generator**  
> *Stop working for free. Turn unbilled client requests into signed, paid change orders in seconds.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Architecture: Zero--Build Static SPA](https://img.shields.io/badge/Architecture-Static%20SPA-emerald.svg)](index.html)
[![Privacy: 100% Client--Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-indigo.svg)](DEPLOYMENT.md)
[![Status: Free Public Beta](https://img.shields.io/badge/Status-Free%20Public%20Beta-purple.svg)](https://scopeguard.app)

---

## 🚀 Overview

**ScopeGuard** is a standalone, browser-native business utility engineered for freelance software developers, digital agencies, consultants, and contractors to eliminate unpaid scope creep and streamline client contract amendments.

Industry data shows the average full-time freelancer loses **$4,850 to $14,400 annually** in unbilled hours absorbed as "quick favor" tweaks and revision overruns. ScopeGuard quantifies that loss in real-time and produces legally structured Statement of Work (SOW) Change Order amendments ready for immediate client signature.

---

## ✨ Key Features

1. **💸 Financial Scope Loss Engine**:
   - Real-time direct dollar loss computation: $\text{Direct Loss} = \text{Unbilled Hours} \times \text{Hourly Rate}$
   - Effective profit margin squeeze and compressed hourly rate analysis.
   - Annualized revenue leakage projections.

2. **📄 Two-Way SOW Change Order Builder**:
   - Interactive form with real-time reactive DOM document preview.
   - Fixed-fee or hourly rate billing models with timeline extension clauses.
   - Browser-native vector print/PDF engine (`window.print()` with dedicated `@media print` layout stripping UI chrome).
   - Instant JSON draft export (`Blob`) and file import (`FileReader`).

3. **🎯 8-Dimension Project Risk Diagnostic**:
   - Multi-axis risk scoring across SOW clarity, decision maker authority, revision caps, timeline buffers, communications discipline, payment terms, client technical competency, and external dependencies.
   - Dynamic mitigation recommendations and automated risk-mitigation clause insertion into Change Orders.

4. **✉️ Scope Defense Email Scripts**:
   - 6 copy-ready negotiation and boundary-setting email templates with one-click clipboard copy.

5. **🔐 Scope Defense Vault & Lead Capture**:
   - Privacy-respecting email collection (`localStorage`) with CSV export and downloadable contractor clause pack.

---

## 🔒 Privacy & Architecture

- **100% Client-Side Execution**: All mathematical calculations, risk diagnostics, contract drafting, and draft saves run entirely in the user's browser memory.
- **Zero Server Data Transmission**: Project metrics, hourly rates, client names, and legal text are never sent to external servers or remote databases.
- **Zero Build Dependencies**: Native semantic HTML5, modern CSS3 custom properties with responsive dark/light themes, and Vanilla ES6+ JavaScript.

---

## 🛠️ Quick Start & Local Execution

No Node.js, package managers, or compilers are required.

```bash
# Clone the repository
git clone https://github.com/CHaudhryShiraz/scopeguard-business.git
cd scopeguard-business

# Open index.html directly in any web browser
start index.html       # Windows
open index.html        # macOS
xdg-open index.html    # Linux
```

---

## 🌐 Multi-Cloud Deployment

ScopeGuard is pre-configured for instant zero-configuration static deployment:

- **GitHub Pages**: Automated via `.github/workflows/pages.yml`. Enable via **Settings > Pages > Source: GitHub Actions**.
- **Vercel**: Edge network ready via `vercel.json` with pre-configured security headers.
- **Netlify**: Global CDN ready via `netlify.toml` (`publish = "."`).
- **Cloudflare Pages / AWS S3 / Nginx**: Copy root files to any static web server root.

---

## 🗺️ Product Roadmap

- [x] **v1.0.0 (Current)**: Free Public Beta / Preview — Zero-dependency static SPA with full loss calculator, change order builder, risk quiz, email templates, and vector PDF exports.
- [ ] **v1.1.0 (Planned)**: Pro Toolkit with centralized user accounts, multi-rail payment verification (JazzCash, Easypaisa, SadaPay, Stripe), and automated license key delivery.

---

## 📄 License

ScopeGuard is released under the [MIT License](LICENSE).
