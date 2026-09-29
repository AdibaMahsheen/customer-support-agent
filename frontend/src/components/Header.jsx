import React from 'react';

export default function Header({
  currentView,
  customers,
  activeCustomerId,
  onSelectCustomer,
  health,
  onOpenConfig
}) {
  const activeCustomer = customers.find(c => c.id === activeCustomerId) || customers[0] || {
    name: 'Aisha Khan',
    tier: 'Gold Member',
    id: 'CUST1001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

  const viewTitles = {
    dashboard: 'Operations Dashboard',
    chat: 'Customer Support AI Agent',
    customers: 'Customer Directory',
    transactions: 'Transaction & Order Ledger',
    tickets: 'Support Tickets & Disputes',
    memory: 'Hindsight Customer Memory Store',
    analytics: 'Performance & Sentiment Analytics',
    settings: 'API & Model Configurations'
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <h1 className="view-title" id="page-title">
          {viewTitles[currentView] || 'Customer Support'}
        </h1>
        <span className="status-chip online">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}></span>
          System Live
        </span>
      </div>

      <div className="header-right">
        {/* Customer Selector */}
        <div className="customer-selector-pill" title="Select active customer for context">
          <img
            src={activeCustomer.avatar}
            alt={activeCustomer.name}
            className="customer-avatar-sm"
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
              {activeCustomer.name}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
              {activeCustomer.tier} • {activeCustomer.id}
            </span>
          </div>

          <select
            id="customer-select-dropdown"
            value={activeCustomerId}
            onChange={(e) => onSelectCustomer(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              color: '#2563EB',
              cursor: 'pointer',
              marginLeft: 4
            }}
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id})
              </option>
            ))}
          </select>
        </div>

        {/* AI & Memory Status Pill */}
        <button
          id="btn-open-settings"
          onClick={onOpenConfig}
          className="btn-outline"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          title="Configure OpenAI and Hindsight API Keys"
        >
          <span>🔑</span>
          <span>
            {health?.openai_connected ? 'OpenAI Active' : 'API Keys'}
          </span>
        </button>
      </div>
    </header>
  );
}
