import React, { useState, useEffect } from 'react';
import { getConfig, updateConfig, getHealth } from '../api/client';

export default function ConfigModal({ isOpen, onClose, onConfigSaved }) {
  const [openaiKey, setOpenaiKey] = useState('');
  const [hindsightKey, setHindsightKey] = useState('');
  const [hindsightUrl, setHindsightUrl] = useState('https://api.hindsight.vectorize.io');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [currentConfig, setCurrentConfig] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  async function loadConfig() {
    try {
      const cfg = await getConfig();
      setCurrentConfig(cfg);
      if (cfg.hindsight_base_url) {
        setHindsightUrl(cfg.hindsight_base_url);
      }
    } catch (err) {
      console.error('Failed to load config:', err);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const payload = {};
      if (openaiKey.trim()) payload.openai_api_key = openaiKey.trim();
      if (hindsightKey.trim()) payload.hindsight_api_key = hindsightKey.trim();
      if (hindsightUrl.trim()) payload.hindsight_base_url = hindsightUrl.trim();

      await updateConfig(payload);
      const health = await getHealth();
      setStatusMsg({
        type: 'success',
        text: 'Configuration saved! Backend .env updated successfully.'
      });
      if (onConfigSaved) onConfigSaved(health);
      setOpenaiKey('');
      setHindsightKey('');
      loadConfig();
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to update configuration.'
      });
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚙️</span> API & Model Configuration
          </h2>
          <button onClick={onClose} style={{ fontSize: '1.2rem', color: '#64748B' }}>✕</button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: 16 }}>
              Configure your live <strong>OpenAI API Key</strong> and <strong>Hindsight API Key</strong>.
              Keys are securely stored in the backend <code>.env</code> and never exposed to clients.
            </p>

            {statusMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: '0.84rem',
                  marginBottom: 16,
                  background: statusMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                  color: statusMsg.type === 'success' ? '#065F46' : '#991B1B',
                  border: `1px solid ${statusMsg.type === 'success' ? '#A7F3D0' : '#FECACA'}`
                }}
              >
                {statusMsg.text}
              </div>
            )}

            {/* Current Status Pills */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
              <div
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: currentConfig?.openai_configured ? '#ECFDF5' : '#FFFBEB',
                  border: `1px solid ${currentConfig?.openai_configured ? '#A7F3D0' : '#FDE68A'}`,
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ fontWeight: 600 }}>OpenAI GPT-4o</div>
                <div>{currentConfig?.openai_configured ? '✅ Key Configured' : '⚠️ No Key Provided'}</div>
              </div>

              <div
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: currentConfig?.hindsight_configured ? '#ECFDF5' : '#FFFBEB',
                  border: `1px solid ${currentConfig?.hindsight_configured ? '#A7F3D0' : '#FDE68A'}`,
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ fontWeight: 600 }}>Hindsight Memory</div>
                <div>{currentConfig?.hindsight_configured ? '✅ Key Configured' : '⚠️ No Key Provided'}</div>
              </div>
            </div>

            {/* OpenAI API Key Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="input-openai-key">
                OpenAI API Key
              </label>
              <input
                id="input-openai-key"
                type="password"
                className="form-input"
                placeholder={currentConfig?.openai_key_preview || "sk-proj-..."}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                autoComplete="off"
              />
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Used for GPT-4o tool-calling agent.
              </span>
            </div>

            {/* Hindsight API Key Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="input-hindsight-key">
                Hindsight API Key
              </label>
              <input
                id="input-hindsight-key"
                type="password"
                className="form-input"
                placeholder={currentConfig?.hindsight_key_preview || "hs_key_..."}
                value={hindsightKey}
                onChange={(e) => setHindsightKey(e.target.value)}
                autoComplete="off"
              />
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Used for long-term customer memory storage and retrieval.
              </span>
            </div>

            {/* Hindsight Base URL Input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="input-hindsight-url">
                Hindsight Base URL
              </label>
              <input
                id="input-hindsight-url"
                type="text"
                className="form-input"
                placeholder="https://api.hindsight.vectorize.io"
                value={hindsightUrl}
                onChange={(e) => setHindsightUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>
              Close
            </button>
            <button
              id="btn-save-config"
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save & Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
