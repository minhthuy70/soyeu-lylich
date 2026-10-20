import { useState, useEffect } from 'react';
import { integrationService } from '../services/integrationService';
import './IntegrationsPage.css';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Form states for different integrations
  const [sendgridForm, setSendgridForm] = useState({ apiKey: '' });
  const [twilioForm, setTwilioForm] = useState({ accountSid: '', authToken: '' });
  const [stripeForm, setStripeForm] = useState({ apiKey: '' });
  const [s3Form, setS3Form] = useState({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    bucket: '',
  });

  const [s3Files, setS3Files] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const data = await integrationService.getAll();
      setIntegrations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectTwitter = async () => {
    try {
      const authUrl = await integrationService.getTwitterAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConnectSlack = async () => {
    try {
      const authUrl = await integrationService.getSlackAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConnectNotion = async () => {
    try {
      const authUrl = await integrationService.getNotionAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConnectGoogleCalendar = async () => {
    try {
      const authUrl = await integrationService.getGoogleCalendarAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConnectSendgrid = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await integrationService.connectSendgrid(sendgridForm.apiKey);
      setSuccess('SendGrid connected successfully!');
      setSendgridForm({ apiKey: '' });
      setShowConnectModal(false);
      loadIntegrations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConnectTwilio = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await integrationService.connectTwilio(twilioForm.accountSid, twilioForm.authToken);
      setSuccess('Twilio connected successfully!');
      setTwilioForm({ accountSid: '', authToken: '' });
      setShowConnectModal(false);
      loadIntegrations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConnectStripe = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await integrationService.connectStripe(stripeForm.apiKey);
      setSuccess('Stripe connected successfully!');
      setStripeForm({ apiKey: '' });
      setShowConnectModal(false);
      loadIntegrations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConnectS3 = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await integrationService.connectAwsS3(
        s3Form.accessKeyId,
        s3Form.secretAccessKey,
        s3Form.region,
        s3Form.bucket,
      );
      setSuccess('AWS S3 connected successfully!');
      setS3Form({ accessKeyId: '', secretAccessKey: '', region: 'us-east-1', bucket: '' });
      setShowConnectModal(false);
      loadIntegrations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDisconnect = async (id) => {
    if (!window.confirm('Are you sure you want to disconnect this integration?')) return;
    try {
      setError('');
      await integrationService.delete(id);
      setSuccess('Integration disconnected successfully!');
      loadIntegrations();
    } catch (err) {
      setError(err.message);
    }
  };

  const loadS3Files = async () => {
    try {
      const files = await integrationService.listS3Files();
      setS3Files(files);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      setError('');
      await integrationService.uploadFileToS3(file);
      setSuccess('File uploaded successfully!');
      loadS3Files();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteS3File = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      setError('');
      await integrationService.deleteS3File(id);
      setSuccess('File deleted successfully!');
      loadS3Files();
    } catch (err) {
      setError(err.message);
    }
  };

  const getProviderName = (provider) => {
    const names = {
      twitter: 'Twitter',
      slack: 'Slack',
      notion: 'Notion',
      google_calendar: 'Google Calendar',
      sendgrid: 'SendGrid',
      twilio: 'Twilio',
      stripe: 'Stripe',
      aws_s3: 'AWS S3',
    };
    return names[provider] || provider;
  };

  const isProviderConnected = (provider) => {
    return integrations.some((int) => int.provider === provider && int.isActive);
  };

  if (loading) {
    return <div className="loading">Loading integrations...</div>;
  }

  return (
    <div className="integrations-page">
      <div className="page-header">
        <h1>Integrations</h1>
        <p>Connect and manage your third-party integrations</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Available Integrations
        </button>
        <button
          className={`tab ${activeTab === 'connected' ? 'active' : ''}`}
          onClick={() => setActiveTab('connected')}
        >
          Connected ({integrations.filter((i) => i.isActive).length})
        </button>
        <button
          className={`tab ${activeTab === 's3' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('s3');
            loadS3Files();
          }}
        >
          AWS S3 Files
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="integrations-grid">
          {/* Twitter */}
          <div className="integration-card">
            <div className="integration-icon">🐦</div>
            <h3>Twitter</h3>
            <p>Connect your Twitter account for social sharing</p>
            {isProviderConnected('twitter') ? (
              <button className="btn btn-secondary" disabled>
                Connected
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleConnectTwitter}>
                Connect
              </button>
            )}
          </div>

          {/* Slack */}
          <div className="integration-card">
            <div className="integration-icon">💼</div>
            <h3>Slack</h3>
            <p>Connect Slack for team notifications</p>
            {isProviderConnected('slack') ? (
              <button className="btn btn-secondary" disabled>
                Connected
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleConnectSlack}>
                Connect
              </button>
            )}
          </div>

          {/* Notion */}
          <div className="integration-card">
            <div className="integration-icon">📝</div>
            <h3>Notion</h3>
            <p>Sync your data with Notion workspace</p>
            {isProviderConnected('notion') ? (
              <button className="btn btn-secondary" disabled>
                Connected
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleConnectNotion}>
                Connect
              </button>
            )}
          </div>

          {/* Google Calendar */}
          <div className="integration-card">
            <div className="integration-icon">📅</div>
            <h3>Google Calendar</h3>
            <p>Sync events with Google Calendar</p>
            {isProviderConnected('google_calendar') ? (
              <button className="btn btn-secondary" disabled>
                Connected
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleConnectGoogleCalendar}>
                Connect
              </button>
            )}
          </div>

          {/* SendGrid */}
          <div className="integration-card">
            <div className="integration-icon">📧</div>
            <h3>SendGrid</h3>
            <p>Send emails via SendGrid API</p>
            {isProviderConnected('sendgrid') ? (
              <button className="btn btn-secondary" disabled>
                Connected
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedProvider('sendgrid');
                  setShowConnectModal(true);
                }}
              >
                Connect
              </button>
            )}
          </div>

          {/* Twilio */}
          <div className="integration-card">
            <div className="integration-icon">📱</div>
            <h3>Twilio</h3>
            <p>Send SMS messages via Twilio</p>
            {isProviderConnected('twilio') ? (
              <button className="btn btn-secondary" disabled>
                Connected
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedProvider('twilio');
                  setShowConnectModal(true);
                }}
              >
                Connect
              </button>
            )}
          </div>

          {/* Stripe */}
          <div className="integration-card">
            <div className="integration-icon">💳</div>
            <h3>Stripe</h3>
            <p>Accept payments via Stripe</p>
            {isProviderConnected('stripe') ? (
              <button className="btn btn-secondary" disabled>
                Connected
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedProvider('stripe');
                  setShowConnectModal(true);
                }}
              >
                Connect
              </button>
            )}
          </div>

          {/* AWS S3 */}
          <div className="integration-card">
            <div className="integration-icon">☁️</div>
            <h3>AWS S3</h3>
            <p>Store files in AWS S3</p>
            {isProviderConnected('aws_s3') ? (
              <button className="btn btn-secondary" disabled>
                Connected
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedProvider('aws_s3');
                  setShowConnectModal(true);
                }}
              >
                Connect
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'connected' && (
        <div className="connected-integrations">
          {integrations.length === 0 ? (
            <p className="empty-state">No integrations connected yet</p>
          ) : (
            integrations.map((integration) => (
              <div key={integration.id} className="integration-item">
                <div className="integration-info">
                  <h3>{getProviderName(integration.provider)}</h3>
                  <p>Connected on {new Date(integration.createdAt).toLocaleDateString()}</p>
                  {integration.lastSyncedAt && (
                    <p>Last synced: {new Date(integration.lastSyncedAt).toLocaleString()}</p>
                  )}
                </div>
                <div className="integration-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDisconnect(integration.id)}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 's3' && (
        <div className="s3-files-section">
          {!isProviderConnected('aws_s3') ? (
            <p className="empty-state">AWS S3 not connected. Please connect first.</p>
          ) : (
            <>
              <div className="s3-upload">
                <h3>Upload File</h3>
                <input type="file" onChange={handleFileUpload} disabled={uploadingFile} />
                {uploadingFile && <span className="uploading">Uploading...</span>}
              </div>

              <div className="s3-files-list">
                <h3>Your Files</h3>
                {s3Files.length === 0 ? (
                  <p className="empty-state">No files uploaded yet</p>
                ) : (
                  <div className="files-grid">
                    {s3Files.map((file) => (
                      <div key={file.id} className="file-item">
                        <div className="file-info">
                          <p className="file-name">{file.fileName}</p>
                          <p className="file-size">{(file.fileSize / 1024).toFixed(2)} KB</p>
                          <p className="file-type">{file.mimeType}</p>
                        </div>
                        <div className="file-actions">
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                            View
                          </a>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteS3File(file.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="modal-overlay" onClick={() => setShowConnectModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Connect {getProviderName(selectedProvider)}</h2>
              <button className="close-btn" onClick={() => setShowConnectModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {selectedProvider === 'sendgrid' && (
                <form onSubmit={handleConnectSendgrid}>
                  <div className="form-group">
                    <label>API Key</label>
                    <input
                      type="password"
                      value={sendgridForm.apiKey}
                      onChange={(e) => setSendgridForm({ apiKey: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Connect
                  </button>
                </form>
              )}

              {selectedProvider === 'twilio' && (
                <form onSubmit={handleConnectTwilio}>
                  <div className="form-group">
                    <label>Account SID</label>
                    <input
                      type="text"
                      value={twilioForm.accountSid}
                      onChange={(e) => setTwilioForm({ ...twilioForm, accountSid: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Auth Token</label>
                    <input
                      type="password"
                      value={twilioForm.authToken}
                      onChange={(e) => setTwilioForm({ ...twilioForm, authToken: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Connect
                  </button>
                </form>
              )}

              {selectedProvider === 'stripe' && (
                <form onSubmit={handleConnectStripe}>
                  <div className="form-group">
                    <label>API Key (Secret)</label>
                    <input
                      type="password"
                      value={stripeForm.apiKey}
                      onChange={(e) => setStripeForm({ apiKey: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Connect
                  </button>
                </form>
              )}

              {selectedProvider === 'aws_s3' && (
                <form onSubmit={handleConnectS3}>
                  <div className="form-group">
                    <label>Access Key ID</label>
                    <input
                      type="text"
                      value={s3Form.accessKeyId}
                      onChange={(e) => setS3Form({ ...s3Form, accessKeyId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Secret Access Key</label>
                    <input
                      type="password"
                      value={s3Form.secretAccessKey}
                      onChange={(e) => setS3Form({ ...s3Form, secretAccessKey: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Region</label>
                    <select
                      value={s3Form.region}
                      onChange={(e) => setS3Form({ ...s3Form, region: e.target.value })}
                    >
                      <option value="us-east-1">US East (N. Virginia)</option>
                      <option value="us-west-2">US West (Oregon)</option>
                      <option value="eu-west-1">EU (Ireland)</option>
                      <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Bucket Name</label>
                    <input
                      type="text"
                      value={s3Form.bucket}
                      onChange={(e) => setS3Form({ ...s3Form, bucket: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Connect
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
