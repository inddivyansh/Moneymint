'use client';

import { useDashboard, type UserRole } from '@/lib/dashboard-store';

export default function RoleSwitcher() {
  const { state, dispatch } = useDashboard();

  const roles: UserRole[] = ['viewer', 'admin'];

  return (
    <div className="nb-segment self-start sm:self-auto">
      {roles.map((role) => (
        <button
          key={role}
          type="button"
          onClick={() => dispatch({ type: 'SET_ROLE', payload: role })}
          className={`nb-segment-btn ${state.role === role ? 'nb-segment-btn-active' : ''}`}
        >
          {role === 'admin' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          )}
          {role}
        </button>
      ))}
    </div>
  );
}
