import React, { useState, useRef, useEffect } from 'react';
import ContextPanel from '../ContextPanel';
import { sendChatMessage } from '../../api/client';

export default function ChatView({
  activeCustomer,
  memories,
  transactions,
  tickets,
  onTicketCreated,
  onEscalation
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello ${activeCustomer?.name || 'there'}! 👋 Welcome to customer support. I have full access to your account details, recent orders, and Hindsight support memory. How can I help you today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      context_used: ['Customer Profile', 'Hindsight Memory']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastContextUsed, setLastContextUsed] = useState(['Hindsight Memory', 'Customer Profile']);
  const [customerSentiment, setCustomerSentiment] = useState('Neutral');
  const [toolsExecuted, setToolsExecuted] = useState([]);
  const [notification, setNotification] = useState(null);

  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "Why hasn't my refund arrived?",
    "Where is my order?",
    "What did I contact support about before?",
    "I was charged twice.",
    "I think someone used my account.",
    "Show my recent transactions"
  ];

  const quickActions = [
    { label: "Track Order", query: "Where is my order?" },
    { label: "Check Refund", query: "Why hasn't my refund arrived?" },
    { label: "Transactions", query: "Show my recent transactions" },
    { label: "Human Support", query: "I need to speak to a human support agent." }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // When active customer changes, refresh initial welcome
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${activeCustomer?.id || 'new'}`,
        role: 'assistant',
        content: `Hello ${activeCustomer?.name || 'Customer'}! 👋 I have identified your account (${activeCustomer?.tier || 'Member'}, ID: ${activeCustomer?.id}). How can I assist you with your orders or transactions today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        context_used: ['Customer Profile', 'Hindsight Memory']
      }
    ]);
    setCustomerSentiment('Neutral');
    setToolsExecuted([]);
  }, [activeCustomer?.id]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSend(textToSend) {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendChatMessage(
        text,
        activeCustomer?.id || 'CUST1001',
        messages
      );

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        context_used: data.context_used,
        tools_executed: data.tools_executed,
        ticket_created: data.ticket_created,
        escalated: data.escalated,
        warning: data.warning
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (data.context_used) setLastContextUsed(data.context_used);
      if (data.sentiment) setCustomerSentiment(data.sentiment);
      if (data.tools_executed) setToolsExecuted(data.tools_executed);

      if (data.ticket_created && onTicketCreated) {
        onTicketCreated(data.ticket_created);
      }
      if (data.escalated && onEscalation) {
        onEscalation();
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Communication error: ${err.message}. Please verify the FastAPI backend is running on port 8000.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleClearChat() {
    setMessages([
      {
        id: `welcome-cleared`,
        role: 'assistant',
        content: `Chat cleared. Hello ${activeCustomer?.name}! How can I help you today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        context_used: ['Customer Profile']
      }
    ]);
  }

  function copyText(text) {
    navigator.clipboard?.writeText(text);
    setNotification('Copied response to clipboard!');
    setTimeout(() => setNotification(null), 2000);
  }

  return (
    <div className="chat-view-layout">
      {/* Main Chat Box */}
      <div className="chat-card">
        {/* Chat Header */}
        <div className="chat-header-bar">
          <div className="chat-agent-info">
            <div className="agent-avatar">
              <span style={{ fontSize: '1.2rem' }}>🤖</span>
            </div>
            <div>
              <div className="agent-title">AI Customer Support Agent</div>
              <div className="agent-subtitle">
                Context-Aware • Hindsight Long-Term Memory • Multi-Tool Reasoning
              </div>
            </div>
          </div>

          <div className="chat-header-actions">
            {notification && (
              <span style={{ fontSize: '0.78rem', color: '#059669', background: '#ECFDF5', padding: '4px 8px', borderRadius: 6 }}>
                {notification}
              </span>
            )}
            <button
              id="btn-clear-chat"
              className="btn-outline"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              onClick={handleClearChat}
              title="Reset conversation turns"
            >
              🗑️ Clear Chat
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="chat-messages-container" id="chat-messages-list">
          {messages.map((m) => (
            <div key={m.id} className={`chat-message-row ${m.role}`}>
              <div className="message-avatar">
                {m.role === 'user' ? (
                  <div className="user-avatar-circle">
                    {activeCustomer?.name?.charAt(0) || 'U'}
                  </div>
                ) : (
                  <div className="assistant-avatar-circle">⚡</div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="message-bubble">
                  {/* Formatted Message Content */}
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {m.content}
                  </div>

                  {/* High-priority Ticket Created Card */}
                  {m.ticket_created && (
                    <div
                      style={{
                        marginTop: 12,
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#1E40AF', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>🎫</span> Support Ticket Created: {m.ticket_created.id}
                      </div>
                      <div style={{ color: '#1E293B', marginTop: 2 }}>
                        <strong>{m.ticket_created.subject}</strong>
                      </div>
                      <div style={{ color: '#475569', fontSize: '0.75rem', marginTop: 2 }}>
                        Priority: {m.ticket_created.priority} • Status: {m.ticket_created.status}
                      </div>
                    </div>
                  )}

                  {/* Escalation Alert */}
                  {m.escalated && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        fontSize: '0.8rem',
                        color: '#991B1B',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <span>🚨</span>
                      <span><strong>Human Escalation Triggered</strong>: Handed off to Senior Fraud/Support Desk.</span>
                    </div>
                  )}

                  {/* Assistant Actions */}
                  {m.role === 'assistant' && (
                    <div className="message-actions">
                      <button
                        className="action-icon-sm"
                        onClick={() => copyText(m.content)}
                        title="Copy message"
                      >
                        📋 Copy
                      </button>
                      <button
                        className="action-icon-sm"
                        onClick={() => {
                          setNotification('Thank you for your feedback! 👍');
                          setTimeout(() => setNotification(null), 2000);
                        }}
                        title="Helpful response"
                      >
                        👍 Helpful
                      </button>
                      <button
                        className="action-icon-sm"
                        onClick={() => {
                          setNotification('Feedback logged for agent refinement! 👎');
                          setTimeout(() => setNotification(null), 2000);
                        }}
                        title="Needs improvement"
                      >
                        👎 Needs Improvement
                      </button>
                    </div>
                  )}
                </div>
                <div className="message-time">{m.time}</div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="chat-message-row assistant">
              <div className="message-avatar">
                <div className="assistant-avatar-circle">⚡</div>
              </div>
              <div className="typing-bubble">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions Bar */}
        <div className="quick-actions-bar">
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', alignSelf: 'center', marginRight: 4 }}>
            Quick Actions:
          </span>
          {quickActions.map((qa, idx) => (
            <button
              key={idx}
              className="quick-action-btn"
              onClick={() => handleSend(qa.query)}
              disabled={loading}
            >
              <span>⚡</span> {qa.label}
            </button>
          ))}
        </div>

        {/* Suggested Questions Chips Bar */}
        <div className="suggested-chips-bar" id="suggested-questions-bar">
          <span className="suggested-label">Suggested:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              id={`suggested-q-${idx}`}
              className="chip-btn"
              onClick={() => handleSend(q)}
              disabled={loading}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          className="chat-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            id="chat-input"
            type="text"
            className="chat-input-field"
            placeholder={`Ask anything as ${activeCustomer?.name || 'customer'} (e.g. "Why hasn't my refund arrived?")...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            id="btn-send-chat"
            type="submit"
            className="send-btn"
            disabled={!input.trim() || loading}
            title="Send Message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>

      {/* Right-Hand Context Panel */}
      <ContextPanel
        activeCustomer={activeCustomer}
        lastContextUsed={lastContextUsed}
        customerSentiment={customerSentiment}
        memories={memories}
        transactions={transactions}
        tickets={tickets}
        toolsExecuted={toolsExecuted}
      />
    </div>
  );
}
