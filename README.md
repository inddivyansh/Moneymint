# Moneymint

Moneymint is a frontend-first personal finance web app built with Next.js.
It helps users track money movement, monitor portfolios, read market updates, and get AI-powered financial insights from one dashboard.

This README is written for developers, reviewers, and recruiters who want to quickly understand:
- what features exist,
- where those features are in the code,
- how to run the project.

## Live Product Direction

The product experience focuses on:
- Fast, responsive finance tracking
- Clear data visualization
- Practical AI insights
- Simple navigation between finance modules

Even though backend integrations can be added later, the current app already demonstrates a complete frontend product flow.

## Frontend Features

### 1. Dashboard Overview
- Financial summary blocks for balance, income, expenses, and savings rate
- Trend and breakdown visualizations
- Compact, mobile-friendly dashboard layout

### 2. Transactions Management
- List and review transaction history
- Search, filter, sort, and paginate transactions
- Add and edit entries from the same workspace flow
- Mobile-optimized pagination and controls

### 3. Portfolio Tracking
- Demat/broker account snapshots
- Invested vs current value comparisons
- P&L-oriented presentation

### 4. UPI and Bank Tracking
- UPI app/account records
- Bank account details and balance mapping
- Transaction grouping across payment channels

### 5. Rewards and Coupons
- Rewards listing and coupon interaction flow
- Improved text handling and mobile-safe layout

### 6. Financial News and Insights
- News feed page for market-related updates
- Insights page for strategic recommendations

### 7. AI-Driven Experience (Product-facing)
- AI-powered insights narrative in product messaging
- AI insights module architecture ready in app APIs
- "New AI" direction reflected in welcome and insights experiences

### 8. Theme and Accessibility Improvements
- Light and dark mode support
- Theme toggle available in Profile
- Readability-focused light mode refinements
- Responsive typography and spacing updates

## Feature Map: Where To Find What

### App Routes
- Welcome page: app/welcome/page.tsx
- Home dashboard: app/(root)/home/page.tsx
- Transactions: app/(root)/transactions/page.tsx
- Portfolio: app/(root)/portfolio/page.tsx
- UPI: app/(root)/upi/page.tsx
- News: app/(root)/news/page.tsx
- Insights: app/(root)/insights/page.tsx
- Rewards: app/(root)/rewards/page.tsx
- Profile: app/(root)/profile/page.tsx

### Core Dashboard Components
- Main dashboard orchestrator: components/dashboard/FinanceDashboard.tsx
- Summary metrics: components/dashboard/SummaryCards.tsx
- Balance trend chart: components/dashboard/BalanceTrend.tsx
- Spending chart: components/dashboard/SpendingBreakdown.tsx
- Transactions table: components/dashboard/TransactionTable.tsx
- Transaction form: components/dashboard/TransactionForm.tsx
- File import flow: components/dashboard/ExcelUpload.tsx
- Export actions: components/dashboard/ExportButton.tsx

### Shared UI and App Shell
- Sidebar navigation: components/Sidebar.tsx
- Header: components/Header.tsx
- Theme button: components/ThemeToggle.tsx
- Global design tokens and styles: app/globals.css

### Data and Utilities
- Central state store: lib/dashboard-store.tsx
- Export helpers: lib/export.ts
- Shared utilities: lib/utils.ts

### API Endpoints (App-layer)
- AI/insights endpoint: app/api/insights
- News endpoint: app/api/news
- Inngest endpoint: app/api/inngest

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4 + custom global styling
- next-themes for theme switching
- Radix UI primitives in shared UI components

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install and Run

```bash
git clone https://github.com/inddivyansh/Moneymint.git
cd Moneymint
npm install
npm run dev
```

Open http://localhost:3000.

### Production Build

```bash
npm run build
npm run start
```

## Project Notes

- This repository is currently frontend-first.
- The product intentionally demonstrates complete UI/UX flows even when backend services are optional.
- State and user experience are designed to be testable and demo-friendly.

## Author

Made by Divyanhs Nagar.

GitHub:
https://github.com/inddivyansh/Moneymint

