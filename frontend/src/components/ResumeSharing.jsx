import React, { useState, useEffect } from 'react';
import './ResumeSharing.css';

export function ResumeSharing({ resumeId, userId }) {
  const [publicUrl, setPublicUrl] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [customSlug, setCustomSlug] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [recipients, setRecipients] = useState('');
  const [message, setMessage] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('public');

  useEffect(() => {
    loadAnalytics();
  }, [resumeId]);

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/resume-export/${resumeId}/analytics?period=month`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleGeneratePublicUrl = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/resume-export/${resumeId}/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customSlug: customSlug || undefined }),
      });
      const data = await response.json();
      setPublicUrl(data.publicUrl);
      setIsPublic(true);
      setCustomSlug('');
    } catch (error) {
      console.error('Failed to generate public URL:', error);
      alert('Failed to generate public URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDisablePublic = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`/resume-export/${resumeId}/public`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setPublicUrl(null);
      setIsPublic(false);
      setQrCode(null);
    } catch (error) {
      console.error('Failed to disable public access:', error);
      alert('Failed to disable public access');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQrCode = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/resume-export/${resumeId}/qrcode`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setQrCode(data);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      alert('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleShareViaEmail = async () => {
    if (!recipients.trim()) {
      alert('Please enter at least one recipient email');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const recipientList = recipients.split(',').map((r) => r.trim());
      await fetch(`/resume-export/${resumeId}/share-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipients: recipientList,
          message: message || undefined,
        }),
      });
      alert('Resume shared successfully!');
      setRecipients('');
      setMessage('');
    } catch (error) {
      console.error('Failed to share via email:', error);
      alert('Failed to share via email');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="resume-sharing">
      <h3>Share Resume</h3>

      <div className="sharing-tabs">
        <button
          className={`tab-btn ${activeTab === 'public' ? 'active' : ''}`}
          onClick={() => setActiveTab('public')}
        >
          Public URL
        </button>
        <button
          className={`tab-btn ${activeTab === 'qrcode' ? 'active' : ''}`}
          onClick={() => setActiveTab('qrcode')}
        >
          QR Code
        </button>
        <button
          className={`tab-btn ${activeTab === 'email' ? 'active' : ''}`}
          onClick={() => setActiveTab('email')}
        >
          Email
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'public' && (
        <div className="sharing-panel">
          {!isPublic ? (
            <>
              <div className="input-group">
                <label>Custom Slug (optional):</label>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="my-resume"
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={handleGeneratePublicUrl}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Public URL'}
              </button>
            </>
          ) : (
            <>
              <div className="public-url-display">
                <label>Public URL:</label>
                <div className="url-input-group">
                  <input
                    type="text"
                    value={publicUrl}
                    readOnly
                  />
                  <button
                    className="btn btn-secondary"
                    onClick={() => copyToClipboard(publicUrl)}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <button
                className="btn btn-danger"
                onClick={handleDisablePublic}
                disabled={loading}
              >
                {loading ? 'Disabling...' : 'Disable Public Access'}
              </button>
            </>
          )}
        </div>
      )}

      {activeTab === 'qrcode' && (
        <div className="sharing-panel">
          {!isPublic ? (
            <p className="info-text">Please generate a public URL first to create a QR code.</p>
          ) : !qrCode ? (
            <button
              className="btn btn-primary"
              onClick={handleGenerateQrCode}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate QR Code'}
            </button>
          ) : (
            <div className="qr-code-display">
              <div className="qr-code-placeholder">
                <div className="qr-code-icon">📱</div>
                <p>QR Code for: {qrCode.publicUrl}</p>
                <p className="info-text">(Mock - requires qrcode library)</p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => copyToClipboard(qrCode.publicUrl)}
              >
                Copy URL
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'email' && (
        <div className="sharing-panel">
          <div className="input-group">
            <label>Recipients (comma-separated):</label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
            />
          </div>
          <div className="input-group">
            <label>Message (optional):</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Check out my resume!"
              rows={3}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleShareViaEmail}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Share via Email'}
          </button>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="sharing-panel">
          {analytics ? (
            <div className="analytics-display">
              <div className="analytics-item">
                <label>Total Views:</label>
                <span className="analytics-value">{analytics.totalViews}</span>
              </div>
              <div className="analytics-item">
                <label>Unique Visitors:</label>
                <span className="analytics-value">{analytics.uniqueVisitors}</span>
              </div>
              <div className="analytics-item">
                <label>Period:</label>
                <span className="analytics-value">{analytics.period}</span>
              </div>
              <div className="analytics-item">
                <label>Top Referrers:</label>
                <div className="referrers-list">
                  {Object.entries(analytics.referrers || {}).map(([referrer, count]) => (
                    <div key={referrer} className="referrer-item">
                      <span>{referrer}</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="info-text">Loading analytics...</p>
          )}
        </div>
      )}
    </div>
  );
}
