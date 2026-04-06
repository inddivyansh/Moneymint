'use client';

import { createContext, useContext, useEffect, useReducer, useMemo, type ReactNode, type Dispatch } from 'react';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

export type UserRole = 'viewer' | 'admin';
export type TransactionType = 'income' | 'expense';
export type SortBy = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export type Transaction = {
  id: string;
  date: string;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
};

export type TransactionDraft = {
  date: string;
  title: string;
  amount: string;
  category: string;
  type: TransactionType;
};

export type UPITransaction = {
  id: string;
  date: string;
  upiId: string;
  name: string;
  amount: number;
  type: 'sent' | 'received';
  status: 'success' | 'pending' | 'failed';
  reference: string;
  app: string;
};

export type UPIApp = {
  id: string;
  name: string;
  upiId: string;
  type: 'upi' | 'wallet';
  balance?: number;
};

export type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  type: 'savings' | 'current';
  balance: number;
};

export type DematAccount = {
  id: string;
  broker: string;
  dpId: string;
  accountType: string;
  invested: number;
  currentValue: number;
};

export type UserHealth = {
  age: string;
  weight: string;
  height: string;
  country: string;
  monthlyIncome: string;
  bmi: string;
  dailyExercise: string;
  occupation: string;
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  health: UserHealth;
};

export type Coupon = {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  expiresAt: string;
  brand: string;
  category: string;
  redeemed: boolean;
};

export type Filters = {
  search: string;
  type: 'all' | TransactionType;
  category: string;
  sortBy: SortBy;
};

export type DashboardState = {
  role: UserRole;
  transactions: Transaction[];
  upiTransactions: UPITransaction[];
  upiApps: UPIApp[];
  bankAccounts: BankAccount[];
  dematAccounts: DematAccount[];
  profile: UserProfile;
  coupons: Coupon[];
  referralCode: string;
  filters: Filters;
  onboarded: boolean;
};

export type DashboardAction =
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_TRANSACTIONS_BULK'; payload: Transaction[] }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'RESET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_FILTERS'; payload: Partial<Filters> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'ADD_BANK_ACCOUNT'; payload: BankAccount }
  | { type: 'REMOVE_BANK_ACCOUNT'; payload: string }
  | { type: 'ADD_DEMAT_ACCOUNT'; payload: DematAccount }
  | { type: 'REMOVE_DEMAT_ACCOUNT'; payload: string }
  | { type: 'ADD_UPI_APP'; payload: UPIApp }
  | { type: 'REMOVE_UPI_APP'; payload: string }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'UPDATE_HEALTH'; payload: Partial<UserHealth> }
  | { type: 'SET_ONBOARDED'; payload: boolean }
  | { type: 'REDEEM_COUPON'; payload: string }
  | { type: 'LOAD_STATE'; payload: Partial<DashboardState> };

/* ═══════════════════════════════════════════
   SEED DATA
   ═══════════════════════════════════════════ */

