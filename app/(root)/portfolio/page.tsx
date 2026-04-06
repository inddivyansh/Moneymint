'use client';

import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from 'lucide-react';
import { useDashboard, currency } from '@/lib/dashboard-store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type StockPoint = {
  label: string;
  price: number;
};

type StockCard = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  marketCap: string;
  note: string;
  series: StockPoint[];
};

const sampleStocks: StockCard[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    sector: 'Energy & Retail',
    price: 2954,
    change: 1.42,
    marketCap: 'Large Cap',
    note: 'Balanced long-term story with strong diversification across core businesses.',
    series: [
      { label: 'Mon', price: 2875 },
      { label: 'Tue', price: 2890 },
      { label: 'Wed', price: 2912 },
      { label: 'Thu', price: 2904 },
      { label: 'Fri', price: 2954 },
    ],
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'IT Services',
    price: 3930,
    change: -0.38,
    marketCap: 'Large Cap',
    note: 'Steady compounder with lower volatility and dependable earnings visibility.',
    series: [
      { label: 'Mon', price: 3955 },
      { label: 'Tue', price: 3972 },
      { label: 'Wed', price: 3950 },
      { label: 'Thu', price: 3942 },
      { label: 'Fri', price: 3930 },
    ],
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    sector: 'Banking',
    price: 1718,
    change: 0.84,
    marketCap: 'Large Cap',
    note: 'Useful for defensive exposure when you want smoother portfolio behavior.',
    series: [
      { label: 'Mon', price: 1698 },
      { label: 'Tue', price: 1702 },
      { label: 'Wed', price: 1705 },
      { label: 'Thu', price: 1710 },
      { label: 'Fri', price: 1718 },
    ],
  },
  {
    symbol: 'INFY',
    name: 'Infosys',
    sector: 'IT Services',
    price: 1512,
    change: 2.11,
    marketCap: 'Large Cap',
    note: 'Momentum-friendly stock with clean chart structure in this sample portfolio.',
    series: [
      { label: 'Mon', price: 1468 },
      { label: 'Tue', price: 1482 },
      { label: 'Wed', price: 1491 },
      { label: 'Thu', price: 1503 },
      { label: 'Fri', price: 1512 },
    ],
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank',
    sector: 'Banking',
    price: 1286,
    change: 1.08,
    marketCap: 'Large Cap',
    note: 'Healthy trend continuation with a good balance of growth and stability.',
    series: [
      { label: 'Mon', price: 1258 },
      { label: 'Tue', price: 1262 },
      { label: 'Wed', price: 1270 },
      { label: 'Thu', price: 1280 },
      { label: 'Fri', price: 1286 },
    ],
  },
];

function formatChange(change: number) {
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
}

