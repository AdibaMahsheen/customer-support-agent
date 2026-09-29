import React from 'react';

export default function AnalyticsView() {
  const metrics = [
    { label: 'First Contact Resolution', value: '88.4%', trend: '+4.2%' },
    { label: 'Avg AI Response Latency', value: '1.2s', trend: '-0.3s' },
    { label: 'Customer Satisfaction (CSAT)', value: '4.8 / 5.0', trend: '+0.2' },
    { label: 'Autonomous Escalation Rate', value: '7.8%', trend: 'Controlled' },
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div className="stats-grid">
        {metrics.map((m, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-content">
              <div className="stat-label">{m.label}</div>
              <div className="stat-value">{m.value}</div>
              <div className="stat-trend trend-up">🟢 {m.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Sentiment Distribution */}
        <div className="ui-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>
            <span>📊</span> Customer Sentiment Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Positive / Satisfied</span>
                <span>65%</span>
              </div>
              <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: '#10B981' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Neutral / Inquiring</span>
                <span>25%</span>
              </div>
              <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: '#3B82F6' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Frustrated / Dispute</span>
                <span>10%</span>
              </div>
              <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '10%', height: '100%', background: '#EF4444' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Issue Categories */}
        <div className="ui-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>
            <span>🎫</span> Ticket Issues Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: 8 }}>
              <span>💸 Refunds & Return SLA</span>
              <strong style={{ color: '#2563EB' }}>42%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: 8 }}>
              <span>🚚 Order Tracking & Delivery</span>
              <strong style={{ color: '#2563EB' }}>28%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: 8 }}>
              <span>💳 Billing & Double Charges</span>
              <strong style={{ color: '#2563EB' }}>18%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: 8 }}>
              <span>🔒 Account Security & Unauthorized Access</span>
              <strong style={{ color: '#DC2626' }}>12%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