export const seedTransactions: Transaction[] = [
  { id: 't1', date: '2026-01-05', title: 'Salary Deposit', amount: 4600, category: 'Salary', type: 'income' },
  { id: 't2', date: '2026-01-08', title: 'Apartment Rent', amount: 1600, category: 'Housing', type: 'expense' },
  { id: 't3', date: '2026-01-12', title: 'Index Fund Dividend', amount: 210, category: 'Investments', type: 'income' },
  { id: 't4', date: '2026-01-15', title: 'Groceries - FreshMart', amount: 128, category: 'Groceries', type: 'expense' },
  { id: 't5', date: '2026-01-20', title: 'Internet + Mobile', amount: 79, category: 'Utilities', type: 'expense' },
  { id: 't6', date: '2026-02-01', title: 'Salary Deposit', amount: 4600, category: 'Salary', type: 'income' },
  { id: 't7', date: '2026-02-03', title: 'Apartment Rent', amount: 1600, category: 'Housing', type: 'expense' },
  { id: 't8', date: '2026-02-07', title: 'Freelance Design', amount: 940, category: 'Freelance', type: 'income' },
  { id: 't9', date: '2026-02-10', title: 'Dinner - Yaki House', amount: 64, category: 'Food', type: 'expense' },
  { id: 't10', date: '2026-02-14', title: 'Cloud Subscription', amount: 34, category: 'Software', type: 'expense' },
  { id: 't11', date: '2026-02-18', title: 'Gym Membership', amount: 49, category: 'Health', type: 'expense' },
  { id: 't12', date: '2026-02-22', title: 'Coffee + Snacks', amount: 22, category: 'Food', type: 'expense' },
  { id: 't13', date: '2026-03-01', title: 'Salary Deposit', amount: 4600, category: 'Salary', type: 'income' },
  { id: 't14', date: '2026-03-02', title: 'Apartment Rent', amount: 1600, category: 'Housing', type: 'expense' },
  { id: 't15', date: '2026-03-04', title: 'Index Fund Dividend', amount: 210, category: 'Investments', type: 'income' },
  { id: 't16', date: '2026-03-06', title: 'Groceries - FreshMart', amount: 128, category: 'Groceries', type: 'expense' },
  { id: 't17', date: '2026-03-09', title: 'Internet + Mobile', amount: 79, category: 'Utilities', type: 'expense' },
  { id: 't18', date: '2026-03-11', title: 'Freelance Design', amount: 940, category: 'Freelance', type: 'income' },
  { id: 't19', date: '2026-03-14', title: 'Dinner - Yaki House', amount: 64, category: 'Food', type: 'expense' },
  { id: 't20', date: '2026-03-16', title: 'Team Commute Pass', amount: 92, category: 'Transport', type: 'expense' },
  { id: 't21', date: '2026-03-20', title: 'Cloud Subscription', amount: 34, category: 'Software', type: 'expense' },
  { id: 't22', date: '2026-03-23', title: 'Tax Reserve', amount: 420, category: 'Tax', type: 'expense' },
  { id: 't23', date: '2026-03-26', title: 'Coffee + Snacks', amount: 22, category: 'Food', type: 'expense' },
  { id: 't24', date: '2026-03-29', title: 'Stock Profit', amount: 360, category: 'Investments', type: 'income' },
  { id: 't25', date: '2026-04-01', title: 'Salary Deposit', amount: 4600, category: 'Salary', type: 'income' },
  { id: 't26', date: '2026-04-02', title: 'Apartment Rent', amount: 1600, category: 'Housing', type: 'expense' },
  { id: 't27', date: '2026-04-03', title: 'Groceries - Basket Bay', amount: 143, category: 'Groceries', type: 'expense' },
  { id: 't28', date: '2026-04-04', title: 'Side Project Payout', amount: 520, category: 'Freelance', type: 'income' },
];

export const seedUPITransactions: UPITransaction[] = [
  { id: 'u1', date: '2026-04-04', upiId: 'divyansh@oksbi', name: 'Swiggy', amount: 245, type: 'sent', status: 'success', reference: 'TXN20260404001', app: 'Google Pay' },
  { id: 'u2', date: '2026-04-04', upiId: 'ravi.kumar@paytm', name: 'Ravi Kumar', amount: 500, type: 'received', status: 'success', reference: 'TXN20260404002', app: 'PhonePe' },
  { id: 'u3', date: '2026-04-03', upiId: 'divyansh@oksbi', name: 'Amazon Pay', amount: 1299, type: 'sent', status: 'success', reference: 'TXN20260403001', app: 'Amazon' },
  { id: 'u4', date: '2026-04-03', upiId: 'divyansh@oksbi', name: 'Electricity Bill', amount: 870, type: 'sent', status: 'success', reference: 'TXN20260403002', app: 'Google Pay' },
  { id: 'u5', date: '2026-04-02', upiId: 'priya@ybl', name: 'Priya Sharma', amount: 200, type: 'received', status: 'success', reference: 'TXN20260402001', app: 'PhonePe' },
  { id: 'u6', date: '2026-04-02', upiId: 'divyansh@oksbi', name: 'Uber Ride', amount: 189, type: 'sent', status: 'success', reference: 'TXN20260402002', app: 'Google Pay' },
  { id: 'u7', date: '2026-04-01', upiId: 'divyansh@oksbi', name: 'Zomato', amount: 340, type: 'sent', status: 'failed', reference: 'TXN20260401001', app: 'PhonePe' },
  { id: 'u8', date: '2026-04-01', upiId: 'ankit@ibl', name: 'Ankit Verma', amount: 1500, type: 'received', status: 'success', reference: 'TXN20260401002', app: 'Google Pay' },
  { id: 'u9', date: '2026-03-31', upiId: 'divyansh@oksbi', name: 'Netflix', amount: 649, type: 'sent', status: 'success', reference: 'TXN20260331001', app: 'Google Pay' },
  { id: 'u10', date: '2026-03-30', upiId: 'divyansh@oksbi', name: 'Petrol Pump', amount: 500, type: 'sent', status: 'pending', reference: 'TXN20260330001', app: 'PhonePe' },
  { id: 'u11', date: '2026-03-29', upiId: 'meera@paytm', name: 'Meera Patel', amount: 800, type: 'received', status: 'success', reference: 'TXN20260329001', app: 'Paytm' },
  { id: 'u12', date: '2026-03-28', upiId: 'divyansh@oksbi', name: 'BigBasket', amount: 476, type: 'sent', status: 'success', reference: 'TXN20260328001', app: 'Google Pay' },
];

