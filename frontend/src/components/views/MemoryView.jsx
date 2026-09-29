import React, { useState } from 'react';

export default function MemoryView({ memories = [], customers = [] }) {
  const [filterCustomer, setFilterCustomer] = useState('ALL');

  const filtered = filterCustomer === 'ALL'
    ? memories
    : memories.filter(m => m.customer_id === filterCustomer);

  return (
    <div className="ui-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🧠</span> Hindsight Long-Term Memory Ledger
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
            Customer memories retrieved and continuously updated across conversations
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Filter Customer:</span>
          <select
            className="form-input"
            style={{ width: 'auto', padding: '6px 12px' }}
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
          >
            <option value="ALL">All Customers</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.map((mem) => {
          const cust = customers.find(c => c.id === mem.customer_id);

          return (
            <div
              key={mem.id}
              style={{
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                padding: 16,
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 10,
                      background: '#EFF6FF',
                      color: '#2563EB'
                    }}
                  >
                    {mem.id}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    {mem.created_at}
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A', marginBottom: 6 }}>
                  {mem.topic}
                </div>

                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: 12 }}>
                  {mem.summary}
                </p>
              </div>

              <div
                style={{
                  paddingTop: 10,
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {cust?.avatar && <img src={cust.avatar} alt="" style={{ width: 18, height: 18, borderRadius: '50%' }} />}
                  <span style={{ fontWeight: 600 }}>{cust?.name || mem.customer_id}</span>
                </div>

                <span style={{ color: '#64748B' }}>
                  Source: <strong>{mem.source}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
