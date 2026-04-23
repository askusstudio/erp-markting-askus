
# Agency Finance & Billing SaaS — Build Roadmap

A phased plan to build "Stripe + QuickBooks for digital marketing agencies." No pricing UI yet — pure feature build-out, agency-first.

---

## Phase 0 — Foundation & Shell

**Auth & Workspaces**
- Email/password + Google sign-in
- Agency workspace on signup (each user belongs to one agency to start)
- User profile + agency settings (name, logo, address, GSTIN/VAT ID, currency)

**App Shell**
- Sidebar navigation: Dashboard, Invoices, Clients, Recurring, Packages, Reports, Settings
- Top bar with workspace switcher (placeholder for Phase 5), notifications, profile menu
- Clean, modern, agency-feel UI (not boring accounting style) — bold typography, soft cards, generous spacing

---

## Phase 1 — MVP (Sellable Core)

**Client Management**
- Add / edit / archive clients
- Billing details: name, company, email, phone, address, tax ID, default currency
- Client detail page: invoices, recurring plans, total billed, total paid, outstanding

**Invoicing**
- Create invoice manually with line items (description, qty, rate, tax %)
- GST + VAT support (per-line or invoice-level)
- Discounts, notes, terms
- Auto invoice numbering (configurable prefix)
- Branded PDF download (logo, colors, agency details)
- Statuses: Draft → Sent → Paid → Overdue → Cancelled
- Send invoice via email with payment link

**Recurring Billing**
- Monthly / weekly / quarterly / yearly retainers
- Auto-generate invoices on schedule
- Pause / resume / end recurring plan
- Preview upcoming invoices

**Payments**
- Stripe + Razorpay connection in settings
- Payment link embedded in every invoice
- Auto-mark invoice as paid on successful payment
- Manual "mark as paid" with method (bank transfer, cash, etc.)

**Dashboard**
- Total revenue (this month / quarter / year)
- Pending payments amount + count
- Paid invoices count
- Overdue invoices list
- Recent activity feed

---

## Phase 2 — Product–Market Fit

**Smart Automation**
- Auto payment reminders: configurable schedule (e.g., 3 days before due, on due, +3, +7)
- Email + WhatsApp reminder channels
- Late fee rules (flat or %, applied automatically)
- Reminder templates editor

**Multi-Currency & Tax**
- USD, INR, GBP, EUR, AUD support
- Per-client default currency
- Country-based tax presets toggle

**Service Packages**
- Pre-built packages: SEO, Google Ads, Meta Ads, SMM, Content, Web Dev
- Custom package builder (name, description, default price, recurring cadence)
- One-click add package to invoice or recurring plan

**Reports**
- Monthly revenue chart
- Client-wise revenue ranking
- Outstanding aging report (0–30, 31–60, 60+ days)
- Export CSV / PDF

**Client Portal**
- Magic-link login for clients (no password)
- View all invoices, pay online, download receipts
- Update billing details
- See payment history

---

## Phase 3 — Differentiation (Killer Features)

**Ads Budget vs Billing Tracker** ⭐
- Per-client project: track Client Paid vs Ads Spend vs Profit
- Manual entry + later auto-sync from ad platforms
- Visual profit margin per client / per campaign
- Alerts when margin drops below threshold

**AI Layer**
- AI invoice generator (describe the work → draft invoice with line items)
- AI-written payment reminder messages (tone: friendly / firm / final)
- AI profitability insights ("Client X margin dropped 22% this month")
- AI client summary on dashboard

**Proposal → Invoice Flow**
- Build proposals with scope, deliverables, pricing
- Send for client approval (signed link)
- On approval → auto-create invoice + recurring plan

**Client Wallet**
- Clients deposit funds into a wallet
- Agency deducts for ad spend / services
- Wallet statement + low-balance alerts to client

---

## Phase 4 — Global Scale

**Advanced Tax Engine**
- EU VAT (with reverse charge), US Sales Tax (state-level), GST (IN/AU), UK VAT
- Tax reports per jurisdiction
- VAT MOSS-style summaries

**Banking Integration**
- Connect bank account (Plaid / equivalent)
- Auto-import transactions
- Auto-reconcile against invoices

**Advanced Reports**
- Profit & Loss
- Cash flow
- MRR / ARR tracking with churn
- Forecasting

**Integrations**
- Meta Ads + Google Ads (auto-pull spend into Ads Tracker)
- Slack notifications
- Zapier / webhooks
- Accounting export (Xero, QuickBooks)

---

## Phase 5 — Ecosystem

**Multi-Agency / Multi-Brand**
- One user manages multiple agency workspaces
- Workspace switcher activated

**Team Roles & Permissions**
- Roles: Owner, Admin, Finance, Sales, Viewer
- Per-module permissions
- Activity audit log

**Expenses & Payroll Lite**
- Log expenses (category, vendor, receipt upload)
- Track team salaries
- Feed into P&L

**AI CFO (Premium)**
- Pricing increase suggestions
- Cost-cut recommendations
- Client risk scoring (late payer, shrinking margin, churn risk)
- Monthly AI financial briefing

---

## Build Order Summary

1. **Foundation** → Auth, workspace, shell, settings
2. **MVP** → Clients, Invoices, Recurring, Payments, Dashboard
3. **PMF** → Automation, Multi-currency, Packages, Reports, Client Portal
4. **Differentiation** → Ads Tracker, AI, Proposals, Wallet
5. **Global** → Advanced Tax, Banking, Advanced Reports, Integrations
6. **Ecosystem** → Multi-agency, Roles, Expenses, AI CFO

We'll start by implementing **Phase 0 + Phase 1** end-to-end so you have something sellable immediately. Pricing pages and billing for your own SaaS are intentionally excluded for now.
