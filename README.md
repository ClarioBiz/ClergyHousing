# Clergy Housing

A dignified, calm, and trustworthy web application for ministers and clergy to manage their IRC §107 housing allowance expenses and generate year-end tax reports. A product of Clario Consulting Corporation.

## Features

- **Dashboard** — Annual allowance progress, quick stats (designated, spent, remaining, IRS exclusion estimate), recent expenses, and category breakdown
- **Expense Log** — Sortable/filterable table with bulk select, source tracking (manual vs. bank sync), receipt indicators, and CSV import
- **Add / Edit Expense** — Date, category, description, amount, notes, and drag-and-drop receipt upload
- **CSV Import** — Download a pre-formatted template, fill it in any spreadsheet app (Excel, Google Sheets, LibreOffice), and upload to import expenses in bulk with a per-row category review step
- **Bank Accounts** — Plaid integration UI to connect accounts and review imported transactions before they enter the ledger
- **3-Year History** — Side-by-side year cards comparing the current and two prior tax years, with category breakdown bars, year-over-year delta indicators, a category comparison table, and the ability to add, edit, import, or print a report for any year
- **Year-End Tax Report** — Print-ready IRC §107 worksheet grouped by category with the lesser-of-three exclusion (designated allowance, actual expenses, fair rental value) calculated
- **Documents & Receipts** — Grid of uploaded receipts and exported reports organized by year and category
- **Subscription & Billing** — Stripe-powered subscription management (Free Trial · Monthly $12/mo · Annual $120/yr)
- **Settings** — Profile, tax year, designated allowance, fair rental value, notifications, MFA/security (AWS Cognito), data export, and appearance (color theme + heading font)

## Design

- **Color Themes:** Dark & Green (default), Navy & Gray, Cream & Forest, Cream & Navy, Cream & Oxblood, Linen & Slate
- **Typography:** Source Serif 4 headings + Geist body + Geist Mono for financials; Cormorant Garamond, Newsreader, and Montserrat available as alternate heading fonts
- **Responsive:** Desktop-first sidebar layout; collapses to off-canvas drawer at ≤900px; tables reflow to card rows on mobile
- **Print:** Dedicated print stylesheet hides all UI chrome; year-end report and prior-year reports render as clean single-page PDFs

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (CDN) + Babel Standalone — no build step |
| Auth | AWS Cognito (email/password + Google OAuth + MFA) |
| API | AWS Lambda + API Gateway (REST) |
| Database | AWS RDS PostgreSQL |
| File Storage | AWS S3 (receipts + documents) |
| Email | AWS SES |
| Bank Sync | Plaid (read-only, transaction import) |
| Payments | Stripe (subscriptions + invoices) |
| Hosting | AWS Amplify (manual zip deploy) |

## Getting Started

Open `clergyhousing.html` directly in a browser — no build step required. All dependencies are loaded via CDN.

> **Note:** JSX files are loaded as separate scripts and require a local web server (not `file://`). Use any static server:
>
> ```bash
> npx serve .
> # or
> python -m http.server 8080
> ```
> Then open `http://localhost:3000` (or whatever port `serve` reports)

In dev mode (`window.location.hostname === 'localhost'`), the app bypasses Cognito auth and loads sample data so all screens can be explored without a live backend.

## Project Structure

```
clergy-housing/
├── clergyhousing.html      # App entry point (authenticated)
├── index.html              # Marketing / landing page
├── styles.css              # All styles + responsive + print breakpoints
├── data.jsx                # Categories, icons, sample data, shared helpers
├── api.jsx                 # Cognito auth + Lambda API client
├── marketing.jsx           # Landing page, sign-in/sign-up, onboarding wizard
├── screens-v2.jsx          # Dashboard, Expense Log, Add/Edit Form, Tax Report,
│                           # Settings, CSV Import Modal
├── screens-extra.jsx       # Bank Accounts, Documents, Billing,
│                           # 3-Year History, HistoryReportPage
├── app-v2.jsx              # App shell, Sidebar, TopBar, routing, theme engine
├── tweaks-panel.jsx        # Developer palette/font switcher (dev mode only)
├── lambda/
│   └── index.js            # Lambda handler (profile, expenses, documents,
│                           # subscription, S3 upload URLs)
├── logo-light.png          # Clergy Housing logo (light, for dark backgrounds)
├── logo-color.png          # Clergy Housing logo (color)
├── clario-icon.png         # Clario Consulting icon (for sidebar + sign-in branding)
└── logo.svg                # Clergy Housing SVG logo
```

## Expense Categories

| ID | Name |
|----|------|
| mortgage | Mortgage / Rent |
| utilities | Utilities |
| insurance | Insurance |
| tax | Property Tax |
| repairs | Repairs & Maintenance |
| furnish | Furnishings & Appliances |
| decor | Decor & Home Improvements |
| yard | HOA / Yard |
| other | Other Housing |

## IRC §107 Exclusion Logic

The allowed housing allowance exclusion is the **lesser of**:
1. **(A)** The amount officially designated by the church board in advance
2. **(B)** Actual housing expenses incurred during the tax year
3. **(C)** The fair rental value of the home (furnished + utilities)

The year-end report calculates and displays all three values and highlights the exclusion amount.

## License

© 2026 Clario Consulting Corporation. All rights reserved.
