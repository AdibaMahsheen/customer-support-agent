import React from 'react';

export default function DashboardView({ stats, customers, onStartChat, onSelectCustomer }) {
  const statCards = [
    {
      id: 'total-customers',
      label: 'Total Customers',
      value: stats?.total_customers ?? 4,
      icon: '👥',
      bg: '#EEF2FF',
      color: '#4338CA',
      trend: '+12% from last month',
      trendClass: 'trend-up'
    },
    {
      id: 'active-conversations',
      label: 'Active Conversations',
      value: stats?.active_conversations ?? 3,
      icon: '💬',
      bg: '#ECFDF5',
      color: '#059669',
      trend: 'Real-time AI sessions',
      trendClass: 'trend-up'
    },
    {
      id: 'resolved-tickets',
      label: 'Resolved Tickets',
      value: stats?.resolved_tickets ?? 1,
      icon: '✅',
      bg: '#EFF6FF',
      color: '#2563EB',
      trend: 'Avg 4.2m resolution',
      trendClass: 'trend-up'
    },
    {
      id: 'pending-tickets',
      label: 'Pending Tickets',
      value: stats?.pending_tickets ?? 3,
      icon: '⏳',
      bg: '#FFFBEB',
      color: '#D97706',
      trend: 'SLA: Within 24h',
      trendClass: 'trend-warning'
    },
    {
      id: 'escalations',
      label: 'Escalations',
      value: stats?.escalations ?? 0,
      icon: '🚨',
      bg: '#FEF2F2',
      color: '#DC2626',
      trend: 'Priority human queues',
      trendClass: stats?.escalations > 0 ? 'trend-danger' : 'trend-up'
    }
  ];

  return (
    <div>
      {/* Metric Cards Grid */}
      <div className="stats-grid">
        {statCards.map((sc) => (
          <div key={sc.id} className="stat-card" id={`stat-${sc.id}`}>
            <div className="stat-icon-wrapper" style={{ background: sc.bg, color: sc.color }}>
              <span>{sc.icon}</span>
            </div>
            <div className="stat-content">
              <div className="stat-label">{sc.label}</div>
              <div className="stat-value">{sc.value}</div>
              <div className={`stat-trend ${sc.trendClass}`}>{sc.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Banner / Quick Start */}
      <div
        className="ui-card"
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #1E3A8A 50%, #0D9488 100%)',
          color: '#FFFFFF',
          marginBottom: 24,
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '65%' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '4px 10px',
              borderRadius: 20,
              display: 'inline-block',
              marginBottom: 10
            }}
          >
            ⚡ Hack With Hyderabad 3.0 Demo
          </span>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.45rem', marginBottom: 8 }}>
            Real-Time AI Customer Support with Hindsight Memory
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Empower your support operations with dynamic long-term customer context, autonomous tool calling,
            banking dispute resolutions, and automated ticket escalation.
          </p>
        </div>

        <button
          id="btn-launch-ai-agent"
          onClick={onStartChat}
          className="btn-primary"
          style={{
            background: '#FFFFFF',
            color: '#1E1B4B',
            padding: '12px 24px',
            fontSize: '0.95rem',
            fontWeight: 700,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)'
          }}
        >
          <span>🤖</span>
          <span>Open AI Support Chat</span>
        </button>
      </div>

      {/* Verified Demo Scenario Highlight */}
      <div className="ui-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
            <span>🌟</span> Target Customer Scenario: Aisha Khan (CUST1001)
          </h3>
          <span className="customer-tier-badge">Gold Tier Member</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>ACTIVE ORDER</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', marginTop: 4 }}>
              ORD1024 • ₹1,299
            </div>
            <div style={{ fontSize: '0.8rem', color: '#D97706', fontWeight: 600, marginTop: 2 }}>
              Status: Refund Pending (ARN 42998810231)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 4 }}>
              Item: Wireless Earbuds Pro (Active Noise Cancellation)
            </div>
          </div>

          <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>HINDSIGHT MEMORY LOGGED</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1E293B', marginTop: 4 }}>
              Inquired on Sept 26 about refund SLA
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 4 }}>
              Notified of standard 5-7 business days settlement window. Expected credit date: Oct 2-3.
            </div>
          </div>

          <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>SUPPORT TICKET</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', marginTop: 4 }}>
              TIK-8041 • In Progress
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 4 }}>
              Refund inquiry tracked automatically by agent.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            className="btn-primary"
            onClick={() => {
              onSelectCustomer('CUST1001');
              onStartChat();
            }}
          >
            Chat as Aisha Khan
          </button>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Try typing: <em>"Why hasn't my refund arrived?"</em>
          </span>
        </div>
      </div>

      {/* Customer Quick Directory */}
      <div className="ui-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>
          <span>👥</span> Demo Customers Ready for Testing
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {customers.map((c) => (
            <div
              key={c.id}
              style={{
                padding: 14,
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onClick={() => {
                onSelectCustomer(c.id);
                onStartChat();
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563EB'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={c.avatar} alt={c.name} className="customer-avatar-sm" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{c.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{c.id} • {c.tier}</div>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: '0.75rem', color: '#475569' }}>
                📍 {c.address.split(',')[1] || 'Hyderabad'}
              </div>
              <div style={{ marginTop: 6, fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>
                Select & Chat →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
