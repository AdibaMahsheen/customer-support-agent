import React from 'react';
import SentimentBadge from './SentimentBadge';

export default function ContextPanel({
  activeCustomer,
  lastContextUsed = [],
  customerSentiment = 'Neutral',
  memories = [],
  transactions = [],
  tickets = [],
  toolsExecuted = []
}) {
  const defaultContexts = [
    { id: 'Hindsight Memory', label: 'Hindsight Memory', icon: '🧠' },
    { id: 'Previous Conversation', label: 'Previous Conversation', icon: '💬' },
    { id: 'Customer Profile', label: 'Customer Profile', icon: '👤' },
    { id: 'Transaction History', label: 'Transaction History', icon: '💳' },
  ];

  return (
    <aside className="context-panel" id="customer-context-panel">
      <div className="context-header">
        <h2 className="context-title">
          <span>🎯</span> Customer Context
        </h2>
        <SentimentBadge sentiment={customerSentiment} />
      </div>

      {/* Customer Profile Card */}
      {activeCustomer && (
        <div className="context-section">
          <div className="context-section-title">
            <span>👤</span> Verified Customer
          </div>
          <div className="customer-mini-card">
            <img
              src={activeCustomer.avatar}
              alt={activeCustomer.name}
              className="customer-avatar-md"
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>
                {activeCustomer.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                ID: <strong>{activeCustomer.id}</strong>
              </div>
              <span className="customer-tier-badge">{activeCustomer.tier}</span>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>📧 {activeCustomer.email}</div>
            <div>📱 {activeCustomer.phone}</div>
            <div>💰 Lifetime Spend: <strong>₹{activeCustomer.lifetime_spend?.toLocaleString() || '0'}</strong></div>
          </div>
        </div>
      )}

      {/* Context Used Section */}
      <div className="context-section">
        <div className="context-section-title">
          <span>🔍</span> Context Used By Agent
        </div>
        <div className="context-checklist" id="context-used-checklist">
          {defaultContexts.map((ctx) => {
            const isUsed = lastContextUsed.length > 0
              ? lastContextUsed.some(u => u.toLowerCase().includes(ctx.id.toLowerCase()))
              : true;
            return (
              <div
                key={ctx.id}
                className={`context-item-badge ${isUsed ? 'active' : ''}`}
                id={`context-item-${ctx.id.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="check-icon">{isUsed ? '✓' : '○'}</span>
                <span>{ctx.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Tools Executed This Turn */}
      {toolsExecuted.length > 0 && (
        <div className="context-section">
          <div className="context-section-title">
            <span>⚡</span> Tools Executed
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {toolsExecuted.map((tool, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: '#EEF2FF',
                  color: '#4338CA',
                  fontWeight: 600,
                  border: '1px solid #C7D2FE'
                }}
              >
                ⚙️ {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hindsight Memory Snippets */}
      <div className="context-section">
        <div className="context-section-title">
          <span>🧠</span> Hindsight Long-Term Memory
        </div>
        {memories.length === 0 ? (
          <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic' }}>
            No prior memories logged for this customer.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {memories.slice(0, 3).map((mem) => (
              <div
                key={mem.id}
                style={{
                  padding: '8px 10px',
                  background: '#F8FAFC',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: 2 }}>
                  {mem.topic}
                </div>
                <div style={{ color: '#475569', lineHeight: 1.4 }}>
                  {mem.summary}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
