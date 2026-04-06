'use client';

import { useMemo, useState } from 'react';
import { currency, useDashboard, type Transaction } from '@/lib/dashboard-store';

type ExpenseAnalysis = {
  score: number;
  summary: string;
  strengths: string[];
  risks: string[];
  actions: string[];
};

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getPastDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return toDateOnly(d);
}

function analyzeExpenditure(expenses: Transaction[], income: number): ExpenseAnalysis {
  if (expenses.length === 0) {
    return {
      score: 78,
      summary: 'No expense records were found in the selected period. Add a few transactions for a sharper AI score.',
      strengths: ['No unnecessary cash outflow detected in current data.'],
      risks: ['Limited data can hide recurring costs.'],
      actions: ['Track at least 7-10 daily expenses to generate more reliable insights.'],
    };
  }

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const avgExpense = totalExpense / expenses.length;
  const foodAndLeisure = expenses
    .filter((item) => ['Food', 'Shopping', 'Entertainment'].includes(item.category))
    .reduce((sum, item) => sum + item.amount, 0);
  const discretionaryRatio = totalExpense === 0 ? 0 : (foodAndLeisure / totalExpense) * 100;

  const categoryTotals = expenses.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const topCategoryShare = topCategory ? (topCategory[1] / totalExpense) * 100 : 0;

  let score = 82;
  if (income > 0) {
    const spendRatio = (totalExpense / income) * 100;
    if (spendRatio > 75) score -= 22;
    else if (spendRatio > 60) score -= 14;
    else if (spendRatio > 45) score -= 7;
  }

  if (discretionaryRatio > 35) score -= 10;
  else if (discretionaryRatio > 25) score -= 6;

  if (topCategoryShare > 40) score -= 8;
  else if (topCategoryShare > 30) score -= 4;

  if (avgExpense < 500) score += 4;

  score = Math.max(28, Math.min(96, Math.round(score)));

  const summary =
    score >= 80
      ? 'Your spending is mostly under control. Maintain consistency and keep an eye on your highest category.'
      : score >= 65
        ? 'Your expenditure is manageable, but a few category-level adjustments can improve savings quickly.'
        : 'Your current expense pattern is heavy. A focused weekly cap can improve your financial health.';

  const strengths = [
    `Tracked ${expenses.length} expense transaction${expenses.length > 1 ? 's' : ''} in the recent period.`,
    `Average expense size is ${currency.format(Math.round(avgExpense))}.`,
  ];

  const risks = [
    topCategory
      ? `${topCategory[0]} contributes ${topCategoryShare.toFixed(1)}% of your spend.`
      : 'Category concentration could not be estimated.',
    `Discretionary spend (Food/Shopping/Entertainment) is ${discretionaryRatio.toFixed(1)}%.`,
  ];

  const actions = [
    'Set one weekly spending cap for your top category and track adherence.',
    'Keep at least 20-30% of income as protected savings before optional purchases.',
    'Review subscriptions and repeat transactions every Sunday for 10 minutes.',
  ];

  return { score, summary, strengths, risks, actions };
}

export default function InsightsPage() {
  const { state, totals } = useDashboard();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ExpenseAnalysis | null>(null);

  const expenseWindow = useMemo(() => {
    const start = getPastDate(30);
    return state.transactions.filter((tx) => tx.type === 'expense' && tx.date >= start);
  }, [state.transactions]);

  const snapshot = useMemo(() => {
    const total = expenseWindow.reduce((sum, tx) => sum + tx.amount, 0);
    const days = 30;
    const avgDaily = total / days;

    const byCategory = expenseWindow.reduce<Record<string, number>>((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

    const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    return {
      total,
      avgDaily,
      topCategory: top ? top[0] : 'N/A',
      topCategoryValue: top ? top[1] : 0,
    };
  }, [expenseWindow]);

  function runAnalysis() {
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setAnalysis(analyzeExpenditure(expenseWindow, totals.income));
      setIsAnalyzing(false);
    }, 900);
  }

  return (
    <div className="space-y-5 nb-animate-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
          Intelligence
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Insights
        </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Personalized expenditure coaching based on your latest transaction behavior.
          </p>
        </div>

        <button type="button" onClick={runAnalysis} disabled={isAnalyzing} className="nb-btn nb-btn-primary nb-btn-sm w-full sm:w-auto">
          {isAnalyzing ? 'Analyzing...' : 'Analyze My Expenditure'}
        </button>
      </div>

      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="nb-card p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>30d Expenses</p>
          <p className="text-base sm:text-lg font-extrabold mt-1" style={{ color: 'var(--text-primary)' }}>{currency.format(snapshot.total)}</p>
        </div>
        <div className="nb-card p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Avg Daily Spend</p>
          <p className="text-base sm:text-lg font-extrabold mt-1" style={{ color: 'var(--text-primary)' }}>{currency.format(Math.round(snapshot.avgDaily))}</p>
        </div>
        <div className="nb-card p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Savings Rate</p>
          <p className="text-base sm:text-lg font-extrabold mt-1" style={{ color: totals.savingsRate >= 25 ? 'var(--income)' : 'var(--warning)' }}>
            {totals.savingsRate.toFixed(1)}%
          </p>
        </div>
        <div className="nb-card p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Top Category</p>
          <p className="text-base sm:text-lg font-extrabold mt-1 truncate" style={{ color: 'var(--text-primary)' }}>{snapshot.topCategory}</p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{currency.format(snapshot.topCategoryValue)}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="nb-card p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            AI Expenditure Score
          </p>

          {analysis ? (
            <>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {analysis.score}
                    <span className="text-base font-bold" style={{ color: 'var(--text-muted)' }}>/100</span>
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{analysis.summary}</p>
                </div>
              </div>

              <div className="mt-3 h-2 w-full rounded-full" style={{ backgroundColor: 'var(--surface-2)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${analysis.score}%`,
                    backgroundColor: analysis.score >= 80 ? 'var(--income)' : analysis.score >= 65 ? 'var(--warning)' : 'var(--expense)',
                  }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
              Run analysis to generate your personalized score, risk signals, and action plan.
            </p>
          )}
        </div>

        <div className="nb-card p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Spending Distribution (30d)
          </p>
          <div className="mt-3 space-y-2">
            {Object.entries(
              expenseWindow.reduce<Record<string, number>>((acc, tx) => {
                acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
                return acc;
              }, {}),
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([category, total]) => {
                const pct = snapshot.total === 0 ? 0 : (total / snapshot.total) * 100;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>{category}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{pct.toFixed(1)}%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--surface-2)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: 'var(--accent)' }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {analysis && (
        <section className="grid gap-4 md:grid-cols-3">
          <div className="nb-card p-4">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>What is going well</p>
            <div className="space-y-2">
              {analysis.strengths.map((item) => (
                <p key={item} className="text-sm" style={{ color: 'var(--text-primary)' }}>{item}</p>
              ))}
            </div>
          </div>

          <div className="nb-card p-4">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Risk signals</p>
            <div className="space-y-2">
              {analysis.risks.map((item) => (
                <p key={item} className="text-sm" style={{ color: 'var(--text-primary)' }}>{item}</p>
              ))}
            </div>
          </div>

          <div className="nb-card p-4">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Recommended actions</p>
            <div className="space-y-2">
              {analysis.actions.map((item) => (
                <p key={item} className="text-sm" style={{ color: 'var(--text-primary)' }}>{item}</p>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
