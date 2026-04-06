# Moneymint - Personal Finance Dashboard

A **neobrutalist** personal finance dashboard built with Next.js 15, React 19, and Tailwind CSS v4. Track spending, manage transactions, and gain insights from your financial data.

## Design Philosophy

**Neobrutalism** - inspired by the Comet sneaker website aesthetic:

- **Bold borders** (2.5px solid) with hard drop shadows (no blur, no glow)
- **Flat, saturated colors** - yellow accents, green for income, red for expenses
- **Strong typography** - Space Grotesk for headings, Inter for body text
- **Raw, confident UI** - chunky buttons, thick badges, intentional visual weight
- **No gradients, no glassmorphism, no AI-generic rounded aesthetics**

## Features

### Core Dashboard (Requirement 1)

- **Summary Cards**: Total Balance, Income, Expenses, Savings Rate with colored accent strips
- **Balance Trend Chart**: SVG grouped bar chart showing monthly income vs expenses
- **Spending Breakdown**: Horizontal bar chart with category percentages

### Transactions (Requirement 2)

- Full transaction list with Date, Title, Category, Type, Amount
- **Search**: Filter by title, category, or date
- **Type Filter**: Segmented control (All / Income / Expense)
- **Category Filter**: Dropdown with all available categories
- **Sort**: Date (newest/oldest), Amount (high/low)
- **Pagination**: 10 items per page with numbered page controls

### Role-Based UI (Requirement 3)

- **Viewer**: Read-only access, "VIEW ONLY" badge, locked admin panel
- **Admin**: Full CRUD - add/edit transactions, form visible, edit buttons on rows
- Toggle roles via segmented control in the hero section

### Insights (Requirement 4)

- **Highest spending category** with amount
- **Monthly comparison** with delta
- **Average expense** per transaction
- **Savings assessment** based on rate thresholds
- **AI Analysis**: Sends anonymized financial summary to Claude API for personalized insights

### State Management (Requirement 5)

- **React Context + useReducer** pattern in `lib/dashboard-store.tsx`
- Centralized state: transactions, role, filters
- Computed values: totals, monthly data, spending breakdown, filtered transactions
- **LocalStorage persistence** - state survives page refreshes

### UI/UX (Requirement 6)

- **Responsive**: Desktop table, mobile card layout
- **Dark/Light mode**: Neobrutalist theme toggle with hard swap
- **Empty states**: Graceful handling when no data matches filters
- **Accessible**: Semantic HTML, proper labels, keyboard navigation

## Optional Enhancements Implemented

- **Dark Mode**: Full light/dark theme with neobrutalist design tokens
- **Data Persistence**: LocalStorage for transactions and role
- **AI Integration**: Claude API for financial insights
- **News Feed**: Real-time financial news from NewsData.io
- **Export**: Download transactions as CSV or JSON
- **Advanced Filtering**: Multi-criteria filtering with search, type, category, sort

## Tech Stack

| Layer          | Technology                           |
| -------------- | ------------------------------------ |
| Framework      | Next.js 15.5 (App Router, Turbopack) |
| UI             | React 19                             |
| Styling        | Tailwind CSS v4 + Custom CSS         |
| Language       | TypeScript 5                         |
| State          | React Context + useReducer           |
| Theme          | next-themes                          |
| Fonts          | Space Grotesk + Inter (Google Fonts) |
| AI             | Anthropic Claude API                 |
| News           | NewsData.io API                      |
| Icons          | Inline SVG (no emoji, no icon libs)  |

## Project Structure

```
app/
├── layout.tsx              # Root layout (fonts, theme provider)
├── globals.css             # Neobrutalism design system
├── (root)/
│   ├── layout.tsx          # App shell (header + container)
│   └── page.tsx            # Dashboard page
├── api/
│   ├── insights/route.ts   # AI insights endpoint
│   └── news/route.ts       # News feed endpoint
components/
├── Header.tsx              # Neobrutalist header
├── ThemeToggle.tsx          # Dark/light toggle
├── dashboard/
│   ├── FinanceDashboard.tsx # Main orchestrator
│   ├── SummaryCards.tsx     # Balance, income, expenses, savings
│   ├── BalanceTrend.tsx     # Monthly bar chart
│   ├── SpendingBreakdown.tsx # Category breakdown
│   ├── TransactionTable.tsx # Full table with filters
│   ├── TransactionForm.tsx  # Admin add/edit form
│   ├── RoleSwitcher.tsx     # Viewer/Admin toggle
│   ├── InsightsPanel.tsx    # Static + AI insights
│   ├── NewsFeed.tsx         # Financial news
│   └── ExportButton.tsx     # CSV/JSON export
lib/
├── dashboard-store.tsx      # Context + Reducer + seed data
├── export.ts                # CSV/JSON export utilities
└── utils.ts                 # Shared utilities
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd StockZorywnAssignment

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:3000` by default.

### Environment Variables (Optional)

Create a `.env.local` file for optional API features:

```env
# AI Insights (Anthropic Claude)
ANTHROPIC_KEY=your-key-here

# Financial News (NewsData.io)
NEWSDATA_KEY=your-key-here
```

The dashboard works fully without these keys - AI insights and news will show appropriate fallback messages.

**No MongoDB or database required.** The app uses mock data and localStorage for persistence.

## State Management Approach

The application uses a single **React Context + useReducer** pattern:

```
DashboardProvider
├── state.role          → 'viewer' | 'admin'
├── state.transactions  → Transaction[]
├── state.filters       → { search, type, category, sortBy }
├── computed.totals     → { income, expense, balance, savingsRate }
├── computed.monthlyData → monthly income/expense/balance
├── computed.spendingByCategory → category totals + percentages
└── computed.filteredTransactions → filtered + sorted results
```

Actions are dispatched via `dispatch()` and state changes cascade through memoized computed values. Filters are not persisted (reset on page load for fresh UX), while transactions and role are persisted to localStorage.

## Design Decisions

1. **Neobrutalism over minimalism**: Thick borders and hard shadows create visual hierarchy without relying on gradients or transparency effects.

2. **SVG charts over chart libraries**: Keeps the bundle small and gives full control over the neobrutalist styling (thick strokes, bordered elements).

3. **Segmented controls over dropdowns** for type filter: More touch-friendly and visually clear for 3-option choices.

4. **Event-driven edit flow**: Transaction table dispatches a custom DOM event (`edit-transaction`) that the form listens to, avoiding prop drilling.

5. **No authentication required**: The app demonstrates RBAC through frontend role switching without backend complexity, making it instantly runnable for evaluators.

## License

MIT
