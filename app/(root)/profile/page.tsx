'use client';

import { useState } from 'react';
import { useDashboard, currency, type BankAccount, type DematAccount } from '@/lib/dashboard-store';

export default function ProfilePage() {
  const { state, dispatch } = useDashboard();
  const isAdmin = state.role === 'admin';

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ name: state.profile.name, email: state.profile.email, phone: state.profile.phone });
  const [editingHealth, setEditingHealth] = useState(false);
  const [healthDraft, setHealthDraft] = useState(state.profile.health);

  const [showBankForm, setShowBankForm] = useState(false);
  const [bankDraft, setBankDraft] = useState({ bankName: '', accountNumber: '', ifsc: '', type: 'savings' as const, balance: '' });

  const [showDematForm, setShowDematForm] = useState(false);
  const [dematDraft, setDematDraft] = useState({ broker: '', dpId: '', accountType: 'Individual', invested: '', currentValue: '' });

  function saveProfile() {
    dispatch({ type: 'UPDATE_PROFILE', payload: profileDraft });
    setEditingProfile(false);
  }

  function saveHealth() {
    // Auto-calculate BMI
    const w = parseFloat(healthDraft.weight);
    const h = parseFloat(healthDraft.height) / 100;
    const bmi = w > 0 && h > 0 ? (w / (h * h)).toFixed(1) : healthDraft.bmi;
    dispatch({ type: 'UPDATE_HEALTH', payload: { ...healthDraft, bmi } });
    setEditingHealth(false);
  }

  function addBank() {
    if (!bankDraft.bankName.trim() || !bankDraft.accountNumber.trim()) return;
    const account: BankAccount = { id: `ba-${Date.now()}`, bankName: bankDraft.bankName.trim(), accountNumber: bankDraft.accountNumber.trim(), ifsc: bankDraft.ifsc.trim(), type: bankDraft.type, balance: Number(bankDraft.balance) || 0 };
    dispatch({ type: 'ADD_BANK_ACCOUNT', payload: account });
    setBankDraft({ bankName: '', accountNumber: '', ifsc: '', type: 'savings', balance: '' });
    setShowBankForm(false);
  }

  function addDemat() {
    if (!dematDraft.broker.trim() || !dematDraft.dpId.trim()) return;
    const account: DematAccount = { id: `da-${Date.now()}`, broker: dematDraft.broker.trim(), dpId: dematDraft.dpId.trim(), accountType: dematDraft.accountType, invested: Number(dematDraft.invested) || 0, currentValue: Number(dematDraft.currentValue) || 0 };
    dispatch({ type: 'ADD_DEMAT_ACCOUNT', payload: account });
    setDematDraft({ broker: '', dpId: '', accountType: 'Individual', invested: '', currentValue: '' });
    setShowDematForm(false);
  }

  const healthFields = [
    { key: 'age', label: 'Age', suffix: 'years' },
    { key: 'weight', label: 'Weight', suffix: 'kg' },
    { key: 'height', label: 'Height', suffix: 'cm' },
    { key: 'bmi', label: 'BMI', suffix: '' },
    { key: 'country', label: 'Country', suffix: '' },
    { key: 'monthlyIncome', label: 'Monthly Income', suffix: '₹' },
    { key: 'occupation', label: 'Occupation', suffix: '' },
    { key: 'dailyExercise', label: 'Daily Exercise', suffix: '' },
  ] as const;

  return (
    <div className="space-y-8 nb-animate-in">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Account</p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Profile</h1>
      </div>

      {/* User Details */}
      <div className="nb-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">Personal Details</h2>
          {isAdmin && !editingProfile && <button type="button" onClick={() => setEditingProfile(true)} className="nb-btn nb-btn-sm">Edit</button>}
        </div>
        {editingProfile ? (
          <div className="space-y-3">
            <label className="block"><span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Name</span><input value={profileDraft.name} onChange={e => setProfileDraft(p => ({ ...p, name: e.target.value }))} className="nb-input" /></label>
            <label className="block"><span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Email</span><input value={profileDraft.email} onChange={e => setProfileDraft(p => ({ ...p, email: e.target.value }))} className="nb-input" /></label>
            <label className="block"><span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Phone</span><input value={profileDraft.phone} onChange={e => setProfileDraft(p => ({ ...p, phone: e.target.value }))} className="nb-input" /></label>
            <div className="flex gap-2 pt-1"><button type="button" onClick={saveProfile} className="nb-btn nb-btn-primary nb-btn-sm">Save</button><button type="button" onClick={() => setEditingProfile(false)} className="nb-btn nb-btn-sm">Cancel</button></div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-12 h-12 text-lg font-black rounded-md" style={{ backgroundColor: 'var(--accent)', color: '#1A1A1A', border: '2px solid var(--nb-border-color)' }}>{state.profile.name[0]}</span>
            <div><p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{state.profile.name}</p><p className="text-sm" style={{ color: 'var(--text-muted)' }}>{state.profile.email}</p><p className="text-sm" style={{ color: 'var(--text-muted)' }}>{state.profile.phone}</p></div>
          </div>
        )}
      </div>

      {/* Health & Personal Info */}
      <div className="nb-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold">Health & Personal Info</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Used for personalized AI financial suggestions</p>
          </div>
          {isAdmin && !editingHealth && <button type="button" onClick={() => { setHealthDraft(state.profile.health); setEditingHealth(true); }} className="nb-btn nb-btn-sm">Edit</button>}
        </div>

        {editingHealth ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {healthFields.filter(f => f.key !== 'bmi').map(f => (
                <label key={f.key} className="block">
                  <span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>{f.label}</span>
                  <input value={healthDraft[f.key]} onChange={e => setHealthDraft(p => ({ ...p, [f.key]: e.target.value }))} className="nb-input" />
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-1"><button type="button" onClick={saveHealth} className="nb-btn nb-btn-primary nb-btn-sm">Save</button><button type="button" onClick={() => setEditingHealth(false)} className="nb-btn nb-btn-sm">Cancel</button></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {healthFields.map(f => (
              <div key={f.key} className="nb-card-flat p-3">
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>{f.label}</p>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {f.key === 'monthlyIncome' ? `₹${state.profile.health[f.key]}` : state.profile.health[f.key]}{f.suffix && f.key !== 'monthlyIncome' ? ` ${f.suffix}` : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bank Accounts */}
      <div className="nb-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">Bank Accounts</h2>
          {isAdmin && <button type="button" onClick={() => setShowBankForm(!showBankForm)} className="nb-btn nb-btn-sm nb-btn-primary">{showBankForm ? 'Cancel' : '+ Add'}</button>}
        </div>
        {showBankForm && (
          <div className="nb-card-flat p-4 mb-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block"><span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Bank Name</span><input value={bankDraft.bankName} onChange={e => setBankDraft(p => ({ ...p, bankName: e.target.value }))} className="nb-input" placeholder="HDFC Bank" /></label>
              <label className="block"><span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Account Number</span><input value={bankDraft.accountNumber} onChange={e => setBankDraft(p => ({ ...p, accountNumber: e.target.value }))} className="nb-input" placeholder="XXXX XXXX 1234" /></label>
              <label className="block"><span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>IFSC</span><input value={bankDraft.ifsc} onChange={e => setBankDraft(p => ({ ...p, ifsc: e.target.value }))} className="nb-input" placeholder="HDFC0001234" /></label>
              <label className="block"><span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Balance</span><input value={bankDraft.balance} onChange={e => setBankDraft(p => ({ ...p, balance: e.target.value }))} className="nb-input" placeholder="0" inputMode="decimal" /></label>
            </div>
            <button type="button" onClick={addBank} className="nb-btn nb-btn-primary nb-btn-sm">Add Account</button>
          </div>
        )}
        {state.bankAccounts.length === 0 ? (
          <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>No bank accounts linked.</p>
        ) : (
          <div className="space-y-3">
            {state.bankAccounts.map(a => (
              <div key={a.id} className="nb-card-flat p-4 flex items-center justify-between gap-4">
                <div className="min-w-0"><p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{a.bankName}</p><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.accountNumber} &middot; {a.ifsc} &middot; {a.type}</p></div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>{currency.format(a.balance)}</span>
                  {isAdmin && <button type="button" onClick={() => dispatch({ type: 'REMOVE_BANK_ACCOUNT', payload: a.id })} className="nb-btn nb-btn-sm nb-btn-danger">Remove</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demat Accounts */}
      <div className="nb-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">Demat Accounts</h2>
          {isAdmin && <button type="button" onClick={() => setShowDematForm(!showDematForm)} className="nb-btn nb-btn-sm nb-btn-primary">{showDematForm ? 'Cancel' : '+ Add'}</button>}
        </div>
        {showDematForm && (
          <div className="nb-card-flat p-4 mb-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block"><span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Broker</span><input value={dematDraft.broker} onChange={e => setDematDraft(p => ({ ...p, broker: e.target.value }))} className="nb-input" placeholder="Zerodha" /></label>
              <label className="block"><span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>DP ID</span><input value={dematDraft.dpId} onChange={e => setDematDraft(p => ({ ...p, dpId: e.target.value }))} className="nb-input" placeholder="1234567890" /></label>
              <label className="block"><span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Invested</span><input value={dematDraft.invested} onChange={e => setDematDraft(p => ({ ...p, invested: e.target.value }))} className="nb-input" placeholder="0" inputMode="decimal" /></label>
              <label className="block"><span className="text-xs font-bold uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Current Value</span><input value={dematDraft.currentValue} onChange={e => setDematDraft(p => ({ ...p, currentValue: e.target.value }))} className="nb-input" placeholder="0" inputMode="decimal" /></label>
            </div>
            <button type="button" onClick={addDemat} className="nb-btn nb-btn-primary nb-btn-sm">Add Account</button>
          </div>
        )}
        {state.dematAccounts.length === 0 ? (
          <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>No demat accounts linked.</p>
        ) : (
          <div className="space-y-3">
            {state.dematAccounts.map(d => {
              const pnl = d.currentValue - d.invested;
              const isProfit = pnl >= 0;
              return (
                <div key={d.id} className="nb-card-flat p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0"><p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{d.broker}</p><p className="text-xs" style={{ color: 'var(--text-muted)' }}>DP: {d.dpId} &middot; {d.accountType}</p></div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-extrabold" style={{ color: isProfit ? 'var(--income)' : 'var(--expense)' }}>{isProfit ? '+' : ''}{currency.format(pnl)}</span>
                    {isAdmin && <button type="button" onClick={() => dispatch({ type: 'REMOVE_DEMAT_ACCOUNT', payload: d.id })} className="nb-btn nb-btn-sm nb-btn-danger">Remove</button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
