'use client';

import { useState } from 'react';
import { useDashboard, currency } from '@/lib/dashboard-store';

export default function InsightsPanel() {
  const { totals, state, currentMonthSpending } = useDashboard();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const topCategory = currentMonthSpending[0];

  const avgExpense = (() => {
    const expenses = state.transactions.filter((tx) => tx.type === 'expense');
    return expenses.length === 0 ? 0 : expenses.reduce((s, t) => s + t.amount, 0) / expenses.length;
  })();

  const savingsAssessment = totals.savingsRate >= 30
    ? 'Excellent saving habits. Over 30% of income is being saved.'
    : totals.savingsRate >= 20
    ? 'Healthy savings rate. Consider optimizing recurring expenses.'
    : totals.savingsRate >= 10
    ? 'Savings are modest. Review discretionary spending.'
    : 'Savings are below recommended levels. A budget review is advised.';

  // Quick suggestions based on data
  const suggestions: string[] = [];
  const foodSpend = state.transactions.filter(t => t.type === 'expense' && t.category === 'Food').reduce((s, t) => s + t.amount, 0);
  if (foodSpend > 300) suggestions.push(`Food spending is ₹${foodSpend} — consider meal prepping to save 30-40% on dining.`);
  const subSpend = state.transactions.filter(t => t.type === 'expense' && t.category === 'Software').reduce((s, t) => s + t.amount, 0);
  if (subSpend > 0) suggestions.push(`You have ₹${subSpend} in software subscriptions. Audit for unused services.`);
  if (totals.savingsRate < 20) suggestions.push('Aim for a 20% savings rate by automating a monthly SIP or recurring deposit.');
  if (state.dematAccounts.length > 0) {
    const losing = state.dematAccounts.filter(d => d.currentValue < d.invested);
    if (losing.length > 0) suggestions.push(`${losing.map(d => d.broker).join(', ')} ${losing.length === 1 ? 'is' : 'are'} showing losses. Review your portfolio allocation.`);
  }
  if (suggestions.length === 0) suggestions.push('Your finances look healthy. Keep maintaining your current savings discipline.');

  async function fetchAiInsight() {
    setAiLoading(true);
    setAiError(null);
    try {
      const summary = {
        totalIncome: totals.income,
        totalExpense: totals.expense,
        balance: totals.balance,
        savingsRate: totals.savingsRate.toFixed(1),
        topCategories: currentMonthSpending.slice(0, 5).map((c) => ({ category: c.category, total: c.total, pct: c.percentage.toFixed(1) })),
      };
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary, userHealth: state.profile.health }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setAiInsight(data.insight ?? 'No insight generated.');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to fetch insight');
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="nb-card p-5">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Top Spending</p>
          <p className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>{topCategory?.category ?? 'N/A'}</p>
          {topCategory && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{currency.format(topCategory.total)}</p>}
        </div>
        <div className="nb-card p-5">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Avg Expense</p>
          <p className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>{currency.format(Math.round(avgExpense))}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Per transaction</p>
        </div>
        <div className="nb-card p-5">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Assessment</p>
          <p className="text-sm font-bold leading-relaxed" style={{ color: 'var(--text-primary)' }}>{savingsAssessment}</p>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="nb-card p-6">
        <h2 className="text-base font-bold mb-4">Smart Suggestions</h2>
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className="nb-card-flat p-4 flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 shrink-0 rounded-md text-xs font-black" style={{ backgroundColor: 'var(--accent)', color: '#1A1A1A', border: '1.5px solid var(--nb-border-color)' }}>
                {i + 1}
              </span>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Section */}
      <div className="nb-card p-6" style={{ borderLeftWidth: 5, borderLeftColor: 'var(--accent)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold">AI-Powered Analysis</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Powered by Gemini 2.5 Pro — uses your health &amp; finance data</p>
          </div>
          <button type="button" onClick={fetchAiInsight} disabled={aiLoading} className="nb-btn nb-btn-primary">
            {aiLoading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                {aiInsight ? 'Refresh' : 'Generate'}
              </>
            )}
          </button>
        </div>

        {aiError && <p className="text-sm font-bold mb-3" style={{ color: 'var(--expense)' }}>{aiError}</p>}

        {aiInsight ? (
          <div className="nb-card-flat p-5">
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>{aiInsight}</p>
          </div>
        ) : !aiLoading ? (
          <div className="nb-card-flat p-6 text-center" style={{ color: 'var(--text-muted)' }}>
            Click Generate to get personalized AI analysis of your finances and health profile.
          </div>
        ) : null}
      </div>
    </div>
  );
}
