'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Check, Star } from 'lucide-react';

/* ── FAQ Accordion Item ── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="wl-faq-item" onClick={() => setOpen(!open)}>
      <div className="wl-faq-q">
        <span>{question}</span>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && <p className="wl-faq-a">{answer}</p>}
    </div>
  );
}

export default function WelcomePage() {
  const router = useRouter();
  const [activeChip, setActiveChip] = useState(0);

  const chips = [
    { label: 'Track my own finances' },
    { label: 'Manage a household budget' },
    { label: 'Grow my investments' },
  ];

  const integrationFiles = [
    'State_Bank_of_India_idRKmRdVBc_1.png', 'Axis_Bank_idHcfGpT5s_1.png', 'Groww_Groww-White-Logo-BrandFetch_1.png', 
    'ICICI_Bank_idpyGoeREm_1.png', 'id8bPSMu5F.png', 'id63MIL7ZL.jpeg', 
    'idKeDDClfD.jpeg', 'idNM9kc7jQ.png', 'idpyaT_76o.jpeg', 
    'idTwScErMg.png', 'idtyjMtrZe.png', 'PhonePe_idwlva8idc_1.png'
  ];

  const floatingIcons = [
    { file: 'State_Bank_of_India_idRKmRdVBc_1.png', size: 100, x: 150, y: 120 },
    { file: 'Axis_Bank_idHcfGpT5s_1.png', size: 80, x: 80, y: 300 },
    { file: 'Groww_Groww-White-Logo-BrandFetch_1.png', size: 120, x: 200, y: 480 },
    { file: 'ICICI_Bank_idpyGoeREm_1.png', size: 90, x: 320, y: 200 },
    { file: 'id8bPSMu5F.png', size: 70, x: 350, y: 400 },
    { file: 'id63MIL7ZL.jpeg', size: 85, x: 280, y: 80 },
    { file: 'idKeDDClfD.jpeg', size: 100, x: 1050, y: 120 },
    { file: 'idNM9kc7jQ.png', size: 80, x: 1120, y: 300 },
    { file: 'idpyaT_76o.jpeg', size: 120, x: 1000, y: 480 },
    { file: 'idTwScErMg.png', size: 90, x: 880, y: 200 },
    { file: 'idtyjMtrZe.png', size: 70, x: 850, y: 400 },
    { file: 'PhonePe_idwlva8idc_1.png', size: 95, x: 950, y: 80 }
  ];

  return (
    <div className="wl-root">

      {/* ═══════ ANNOUNCEMENT BANNER ═══════ */}
      <div className="wl-banner">
        <span className="wl-banner-dot" />
        Moneymint now features AI-powered insights with Gemini 2.5 Pro.&nbsp;
        <button className="wl-banner-link" onClick={() => router.push('/home')}>Try it now →</button>
      </div>

      {/* ═══════ NAV ═══════ */}
      <header className="wl-nav">
        <div className="wl-nav-inner">
          <div className="wl-logo-group">
            <Image src="/assets/icons/moneymintlogo.png" alt="Moneymint Logo" width={40} height={40} className="wl-logo-mark" />
            <span className="wl-logo-text">Moneymint</span>
          </div>
          <div className="wl-nav-actions">
            <button className="wl-btn-accent" onClick={() => router.push('/home')}>Open Dashboard</button>
          </div>
        </div>
      </header>

      {/* ═══════ HERO ═══════ */}
      <section className="wl-hero">
        {/* Left */}
        <div className="wl-hero-left">
          <h1 className="wl-hero-title">
            The <em className="wl-hero-em">easiest</em> way<br />
             to manage your money
          </h1>

          <ul className="wl-hero-checks">
            <li><Check className="w-4 h-4 text-accent inline mr-1" /> Track expenses, income, UPI payments, and investments in one place</li>
            <li><Check className="w-4 h-4 text-accent inline mr-1" /> AI-powered insights to catch spending leaks &amp; optimize savings</li>
            <li><Check className="w-4 h-4 text-accent inline mr-1" /> Bulk import via Excel/CSV — we handle the heavy lifting</li>
            <li><Check className="w-4 h-4 text-accent inline mr-1" /> Portfolio P&amp;L, News Feed, Rewards, and much more</li>
          </ul>

          <p className="wl-hero-label">I want to:</p>
          <div className="wl-chips">
            {chips.map((c, i) => (
              <button
                key={i}
                className={`wl-chip ${activeChip === i ? 'wl-chip-active' : ''}`}
                onClick={() => setActiveChip(i)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="wl-hero-input-row" style={{ display: 'none' }}>
          </div>

          <button className="wl-btn-welcome" onClick={() => router.push('/home')}>
            Welcome — Enter Dashboard
          </button>
        </div>

        {/* Right — Dashboard Preview */}
        <div className="wl-hero-right">
          <div className="wl-hero-rating">
            <span className="wl-stars">
              <Star className="w-4 h-4 fill-accent text-accent inline" />
              <Star className="w-4 h-4 fill-accent text-accent inline" />
              <Star className="w-4 h-4 fill-accent text-accent inline" />
              <Star className="w-4 h-4 fill-accent text-accent inline" />
              <Star className="w-4 h-4 fill-accent text-accent inline" />
            </span>
            <span className="wl-rating-text">4,900+ 5-star reviews</span>
          </div>
          <div className="wl-preview-card">
            <Image
              src="/assets/images/dashboard.png"
              alt="Moneymint Dashboard"
              width={720}
              height={480}
              className="wl-preview-img"
              priority
            />
          </div>
        </div>
      </section>

      {/* ═══════ TRUST BAR ═══════ */}
      <section className="wl-trust-bar">
        <p className="wl-trust-text">Join <strong>2,500+</strong> members who trust Moneymint</p>
        <div className="wl-trust-marquee-wrapper">
          <div className="wl-trust-marquee">
            {[...integrationFiles, ...integrationFiles].map((file, idx) => (
              <span key={idx} className="wl-trust-logo">
                <Image src={`/assets/icons/${file}`} alt="Partner" width={80} height={28} className="object-contain" style={{ width: 'auto', height: '28px', maxWidth: '80px', filter: 'grayscale(1)', opacity: 0.7 }} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES GRID ═══════ */}
      <section className="wl-section">
        <h2 className="wl-section-title">Features</h2>
        <div className="wl-features-grid">
          {[
            { icon: <Image src="/assets/icons/simple-illustration__money-receipt.svg" alt="Expense" width={80} height={80} />, title: 'Expense Management', desc: 'Automatically track, categorize, and log your expenses. Deposits automatically sync with your accounts.', link: 'Learn More' },
            { icon: <Image src="/assets/icons/simple-illustration__report-receipt.svg" alt="Analytics" width={80} height={80} />, title: 'Spending Analytics', desc: 'Visualize spending by category with interactive donut charts, balance trends, and monthly breakdowns.', link: 'Learn More' },
            { icon: <Image src="/assets/icons/simple-illustration__handcard.svg" alt="UPI" width={80} height={80} />, title: 'UPI & Bank Tracking', desc: 'Link multiple bank accounts and UPI IDs. Monitor balances across all accounts in a unified view.', link: 'Learn More' },
            { icon: <Image src="/assets/icons/simple-illustration__smartscan.svg" alt="Import" width={80} height={80} />, title: 'Excel/CSV Import', desc: "Bulk-import transactions from spreadsheets. Upload a file — we'll scan the details automatically.", link: 'Learn More' },
            { icon: <Image src="/assets/icons/simple-illustration__vertical-credit-cards.svg" alt="Portfolio" width={80} height={80} />, title: 'Portfolio P&L', desc: 'Link your demat accounts to track invested vs current value. See real-time profit & loss across brokers.', link: 'Learn More' },
            { icon: <Image src="/assets/icons/simple-illustration__earth.svg" alt="News" width={80} height={80} />, title: 'Financial News', desc: 'Stay updated with real-time market news, curated financial reports, and trending stock analysis.', link: 'Learn More' },
            { icon: <Image src="/assets/icons/simple-illustration__concierge-bot.svg" alt="Budgeting" width={80} height={80} />, title: 'Smart Budgeting', desc: 'Set monthly budgets and get alerts when you approach limits. Auto-categorized spending makes it effortless.', link: 'Learn More' },
            { icon: <Image src="/assets/icons/simple-illustration__virtualcard.svg" alt="Export" width={80} height={80} />, title: 'Export & Reports', desc: 'Export transaction data as CSV. Generate monthly summaries and share with your accountant or advisor.', link: 'Learn More' },
            { icon: <Image src="/assets/icons/simple-illustration__luggage.svg" alt="AI Insights" width={80} height={80} />, title: 'AI-Powered Insights', desc: 'Gemini 2.5 Pro analyzes your data and delivers personalized advice, anomaly alerts, and savings tips.', link: 'Learn More' },
          ].map((f, i) => (
            <div key={i} className="wl-feature-card">
              <div className="wl-feature-header">
                <span className="wl-feature-icon">{f.icon}</span>
                <h3 className="wl-feature-title">{f.title}</h3>
              </div>
              <p className="wl-feature-desc">{f.desc}</p>
              <button className="wl-feature-link" onClick={() => router.push('/home')}>{f.link}</button>
            </div>
          ))}
        </div>
        <div className="wl-center-btn">
          <button className="wl-btn-accent" onClick={() => router.push('/home')}>See All Features</button>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="wl-section wl-section-alt">
        <h2 className="wl-section-title">Highly rated, easy to use</h2>
        <div className="wl-testimonials">
          {[
            { quote: '"The smartest expense tracker I\'ve ever used. The AI insights alone saved me ₹15,000 last month by catching subscription leaks I\'d completely forgotten about."', name: 'Ethan R.', role: 'Retail Investor', stars: 5, avatar: '/assets/images/author_weston.png' },
            { quote: '"Clean. Powerful. The neobrutalist design is gorgeous and the bulk Excel import saved me hours of manual data entry. Genuinely changed how I manage money."', name: 'Priya M.', role: 'Freelance Designer', stars: 5, avatar: '/assets/images/author_kristen.png' },
            { quote: '"Finally, a finance dashboard that doesn\'t look like it was built in 2005. The UPI tracking and portfolio P&L features are absolute game-changers."', name: 'Rohan K.', role: 'Software Engineer', stars: 5, avatar: '/assets/images/author_luis.png' },
          ].map((t, i) => (
            <div key={i} className="wl-testimonial-card">
              <div className="wl-t-stars">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j} className="wl-star-icon"><Star className="w-3.5 h-3.5 fill-accent text-accent inline" /></span>
                ))}
              </div>
              <p className="wl-t-quote">{t.quote}</p>
              <div className="wl-t-author">
                <Image src={t.avatar} alt={t.name} width={40} height={40} className="wl-t-avatar" />
                <div>
                  <p className="wl-t-name">{t.name}</p>
                  <p className="wl-t-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="wl-review-badges">
          <span className="wl-review-badge">
            <span className="wl-stars-sm">
              <Star className="w-3 h-3 fill-accent text-accent inline" />
              <Star className="w-3 h-3 fill-accent text-accent inline" />
              <Star className="w-3 h-3 fill-accent text-accent inline" />
              <Star className="w-3 h-3 fill-accent text-accent inline" />
              <Star className="w-3 h-3 fill-accent text-accent inline" />
            </span> 4.8 (4,900 reviews)
          </span>
        </div>
      </section>

      {/* ═══════ INTEGRATIONS HUB ═══════ */}
      <section className="wl-section" style={{ overflow: 'hidden' }}>
        <p className="wl-int-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>45+ Integrations</p>
        <div className="wl-integrations-visual">
          <svg className="wl-int-lines" width="1200" height="600" viewBox="0 0 1200 600">
            {floatingIcons.map((icon, i) => (
              <path key={`path-${i}`} d={`M 600 300 Q ${600 + (icon.x - 600) * 0.75} ${(icon.y + 300) / 2} ${icon.x} ${icon.y}`} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6 6" />
            ))}
          </svg>
          
          {floatingIcons.map((icon, i) => (
            <div key={`dot-${i}`} className="wl-int-floating" style={{ left: icon.x, top: icon.y, width: icon.size, height: icon.size, marginLeft: -icon.size / 2, marginTop: -icon.size / 2 }}>
              <Image src={`/assets/icons/${icon.file}`} alt="Integration Partner" width={icon.size} height={icon.size} className="object-contain" style={{ width: '80%', height: '80%', borderRadius: '50%' }} />
            </div>
          ))}
          
          <div className="wl-int-hero-circle" style={{ left: 600, top: 300, marginLeft: -90, marginTop: -90 }}>
            <Image src="/assets/icons/moneymintlogo.png" alt="Moneymint Logo" width={160} height={160} className="object-contain" />
          </div>
        </div>
        <div className="wl-center-btn">
            <button className="wl-feature-link" onClick={() => router.push('/home')}>See All Integrations</button>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="wl-section wl-section-alt">
        <h2 className="wl-section-title">FAQ</h2>
        <div className="wl-faq-grid">
          <div className="wl-faq-col">
            <FaqItem question="What is Moneymint?" answer="Moneymint is a personal finance dashboard that helps you track expenses, monitor investments, get AI-powered insights, and manage your money — all in one place." />
            <FaqItem question="Who is Moneymint for?" answer="Anyone who wants to take control of their finances — from students and freelancers to working professionals and investors." />
            <FaqItem question="What kind of expenses can I track?" answer="You can track income, expenses, UPI transactions, bank transfers, investments, and more. Bulk import via Excel/CSV is also supported." />
            <FaqItem question="Can I use Moneymint if my company doesn't use it?" answer="Absolutely! Moneymint is designed primarily for personal finance management. No company setup required." />
            <FaqItem question="How quickly can I get set up?" answer="You can start in under 2 minutes. Sign up, add your accounts, and you're good to go." />
          </div>
          <div className="wl-faq-col">
            <FaqItem question="What does Moneymint integrate with?" answer="We integrate with UPI apps, major banks, demat brokers like Zerodha and Groww, and support Excel/CSV imports." />
            <FaqItem question="Can Moneymint help with budgeting?" answer="Yes! Set monthly budgets by category, get alerts when approaching limits, and track savings rate automatically." />
            <FaqItem question="How do I import transactions?" answer="Go to the Transactions page, click 'Import Excel', upload your spreadsheet, and map the columns. Done!" />
            <FaqItem question="How much does it cost?" answer="Moneymint is completely free for the current demo. Premium features will be available in a future release." />
            <FaqItem question="How do I get started?" answer="Click 'Welcome — Enter Dashboard' or sign up for a free account to start tracking your finances instantly." />
          </div>
        </div>
      </section>

      {/* ═══════ BOTTOM CTA ═══════ */}
      <section className="wl-cta-section">
        <div className="wl-cta-inner">
          <div className="wl-cta-left">
            <h2 className="wl-cta-title">
              Ready to take control of<br />your finances?
            </h2>
            <p className="wl-cta-subtitle">
              Enter your email to get started. Track every rupee, get AI insights, and build better money habits with Moneymint.
            </p>
          </div>
          <div className="wl-cta-right">
            <div className="wl-hero-input-row" style={{ display: 'none' }}>
            </div>
            <button className="wl-btn-welcome wl-btn-welcome-sm" onClick={() => router.push('/home')}>
              Welcome — Enter Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="wl-footer">
        <div className="wl-footer-inner">
          <div className="wl-footer-col">
            <h4 className="wl-footer-heading">Features</h4>
            {['Expense Management', 'Spending Analytics', 'AI Insights', 'UPI Tracking', 'Excel Import', 'News Feed', 'Rewards'].map(l => (
              <a key={l} className="wl-footer-link" href="#!">{l}</a>
            ))}
          </div>
          <div className="wl-footer-col">
            <h4 className="wl-footer-heading">Resources</h4>
            {['Help Center', 'FAQ', 'Documentation', 'API Reference'].map(l => (
              <a key={l} className="wl-footer-link" href="#!">{l}</a>
            ))}
          </div>
          <div className="wl-footer-col">
            <h4 className="wl-footer-heading">Learn More</h4>
            {['About Moneymint', 'Blog', 'Careers', 'Changelog'].map(l => (
              <a key={l} className="wl-footer-link" href="#!">{l}</a>
            ))}
          </div>
          <div className="wl-footer-col">
            <h4 className="wl-footer-heading">Get Started</h4>
            <button className="wl-footer-link" onClick={() => router.push('/home')}>Enter Dashboard</button>
          </div>
        </div>
        <div className="wl-footer-bottom">
          <p>© 2026 Moneymint, Inc. Built by Divyansh Nagar.</p>
        </div>
      </footer>
    </div>
  );
}