const seedUPIApps: UPIApp[] = [
  { id: 'app1', name: 'Google Pay', upiId: 'divyansh@oksbi', type: 'upi' },
  { id: 'app2', name: 'PhonePe', upiId: 'divyansh@ybl', type: 'upi' },
  { id: 'app3', name: 'Paytm Wallet', upiId: 'divyansh@paytm', type: 'wallet', balance: 340 },
];

const seedCoupons: Coupon[] = [
  { id: 'c1', title: '20% Off on Groceries', description: 'Get 20% off on BigBasket orders above ₹500', code: 'MINT20', discount: '20%', expiresAt: '2026-05-15', brand: 'BigBasket', category: 'Groceries', redeemed: false },
  { id: 'c2', title: 'Flat ₹100 Cashback', description: 'Earn ₹100 cashback on your next electricity bill payment', code: 'BILLSAVE100', discount: '₹100', expiresAt: '2026-04-30', brand: 'Google Pay', category: 'Utilities', redeemed: false },
  { id: 'c3', title: 'Free Delivery', description: 'Free delivery on Swiggy orders this weekend', code: 'FREEDEL', discount: 'Free Delivery', expiresAt: '2026-04-06', brand: 'Swiggy', category: 'Food', redeemed: false },
  { id: 'c4', title: '₹50 Off on Fuel', description: 'Save ₹50 on petrol purchases via PhonePe', code: 'FUEL50', discount: '₹50', expiresAt: '2026-04-20', brand: 'PhonePe', category: 'Transport', redeemed: true },
  { id: 'c5', title: '30% Off on Gym', description: '30% discount on Cult.fit monthly membership', code: 'FIT30', discount: '30%', expiresAt: '2026-06-01', brand: 'Cult.fit', category: 'Health', redeemed: false },
  { id: 'c6', title: '₹200 Shopping Voucher', description: 'Amazon shopping voucher on spending ₹2000+', code: 'SHOP200', discount: '₹200', expiresAt: '2026-05-10', brand: 'Amazon', category: 'Shopping', redeemed: false },
];

const seedBankAccounts: BankAccount[] = [
  { id: 'ba1', bankName: 'State Bank of India', accountNumber: 'XXXX XXXX 4521', ifsc: 'SBIN0001234', type: 'savings', balance: 45200 },
  { id: 'ba2', bankName: 'HDFC Bank', accountNumber: 'XXXX XXXX 8893', ifsc: 'HDFC0002345', type: 'savings', balance: 12800 },
];

const seedDematAccounts: DematAccount[] = [
  { id: 'da1', broker: 'Zerodha', dpId: '1234567890', accountType: 'Individual', invested: 150000, currentValue: 178500 },
  { id: 'da2', broker: 'Groww', dpId: '0987654321', accountType: 'Individual', invested: 50000, currentValue: 46200 },
];

const defaultHealth: UserHealth = {
  age: '24', weight: '68', height: '175', country: 'India',
  monthlyIncome: '45000', bmi: '22.2', dailyExercise: '30 mins', occupation: 'Software Developer',
};

const STORAGE_KEY = 'moneymint-v4';

const defaultFilters: Filters = { search: '', type: 'all', category: 'all', sortBy: 'date-desc' };

const initialState: DashboardState = {
  role: 'admin',
  transactions: seedTransactions,
  upiTransactions: seedUPITransactions,
  upiApps: seedUPIApps,
  bankAccounts: seedBankAccounts,
  dematAccounts: seedDematAccounts,
  profile: { name: 'Divyansh Nagar', email: 'divyansh@moneymint.local', phone: '+91 98765 43210', health: defaultHealth },
  coupons: seedCoupons,
  referralCode: 'MINTDIV2026',
  filters: defaultFilters,
  onboarded: false,
};

