import React, { useState } from 'react';
import { createTicket } from '../../api/client';

export default function TicketsView({ tickets = [], onTicketCreated, customers = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [customerId, setCustomerId] = useState('CUST1001');
  const [issueType, setIssueType] = useState('Refund');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const res = await createTicket({
        customer_id: customerId,
        issue_type: issueType,
        subject,
        description,
        priority
      });
      if (res.ticket && onTicketCreated) {
        onTicketCreated(res.ticket);
      }
      setShowModal(false);
      setSubject('');
      setDescription('');
    } catch (err) {
      alert(err.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ui-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Support Tickets & Dispute Tracking</h2>
          <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
            Operational tickets created autonomously by AI or manually dispatched
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Create Support Ticket
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Issue Type</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((tk) => {
              const isCrit = tk.priority === 'Critical' || tk.priority === 'High';
              const isResolved = tk.status?.toLowerCase() === 'resolved';

              return (
                <tr key={tk.id}>
                  <td><code>{tk.id}</code></td>
                  <td><code>{tk.customer_id}</code></td>
                  <td><strong>{tk.issue_type}</strong></td>
                  <td style={{ maxWidth: 280 }}>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{tk.subject}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tk.description}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: isCrit ? '#FEF2F2' : '#F1F5F9',
                        color: isCrit ? '#DC2626' : '#475569'
                      }}
                    >
                      {tk.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: isResolved ? '#ECFDF5' : '#FFFBEB',
                        color: isResolved ? '#059669' : '#D97706'
                      }}
                    >
                      {tk.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748B' }}>{tk.created_at}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Create New Support Ticket</h2>
              <button onClick={() => setShowModal(false)} style={{ fontSize: '1.2rem', color: '#64748B' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Customer</label>
                  <select
                    className="form-input"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Issue Type</label>
                  <select
                    className="form-input"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                  >
                    <option value="Refund">Refund / Return</option>
                    <option value="Billing">Billing Dispute / Double Charge</option>
                    <option value="Delivery">Delivery / Logistics</option>
                    <option value="Account Security">Account Security / Fraud</option>
                    <option value="Technical">Technical Support</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Short summary of issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Full case details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
