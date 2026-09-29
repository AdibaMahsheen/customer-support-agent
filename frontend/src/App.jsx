import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ConfigModal from './components/ConfigModal';

import LoginView from './components/views/LoginView';
import DashboardView from './components/views/DashboardView';
import ChatView from './components/views/ChatView';
import CustomersView from './components/views/CustomersView';
import TransactionsView from './components/views/TransactionsView';
import TicketsView from './components/views/TicketsView';
import MemoryView from './components/views/MemoryView';
import AnalyticsView from './components/views/AnalyticsView';
import SettingsView from './components/views/SettingsView';

import {
  getCustomers,
  getCustomerTransactions,
  getCustomerTickets,
  getCustomerMemories,
  getStats,
  getHealth
} from './api/client';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Demo defaults to authenticated, can toggle logout
  const [currentUser, setCurrentUser] = useState({ name: 'Support Admin', email: 'agent@support.ai' });
  const [currentView, setCurrentView] = useState('chat'); // Open straight in chat or dashboard
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [activeCustomerId, setActiveCustomerId] = useState('CUST1001'); // Aisha Khan default
  const [transactions, setTransactions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [memories, setMemories] = useState([]);
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeCustomerId) {
      loadCustomerDetails(activeCustomerId);
    }
  }, [activeCustomerId]);

  async function loadInitialData() {
    try {
      const [custs, st, hl] = await Promise.all([
        getCustomers().catch(() => []),
        getStats().catch(() => null),
        getHealth().catch(() => null)
      ]);
      setCustomers(custs);
      setStats(st);
      setHealth(hl);

      if (custs.length > 0) {
        loadCustomerDetails(custs[0].id);
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  }

  async function loadCustomerDetails(custId) {
    try {
      const [txns, tks, mems] = await Promise.all([
        getCustomerTransactions(custId).catch(() => []),
        getCustomerTickets(custId).catch(() => []),
        getCustomerMemories(custId).catch(() => [])
      ]);
      setTransactions(txns);
      setTickets(tks);
      setMemories(mems);
    } catch (err) {
      console.error('Error loading customer details:', err);
    }
  }

  function handleTicketCreated(newTicket) {
    setTickets((prev) => [newTicket, ...prev]);
    setStats((prev) => prev ? { ...prev, pending_tickets: prev.pending_tickets + 1 } : prev);
  }

  function handleEscalation() {
    setStats((prev) => prev ? { ...prev, escalations: (prev.escalations || 0) + 1 } : prev);
  }

  const activeCustomer = customers.find(c => c.id === activeCustomerId) || customers[0] || {
    id: 'CUST1001',
    name: 'Aisha Khan',
    tier: 'Gold Member',
    email: 'aisha.khan@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    address: '402, Lotus Enclave, Banjara Hills, Hyderabad, Telangana 500034',
    lifetime_spend: 28450
  };

  if (!isAuthenticated) {
    return (
      <LoginView
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={() => setIsAuthenticated(false)}
        stats={stats}
      />

      {/* Main Area */}
      <div className="main-wrapper">
        <Header
          currentView={currentView}
          customers={customers}
          activeCustomerId={activeCustomerId}
          onSelectCustomer={setActiveCustomerId}
          health={health}
          onOpenConfig={() => setIsConfigModalOpen(true)}
        />

        <main className="content-body">
          {currentView === 'dashboard' && (
            <DashboardView
              stats={stats}
              customers={customers}
              onStartChat={() => setCurrentView('chat')}
              onSelectCustomer={(id) => {
                setActiveCustomerId(id);
                setCurrentView('chat');
              }}
            />
          )}

          {currentView === 'chat' && (
            <ChatView
              activeCustomer={activeCustomer}
              memories={memories}
              transactions={transactions}
              tickets={tickets}
              onTicketCreated={handleTicketCreated}
              onEscalation={handleEscalation}
            />
          )}

          {currentView === 'customers' && (
            <CustomersView
              customers={customers}
              onSelectCustomer={setActiveCustomerId}
              onStartChat={() => setCurrentView('chat')}
            />
          )}

          {currentView === 'transactions' && (
            <TransactionsView transactions={transactions} />
          )}

          {currentView === 'tickets' && (
            <TicketsView
              tickets={tickets}
              customers={customers}
              onTicketCreated={handleTicketCreated}
            />
          )}

          {currentView === 'memory' && (
            <MemoryView
              memories={memories}
              customers={customers}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView />
          )}

          {currentView === 'settings' && (
            <SettingsView
              onHealthUpdated={(h) => setHealth(h)}
            />
          )}
        </main>
      </div>

      {/* API Key Modal */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onConfigSaved={(h) => setHealth(h)}
      />
    </div>
  );
}