function Sparkline({ series, positive }: { series: StockPoint[]; positive: boolean }) {
  const width = 180;
  const height = 56;
  const values = series.map((point) => point.price);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = series
    .map((point, index) => {
      const x = (index / Math.max(series.length - 1, 1)) * width;
      const y = height - ((point.price - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-14">
      <polyline
        fill="none"
        stroke={positive ? 'var(--income)' : 'var(--expense)'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {series.map((point, index) => {
        const x = (index / Math.max(series.length - 1, 1)) * width;
        const y = height - ((point.price - min) / range) * (height - 8) - 4;
        return <circle key={point.label} cx={x} cy={y} r="2.5" fill={positive ? 'var(--income)' : 'var(--expense)'} />;
      })}
    </svg>
  );
}

export default function PortfolioPage() {
  const { state } = useDashboard();
  const [activeStock, setActiveStock] = useState<StockCard | null>(sampleStocks[0]);

  const dematTotal = state.dematAccounts.reduce(
    (acc, account) => {
      acc.invested += account.invested;
      acc.current += account.currentValue;
      return acc;
    },
    { invested: 0, current: 0 },
  );

  const totalPnL = dematTotal.current - dematTotal.invested;
  const totalPnLPct = dematTotal.invested === 0 ? 0 : (totalPnL / dematTotal.invested) * 100;

  const portfolioHealth = useMemo(() => {
    const watchlistGainers = sampleStocks.filter((stock) => stock.change > 0).length;
    const avgChange = sampleStocks.reduce((sum, stock) => sum + stock.change, 0) / sampleStocks.length;
    const diversification = state.dematAccounts.length >= 2 ? 'Healthy' : 'Needs more spread';
    return { watchlistGainers, avgChange, diversification };
  }, [state.dematAccounts.length]);

  return (
    <div className="space-y-5 nb-animate-in">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Investments
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Portfolio
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            A practical stock view with performance, visuals, and click-to-open charts.
          </p>
        </div>

        <div className="nb-card-flat px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Portfolio health
          </p>
          <p className="text-sm mt-1 font-bold" style={{ color: 'var(--text-primary)' }}>
            {portfolioHealth.diversification} • {portfolioHealth.watchlistGainers} gainers • Avg {portfolioHealth.avgChange >= 0 ? '+' : ''}{portfolioHealth.avgChange.toFixed(2)}%
          </p>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="nb-card p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Invested</p>
          <p className="text-xl sm:text-2xl font-extrabold mt-2 truncate" style={{ fontFamily: 'var(--font-display)' }}>{currency.format(dematTotal.invested)}</p>
        </div>
        <div className="nb-card p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Current Value</p>
          <p className="text-xl sm:text-2xl font-extrabold mt-2 truncate" style={{ fontFamily: 'var(--font-display)' }}>{currency.format(dematTotal.current)}</p>
        </div>
        <div className="nb-card p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>P&L Amount</p>
          <p className="text-xl sm:text-2xl font-extrabold mt-2 truncate" style={{ fontFamily: 'var(--font-display)', color: totalPnL >= 0 ? 'var(--income)' : 'var(--expense)' }}>
            {totalPnL >= 0 ? '+' : ''}{currency.format(totalPnL)}
          </p>
        </div>
        <div className="nb-card p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>P&L %</p>
          <p className="text-xl sm:text-2xl font-extrabold mt-2 truncate" style={{ fontFamily: 'var(--font-display)', color: totalPnL >= 0 ? 'var(--income)' : 'var(--expense)' }}>
            {totalPnL >= 0 ? '+' : ''}{totalPnLPct.toFixed(2)}%
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="nb-card p-4 sm:p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-4">
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Sample Stock Watchlist</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Tap any stock to open a larger chart view and compare trend direction.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Activity className="w-4 h-4" /> Interactive charts
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {sampleStocks.map((stock) => {
              const isUp = stock.change >= 0;
              return (
                <button
                  key={stock.symbol}
                  type="button"
                  onClick={() => setActiveStock(stock)}
                  className="text-left nb-card-flat p-4 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{stock.symbol}</p>
                      <h3 className="text-sm font-bold truncate mt-1" style={{ color: 'var(--text-primary)' }}>{stock.name}</h3>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stock.sector} • {stock.marketCap}</p>
                    </div>
                    <span className={`nb-badge text-[10px] font-bold whitespace-nowrap ${isUp ? 'nb-badge-income' : 'nb-badge-expense'}`}>
                      {formatChange(stock.change)}
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-lg font-extrabold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                        {currency.format(stock.price)}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stock.note}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: isUp ? 'var(--income)' : 'var(--expense)' }}>
                      {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      View graph
                    </div>
                  </div>

                  <div className="mt-3">
                    <Sparkline series={stock.series} positive={isUp} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="nb-card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Allocation Snapshot</h2>
            </div>

            <div className="space-y-3">
              {state.dematAccounts.length === 0 ? (
                <div className="nb-card-flat p-4 text-center" style={{ color: 'var(--text-muted)' }}>
                  <p className="text-sm">No linked demat accounts yet.</p>
                  <p className="text-xs mt-2">Add accounts from Profile to see your live portfolio summary here.</p>
                </div>
              ) : (
                state.dematAccounts.map((account) => {
                  const pnl = account.currentValue - account.invested;
                  const pnlPct = account.invested === 0 ? 0 : (pnl / account.invested) * 100;
                  const share = dematTotal.current === 0 ? 0 : (account.currentValue / dematTotal.current) * 100;
                  const isProfit = pnl >= 0;

                  return (
                    <div key={account.id} className="nb-card-flat p-3.5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{account.broker}</p>
                          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{account.accountType} • {account.dpId}</p>
                        </div>
                        <span className={`nb-badge text-[10px] font-bold whitespace-nowrap ${isProfit ? 'nb-badge-income' : 'nb-badge-expense'}`}>
                          {isProfit ? '+' : ''}{pnlPct.toFixed(2)}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs mb-2">
                        <span style={{ color: 'var(--text-muted)' }}>Portfolio share</span>
                        <span style={{ color: 'var(--text-primary)' }}>{share.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--surface-2)' }}>
                        <div className="h-full rounded-full" style={{ width: `${share}%`, backgroundColor: 'var(--accent)' }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="nb-card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Portfolio Notes</h2>
            </div>

            <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>• Use the watchlist to compare momentum between sectors before making fresh allocations.</p>
              <p>• The graph modal is built for quick review, so you can check trend shape without losing context.</p>
              <p>• Portfolio share bars help you see concentration risk at a glance.</p>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={Boolean(activeStock)} onOpenChange={(open) => !open && setActiveStock(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {activeStock && (
            <>
              <DialogHeader>
                <DialogTitle className="text-left">{activeStock.name} ({activeStock.symbol})</DialogTitle>
                <DialogDescription className="text-left">
                  {activeStock.sector} • {activeStock.marketCap} • {activeStock.change >= 0 ? 'Momentum positive' : 'Under pressure'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] mt-2">
                <div className="nb-card-flat p-4">
                  <div className="flex items-end justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Latest price</p>
                      <p className="text-3xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                        {currency.format(activeStock.price)}
                      </p>
                    </div>
                    <span className={`nb-badge text-xs font-bold ${activeStock.change >= 0 ? 'nb-badge-income' : 'nb-badge-expense'}`}>
                      {formatChange(activeStock.change)}
                    </span>
                  </div>

                  <svg viewBox="0 0 400 220" className="w-full h-56">
                    <defs>
                      <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={activeStock.change >= 0 ? 'var(--income)' : 'var(--expense)'} stopOpacity="0.28" />
                        <stop offset="100%" stopColor={activeStock.change >= 0 ? 'var(--income)' : 'var(--expense)'} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {(() => {
                      const values = activeStock.series.map((item) => item.price);
                      const min = Math.min(...values);
                      const max = Math.max(...values);
                      const range = max - min || 1;
                      const width = 360;
                      const height = 140;
                      const offsetX = 20;
                      const offsetY = 20;
                      const points = activeStock.series.map((item, index) => {
                        const x = offsetX + (index / Math.max(activeStock.series.length - 1, 1)) * width;
                        const y = offsetY + height - ((item.price - min) / range) * height;
                        return { x, y };
                      });

                      const line = points.map((point) => `${point.x},${point.y}`).join(' ');
                      const area = `${offsetX},${offsetY + height} ${line} ${offsetX + width},${offsetY + height}`;

                      return (
                        <>
                          <path d={`M ${area}`} fill="url(#chartFill)" />
                          <polyline
                            fill="none"
                            stroke={activeStock.change >= 0 ? 'var(--income)' : 'var(--expense)'}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={line}
                          />
                          {points.map((point, index) => (
                            <circle key={activeStock.series[index].label} cx={point.x} cy={point.y} r="5" fill={activeStock.change >= 0 ? 'var(--income)' : 'var(--expense)'} />
                          ))}
                        </>
                      );
                    })()}
                  </svg>

                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {activeStock.series.map((point) => (
                      <div key={point.label} className="text-center">
                        <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>{point.label}</p>
                        <p className="text-xs font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{currency.format(point.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="nb-card-flat p-4">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Decision summary</p>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-primary)' }}>
                      {activeStock.note}
                    </p>
                  </div>

                  <div className="nb-card-flat p-4">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Suggested use</p>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-primary)' }}>
                      Watch the chart for trend continuation, compare it with your other holdings, and use this as a decision-support view rather than a noisy terminal screen.
                    </p>
                  </div>

                  <div className="nb-card-flat p-4">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Quick metrics</p>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <p className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Day change</p>
                        <p className="text-sm font-bold mt-1" style={{ color: activeStock.change >= 0 ? 'var(--income)' : 'var(--expense)' }}>{formatChange(activeStock.change)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Risk band</p>
                        <p className="text-sm font-bold mt-1" style={{ color: 'var(--text-primary)' }}>Moderate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
