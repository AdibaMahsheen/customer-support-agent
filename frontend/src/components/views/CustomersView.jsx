import React from 'react';

export default function CustomersView({ customers, onSelectCustomer, onStartChat }) {
  return (
    <div className="ui-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Customer Directory</h2>
          <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
            Registered customer accounts, membership tiers, and lifetime spending
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Customer ID</th>
              <th>Tier</th>
              <th>Contact</th>
              <th>Lifetime Spend</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={c.avatar} alt={c.name} className="customer-avatar-sm" />
                    <div>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Member since {c.join_date}</div>
                    </div>
                  </div>
                </td>
                <td><code>{c.id}</code></td>
                <td>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: 12,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: c.tier.includes('Gold') ? '#FEF3C7' : (c.tier.includes('Platinum') ? '#EDE9FE' : '#F1F5F9'),
                      color: c.tier.includes('Gold') ? '#B45309' : (c.tier.includes('Platinum') ? '#6D28D9' : '#475569')
                    }}
                  >
                    {c.tier}
                  </span>
                </td>
                <td>
                  <div>{c.email}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{c.phone}</div>
                </td>
                <td style={{ fontWeight: 600 }}>₹{c.lifetime_spend?.toLocaleString()}</td>
                <td>⭐ {c.satisfaction_rating} / 5.0</td>
                <td>
                  <button
                    className="btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    onClick={() => {
                      onSelectCustomer(c.id);
                      onStartChat();
                    }}
                  >
                    Open Chat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
