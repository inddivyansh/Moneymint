'use client';

import { useDashboard, currency } from '@/lib/dashboard-store';

export default function SummaryCards() {
  const { totals } = useDashboard();

  const cards = [
    {
      title: 'Total Balance',
      value: currency.format(totals.balance),
      hint: 'Net income after expenses',
      accent: 'accent-strip-left',
      sign: totals.balance >= 0 ? '+' : '',
    },
    {
      title: 'Total Income',
      value: currency.format(totals.income),
      hint: `From ${totals.transactionCount} transactions`,
      accent: 'accent-strip-income',
      sign: '+',
    },
    {
      title: 'Total Expenses',
      value: currency.format(totals.expense),
      hint: 'All outgoing cashflow',
      accent: 'accent-strip-expense',
      sign: '-',
    },
    {
      title: 'Savings Rate',
      value: `${totals.savingsRate.toFixed(1)}%`,
      hint: '(Balance / Income) x 100',
      accent: 'accent-strip-info',
      sign: '',
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.title}
          className={`nb-card p-5 ${card.accent}`}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            {card.title}
          </p>
          <p
            className="text-3xl font-extrabold tracking-tight mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            {card.value}
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            {card.hint}
          </p>
        </article>
      ))}
    </section>
  );
}
