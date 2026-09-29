import React, { useState, useEffect } from 'react';
import { getConfig, updateConfig, getHealth } from '../../api/client';

export default function SettingsView({ onHealthUpdated }) {
  const [openaiKey, setOpenaiKey] = useState('');
  const [hindsightKey, setHindsightKey] = useState('');
  const [hindsightUrl, setHindsightUrl] = useState('https://api.hindsight.vectorize.io');
  const [loading, setLoading] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const cfg = await getConfig();
      setCurrentConfig(cfg);
      if (cfg.hindsight_base_url) setHindsightUrl(cfg.hindsight_base_url);
    } catch (err) {
      console.error('Config fetch failed:', err);
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
        text: 'Configuration saved! Keys updated in backend/.env successfully.'
      });
      if (onHealthUpdated) onHealthUpdated(health);
      setOpenaiKey('');
      setHindsightKey('');
      fetchConfig();
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to update keys'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="ui-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>
          <span>⚙️</span> API & Model Configuration
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 24 }}>
          Enter your live <strong>OpenAI API Key</strong> and <strong>Hindsight API Key</strong>.
          Keys are stored securely in <code>backend/.env</code> on the server and are never exposed to the frontend browser.
        </p>

        {statusMsg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: '0.86rem',
              marginBottom: 20,
              background: statusMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
              color: statusMsg.type === 'success' ? '#065F46' : '#991B1B',
              border: `1px solid ${statusMsg.type === 'success' ? '#A7F3D0' : '#FECACA'}`
            }}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Live Service Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div
            style={{
              padding: 16,
              borderRadius: 10,
              background: currentConfig?.openai_configured ? '#ECFDF5' : '#FFFBEB',
              border: `1px solid ${currentConfig?.openai_configured ? '#A7F3D0' : '#FDE68A'}`
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>OPENAI AGENT STATUS</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: currentConfig?.openai_configured ? '#059669' : '#D97706', marginTop: 4 }}>
              {currentConfig?.openai_configured ? '✅ Connected (GPT-4o)' : '⚠️ Not Configured'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 4 }}>
              Key: <code>{currentConfig?.openai_key_preview || 'None'}</code>
            </div>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 10,
              background: currentConfig?.hindsight_configured ? '#ECFDF5' : '#FFFBEB',
              border: `1px solid ${currentConfig?.hindsight_configured ? '#A7F3D0' : '#FDE68A'}`
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>HINDSIGHT MEMORY STATUS</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: currentConfig?.hindsight_configured ? '#059669' : '#D97706', marginTop: 4 }}>
              {currentConfig?.hindsight_configured ? '✅ Connected' : '⚠️ Not Configured'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 4 }}>
              Key: <code>{currentConfig?.hindsight_key_preview || 'None'}</code>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label" htmlFor="settings-openai-key">
              OpenAI API Key (OPENAI_API_KEY)
            </label>
            <input
              id="settings-openai-key"
              type="password"
              className="form-input"
              placeholder={currentConfig?.openai_key_preview || "sk-proj-..."}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              autoComplete="off"
            />
            <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
              Used to generate real OpenAI responses with autonomous tool calling.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="settings-hindsight-key">
              Hindsight API Key (HINDSIGHT_API_KEY)
            </label>
            <input
              id="settings-hindsight-key"
              type="password"
              className="form-input"
              placeholder={currentConfig?.hindsight_key_preview || "hs_..."}
              value={hindsightKey}
              onChange={(e) => setHindsightKey(e.target.value)}
              autoComplete="off"
            />
            <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
              Used for long-term customer memory storage and retrieval.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="settings-hindsight-url">
              Hindsight Base URL (HINDSIGHT_BASE_URL)
            </label>
            <input
              id="settings-hindsight-url"
              type="text"
              className="form-input"
              placeholder="https://api.hindsight.vectorize.io"
              value={hindsightUrl}
              onChange={(e) => setHindsightUrl(e.target.value)}
            />
          </div>

          <button
            id="btn-save-settings"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: 10 }}
          >
            {loading ? 'Saving & Testing...' : 'Save & Test Connection'}
          </button>
        </form>
      </div>
    </div>
  );
}
