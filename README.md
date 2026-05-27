# Clergy Housing

A dignified, calm, and trustworthy web application for ministers and clergy to manage their IRC §107 housing allowance expenses and generate year-end tax reports.

## Features

- **Dashboard** — Annual allowance progress, quick stats (designated, spent, remaining, IRS exclusion estimate), recent expenses, and category breakdown
- **Expense Log** — Sortable/filterable table with bulk select, source tracking (manual vs. bank sync), and receipt indicators
- **Add / Edit Expense** — Date, category, description, amount, notes, and drag-and-drop receipt upload
- **Bank Accounts** — Plaid integration UI to connect accounts and review imported transactions before they enter the ledger
- **Year-End Tax Report** — Print-ready IRC §107 worksheet grouped by category with the "lesser of A, B, or C" exclusion calculated
- **Documents & Receipts** — Grid of uploaded receipts and exported reports organized by year and category
- **Billing** — Stripe-powered subscription management (Free Trial, Monthly $12/mo, Annual $120/yr)
- **Settings** — Profile, tax year configuration, notifications, MFA/security (AWS Cognito), and data export

## Design

- **Palette:** Clario brand colors (Navy `#25215d`, Blue `#005cb9`, Celeste `#6fcfeb`, Orange `#ec7625`, Yellow `#ffcf01`) with a clean white card base
- **Typography:** Source Serif 4 headings + Geist body + Geist Mono for financials; Montserrat available as the Clario brand typeface
- **Responsive:** Desktop-first sidebar layout; collapses to off-canvas drawer at ≤900px; tables reflow to card rows on mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (CDN) + Babel Standalone |
| Auth | AWS Cognito (MFA) |
| Database | AWS RDS (PostgreSQL) |
| File Storage | AWS S3 |
| API | AWS Lambda + API Gateway |
| Bank Sync | Plaid |
| Payments | Stripe |
| Email | AWS SES |
| Hosting | AWS Amplify |

## Getting Started

Open `clergyhousing.html` directly in a browser — no build step required. All dependencies are loaded via CDN.

> **Note:** Because the JSX files are loaded as separate scripts, you must serve from a local web server (not `file://`). Use any static server:
>
> ```bash
> npx serve .
> # or
> python -m http.server 8080
> ```
> Then open `http://localhost:8080/clergyhousing.html`

## Project Structure

```
clergy-housing/
├── clergyhousing.html   # Entry point
├── styles.css           # All styles + responsive breakpoints
├── data.jsx             # Shared data, icons, helpers
├── marketing.jsx        # Landing page, Auth screen, Paywall
├── screens-v2.jsx       # Dashboard, Expense Log, Add/Edit Form, Tax Report, Settings
├── screens-extra.jsx    # Bank Accounts, Documents, Billing
├── app-v2.jsx           # App shell, Sidebar, TopBar, routing
└── tweaks-panel.jsx     # Developer palette/theme switcher
```

## License

© 2025 Clergy Housing. All rights reserved.
