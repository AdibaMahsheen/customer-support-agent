/**
 * API Client for Customer Support AI Agent
 * Calls FastAPI backend running on port 8000
 */

const BASE_URL = '/api';

export async function login(email, password, rememberMe = false) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, remember_me: rememberMe })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Login failed');
  }
  return res.json();
}

export async function sendChatMessage(message, customerId = 'CUST1001', history = []) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      customer_id: customerId,
      history: history.map(h => ({ role: h.role, content: h.content }))
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Chat request failed');
  }
  return res.json();
}

export async function getCustomers() {
  const res = await fetch(`${BASE_URL}/customers`);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function getCustomer(id) {
  const res = await fetch(`${BASE_URL}/customers/${id}`);
  if (!res.ok) throw new Error('Failed to fetch customer details');
  return res.json();
}

export async function getCustomerTransactions(id) {
  const res = await fetch(`${BASE_URL}/customers/${id}/transactions`);
  if (!res.ok) throw new Error('Failed to fetch customer transactions');
  return res.json();
}

export async function getCustomerTickets(id) {
  const res = await fetch(`${BASE_URL}/customers/${id}/tickets`);
  if (!res.ok) throw new Error('Failed to fetch customer tickets');
  return res.json();
}

export async function getCustomerMemories(id) {
  const res = await fetch(`${BASE_URL}/customers/${id}/memories`);
  if (!res.ok) throw new Error('Failed to fetch customer memories');
  return res.json();
}

export async function createTicket(ticketData) {
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData)
  });
  if (!res.ok) throw new Error('Failed to create ticket');
  return res.json();
}

export async function escalateIssue(escalateData) {
  const res = await fetch(`${BASE_URL}/escalate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(escalateData)
  });
  if (!res.ok) throw new Error('Failed to escalate issue');
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function getHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error('Failed to fetch health status');
  return res.json();
}

export async function getConfig() {
  const res = await fetch(`${BASE_URL}/config`);
  if (!res.ok) throw new Error('Failed to fetch config');
  return res.json();
}

export async function updateConfig(configData) {
  const res = await fetch(`${BASE_URL}/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configData)
  });
  if (!res.ok) throw new Error('Failed to update config');
  return res.json();
}
