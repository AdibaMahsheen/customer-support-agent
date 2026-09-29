import React from 'react';

export default function Sidebar({ currentView, setCurrentView, onLogout, stats }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'chat', label: 'AI Agent', icon: '🤖', badge: 'Live' },
    { id: 'customers', label: 'Customers', icon: '👥', count: stats?.total_customers },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'tickets', label: 'Support Tickets', icon: '🎫', count: stats?.pending_tickets },
    { id: 'memory', label: 'Memory (Hindsight)', icon: '🧠', badge: 'Active' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="logo-badge">
          <span style={{ fontSize: '1.2rem' }}>⚡</span>
        </div>
        <div>
          <div className="brand-title">SupportAI</div>
          <div className="brand-tag">Hack With Hyderabad 3.0</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Agent Workspace</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id)}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
            {item.count !== undefined && item.count > 0 && (
              <span className="nav-badge">{item.count}</span>
            )}
          </button>
        ))}

        <div className="nav-section-label" style={{ marginTop: 'auto' }}>Account</div>
        <button
          id="nav-logout"
          className="nav-item"
          onClick={onLogout}
          style={{ color: '#EF4444' }}
        >
          <span style={{ fontSize: '1.1rem' }}>🚪</span>
          <span>Logout</span>
        </button>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="system-status-indicator">
          <div className="pulse-dot"></div>
          <div>
            <div style={{ fontWeight: 600, color: '#F1F5F9' }}>FastAPI Backend</div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Port 8000 • Connected</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
