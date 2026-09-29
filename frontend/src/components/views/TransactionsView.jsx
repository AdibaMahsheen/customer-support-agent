import React from 'react';

export default function TransactionsView({ transactions = [] }) {
  return (
    <div className="ui-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Transactions & Orders Ledger</h2>
          <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
            Live payment gateway transactions, debit logs, and refund settlement tracking
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Payment Method</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => {
              const isRefund = t.type.toLowerCase().includes('refund');
              const isDuplicate = t.status.toLowerCase().includes('duplicate') || t.status.toLowerCase().includes('flagged');

              return (
                <tr key={t.id}>
                  <td><code>{t.id}</code></td>
                  <td><strong>{t.order_id}</strong></td>
                  <td><code>{t.customer_id}</code></td>
                  <td style={{ fontWeight: 700, color: isRefund ? '#059669' : '#0F172A' }}>
                    {isRefund ? '+ ' : ''}₹{t.amount?.toLocaleString()}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: isRefund ? '#ECFDF5' : '#F1F5F9',
                        color: isRefund ? '#065F46' : '#334155'
                      }}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: isDuplicate ? '#FEF2F2' : (t.status.includes('Pending') ? '#FFFBEB' : '#ECFDF5'),
                        color: isDuplicate ? '#DC2626' : (t.status.includes('Pending') ? '#B45309' : '#059669')
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{t.payment_method}</td>
                  <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{t.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