/* ═══════════════════════════════════════════
   REDUCER
   ═══════════════════════════════════════════ */

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_ROLE': return { ...state, role: action.payload };
    case 'ADD_TRANSACTION': return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'ADD_TRANSACTIONS_BULK': return { ...state, transactions: [...action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION': return { ...state, transactions: state.transactions.map((tx) => (tx.id === action.payload.id ? action.payload : tx)) };
    case 'DELETE_TRANSACTION': return { ...state, transactions: state.transactions.filter((tx) => tx.id !== action.payload) };
    case 'RESET_TRANSACTIONS': return { ...state, transactions: action.payload };
    case 'SET_FILTERS': return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_FILTERS': return { ...state, filters: defaultFilters };
    case 'ADD_BANK_ACCOUNT': return { ...state, bankAccounts: [...state.bankAccounts, action.payload] };
    case 'REMOVE_BANK_ACCOUNT': return { ...state, bankAccounts: state.bankAccounts.filter((a) => a.id !== action.payload) };
    case 'ADD_DEMAT_ACCOUNT': return { ...state, dematAccounts: [...state.dematAccounts, action.payload] };
    case 'REMOVE_DEMAT_ACCOUNT': return { ...state, dematAccounts: state.dematAccounts.filter((a) => a.id !== action.payload) };
    case 'ADD_UPI_APP': return { ...state, upiApps: [...state.upiApps, action.payload] };
    case 'REMOVE_UPI_APP': return { ...state, upiApps: state.upiApps.filter((a) => a.id !== action.payload) };
    case 'UPDATE_PROFILE': return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'UPDATE_HEALTH': return { ...state, profile: { ...state.profile, health: { ...state.profile.health, ...action.payload } } };
    case 'SET_ONBOARDED': return { ...state, onboarded: action.payload };
    case 'REDEEM_COUPON': return { ...state, coupons: state.coupons.map((c) => c.id === action.payload ? { ...c, redeemed: true } : c) };
    case 'LOAD_STATE': return { ...state, ...action.payload, filters: defaultFilters };
    default: return state;
  }
}

/* ═══════════════════════════════════════════
   CONTEXT
   ═══════════════════════════════════════════ */

type DashboardContextValue = {
  state: DashboardState;
  dispatch: Dispatch<DashboardAction>;
  filteredTransactions: Transaction[];
  totals: { income: number; expense: number; balance: number; savingsRate: number; spentToday: number };
  categories: string[];
  currentMonthSpending: { category: string; total: number; percentage: number; color: string }[];
  totalBankBalance: number;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

export const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function formatSignedCurrency(value: number) {
  const abs = currency.format(Math.abs(value));
  return value < 0 ? `-${abs}` : `+${abs}`;
}

export const draftDefaults: TransactionDraft = {
  date: new Date().toISOString().slice(0, 10), title: '', amount: '', category: '', type: 'expense',
};

const PIE_COLORS = ['#FFD60A', '#22C55E', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#10B981'];
export { PIE_COLORS };

/* ═══════════════════════════════════════════
   PROVIDER
   ═══════════════════════════════════════════ */

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed.transactions)) return;
      dispatch({ type: 'LOAD_STATE', payload: parsed });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const { filters: _f, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  }, [state]);

  const filteredTransactions = useMemo(() => {
    const { search, type, category, sortBy } = state.filters;
    const q = search.trim().toLowerCase();
    const filtered = state.transactions.filter((tx) => {
      const mt = type === 'all' || tx.type === type;
      const mc = category === 'all' || tx.category === category;
      const ms = q.length === 0 || tx.title.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q) || tx.date.includes(q);
      return mt && mc && ms;
    });
    const sorted = [...filtered];
    if (sortBy === 'date-desc') sorted.sort((a, b) => b.date.localeCompare(a.date));
    if (sortBy === 'date-asc') sorted.sort((a, b) => a.date.localeCompare(b.date));
    if (sortBy === 'amount-desc') sorted.sort((a, b) => b.amount - a.amount);
    if (sortBy === 'amount-asc') sorted.sort((a, b) => a.amount - b.amount);
    return sorted;
  }, [state.transactions, state.filters]);

  const totals = useMemo(() => {
    const income = state.transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = state.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = income - expense;
    const savingsRate = income === 0 ? 0 : (balance / income) * 100;
    const today = new Date().toISOString().slice(0, 10);
    const spentToday = state.transactions.filter((t) => t.type === 'expense' && t.date === today).reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance, savingsRate, spentToday };
  }, [state.transactions]);

  const categories = useMemo(() => {
    const set = new Set(state.transactions.map((t) => t.category));
    return ['all', ...Array.from(set).sort()];
  }, [state.transactions]);

  const currentMonthSpending = useMemo(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const map = new Map<string, number>();
    let total = 0;
    for (const tx of state.transactions) {
      if (tx.type !== 'expense' || !tx.date.startsWith(monthKey)) continue;
      map.set(tx.category, (map.get(tx.category) ?? 0) + tx.amount);
      total += tx.amount;
    }
    return Array.from(map.entries())
      .map(([category, amt], i) => ({ category, total: amt, percentage: total === 0 ? 0 : (amt / total) * 100, color: PIE_COLORS[i % PIE_COLORS.length] }))
      .sort((a, b) => b.total - a.total);
  }, [state.transactions]);

  const totalBankBalance = useMemo(() => state.bankAccounts.reduce((s, a) => s + a.balance, 0), [state.bankAccounts]);

  const value: DashboardContextValue = { state, dispatch, filteredTransactions, totals, categories, currentMonthSpending, totalBankBalance };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}
