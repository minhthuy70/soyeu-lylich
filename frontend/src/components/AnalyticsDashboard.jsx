import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import './AnalyticsDashboard.css';

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [behaviorData, setBehaviorData] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [retentionData, setRetentionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Date range filter
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Funnel data
  const [funnelName, setFunnelName] = useState('');
  const [funnelSteps, setFunnelSteps] = useState('');
  const [funnelAnalytics, setFunnelAnalytics] = useState(null);

  // A/B Test data
  const [abTestName, setAbTestName] = useState('');
  const [abTestDesc, setAbTestDesc] = useState('');
  const [abVariantA, setAbVariantA] = useState('');
  const [abVariantB, setAbVariantB] = useState('');
  const [abTestResults, setAbTestResults] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [startDate, endDate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await analyticsService.getDashboardAnalytics(startDate, endDate);
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBehaviorData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await analyticsService.getBehaviorAnalytics(startDate, endDate);
      setBehaviorData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await analyticsService.getSessionAnalytics(100);
      setSessionData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRetentionData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await analyticsService.getRetentionMetrics();
      setRetentionData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFunnel = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const steps = funnelSteps.split('\n').map((s) => ({ name: s.trim() }));
      await analyticsService.createFunnel(funnelName, steps);
      setSuccess('Funnel created successfully!');
      setFunnelName('');
      setFunnelSteps('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLoadFunnelAnalytics = async () => {
    try {
      setError('');
      const data = await analyticsService.getFunnelAnalytics(funnelName);
      setFunnelAnalytics(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateABTest = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await analyticsService.createABTest(abTestName, abTestDesc, abVariantA, abVariantB, 50);
      setSuccess('A/B test created successfully!');
      setAbTestName('');
      setAbTestDesc('');
      setAbVariantA('');
      setAbVariantB('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLoadABTestResults = async () => {
    try {
      setError('');
      const data = await analyticsService.getABTestResults(abTestName);
      setAbTestResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const setSuccess = (msg) => {
    setTimeout(() => {
      // Could add toast notification here
      console.log(msg);
    }, 3000);
  };

  if (loading && !dashboardData) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="page-header">
        <h1>Advanced Analytics</h1>
        <p>Track user behavior, sessions, funnels, and more</p>
      </div>

      <div className="date-filter">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={loadDashboardData}>Apply Filter</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'behavior' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('behavior');
            loadBehaviorData();
          }}
        >
          User Behavior
        </button>
        <button
          className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('sessions');
            loadSessionData();
          }}
        >
          Sessions
        </button>
        <button
          className={`tab ${activeTab === 'funnel' ? 'active' : ''}`}
          onClick={() => setActiveTab('funnel')}
        >
          Funnel Analysis
        </button>
        <button
          className={`tab ${activeTab === 'abtest' ? 'active' : ''}`}
          onClick={() => setActiveTab('abtest')}
        >
          A/B Testing
        </button>
        <button
          className={`tab ${activeTab === 'retention' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('retention');
            loadRetentionData();
          }}
        >
          Retention
        </button>
      </div>

      {activeTab === 'overview' && dashboardData && (
        <div className="overview-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Events</h3>
              <p className="stat-value">{dashboardData.behavior?.totalEvents || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Sessions</h3>
              <p className="stat-value">{dashboardData.sessions?.totalSessions || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Avg Session Duration</h3>
              <p className="stat-value">{Math.round(dashboardData.sessions?.averageDuration || 0)}s</p>
            </div>
            <div className="stat-card">
              <h3>Bounce Rate</h3>
              <p className="stat-value">{dashboardData.sessions?.bounceRate || 0}%</p>
            </div>
          </div>

          <div className="event-types">
            <h3>Event Types Distribution</h3>
            <div className="event-types-grid">
              {Object.entries(dashboardData.behavior?.eventTypeCounts || {}).map(([type, count]) => (
                <div key={type} className="event-type-item">
                  <span className="event-type">{type}</span>
                  <span className="event-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="top-pages">
            <h3>Top Pages</h3>
            <div className="pages-list">
              {dashboardData.behavior?.topPages?.slice(0, 5).map((page, index) => (
                <div key={index} className="page-item">
                  <span className="page-name">{page.page || 'Unknown'}</span>
                  <span className="page-views">{page.views} views</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'behavior' && behaviorData && (
        <div className="behavior-section">
          <h3>User Behavior Events</h3>
          <div className="events-table">
            <table>
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>Page</th>
                  <th>Element</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {behaviorData.recentEvents?.slice(0, 20).map((event) => (
                  <tr key={event.id}>
                    <td>{event.eventType}</td>
                    <td>{event.page || '-'}</td>
                    <td>{event.element || '-'}</td>
                    <td>{new Date(event.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sessions' && sessionData && (
        <div className="sessions-section">
          <h3>Session Analytics</h3>
          <div className="sessions-stats">
            <div className="session-stat">
              <span>Total Sessions:</span>
              <strong>{sessionData.totalSessions}</strong>
            </div>
            <div className="session-stat">
              <span>Average Duration:</span>
              <strong>{Math.round(sessionData.averageDuration)}s</strong>
            </div>
            <div className="session-stat">
              <span>Bounce Rate:</span>
              <strong>{sessionData.bounceRate}%</strong>
            </div>
          </div>

          <h3>Recent Sessions</h3>
          <div className="sessions-list">
            {sessionData.sessions?.slice(0, 10).map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-info">
                  <p><strong>Session ID:</strong> {session.sessionId}</p>
                  <p><strong>Start:</strong> {new Date(session.startTime).toLocaleString()}</p>
                  <p><strong>Duration:</strong> {session.duration ? `${session.duration}s` : 'Active'}</p>
                  <p><strong>Page Views:</strong> {session.pageViews}</p>
                  <p><strong>Device:</strong> {session.deviceType}</p>
                  <p><strong>Browser:</strong> {session.browser}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'funnel' && (
        <div className="funnel-section">
          <div className="funnel-create">
            <h3>Create Funnel</h3>
            <form onSubmit={handleCreateFunnel}>
              <div className="form-group">
                <label>Funnel Name</label>
                <input
                  type="text"
                  value={funnelName}
                  onChange={(e) => setFunnelName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Steps (one per line)</label>
                <textarea
                  value={funnelSteps}
                  onChange={(e) => setFunnelSteps(e.target.value)}
                  placeholder="Step 1&#10;Step 2&#10;Step 3"
                  required
                />
              </div>
              <button type="submit">Create Funnel</button>
            </form>
          </div>

          <div className="funnel-analytics">
            <h3>View Funnel Analytics</h3>
            <div className="funnel-search">
              <input
                type="text"
                value={funnelName}
                onChange={(e) => setFunnelName(e.target.value)}
                placeholder="Enter funnel name"
              />
              <button onClick={handleLoadFunnelAnalytics}>Load</button>
            </div>

            {funnelAnalytics && (
              <div className="funnel-data">
                <h4>{funnelAnalytics.funnelName}</h4>
                {funnelAnalytics.steps.map((step) => (
                  <div key={step.stepOrder} className="funnel-step">
                    <div className="step-header">
                      <span className="step-name">{step.stepName}</span>
                      <span className="step-rate">{step.completionRate}%</span>
                    </div>
                    <div className="step-details">
                      <p>Total Events: {step.totalEvents}</p>
                      <p>Completed: {step.completedEvents}</p>
                      <p>Avg Time: {Math.round(step.avgTimeToComplete / 1000)}s</p>
                    </div>
                    <div className="step-progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${step.completionRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'abtest' && (
        <div className="abtest-section">
          <div className="abtest-create">
            <h3>Create A/B Test</h3>
            <form onSubmit={handleCreateABTest}>
              <div className="form-group">
                <label>Test Name</label>
                <input
                  type="text"
                  value={abTestName}
                  onChange={(e) => setAbTestName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={abTestDesc}
                  onChange={(e) => setAbTestDesc(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Variant A</label>
                <input
                  type="text"
                  value={abVariantA}
                  onChange={(e) => setAbVariantA(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Variant B</label>
                <input
                  type="text"
                  value={abVariantB}
                  onChange={(e) => setAbVariantB(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Create Test</button>
            </form>
          </div>

          <div className="abtest-results">
            <h3>View A/B Test Results</h3>
            <div className="abtest-search">
              <input
                type="text"
                value={abTestName}
                onChange={(e) => setAbTestName(e.target.value)}
                placeholder="Enter test name"
              />
              <button onClick={handleLoadABTestResults}>Load</button>
            </div>

            {abTestResults && (
              <div className="abtest-data">
                <h4>{abTestResults.testName}</h4>
                <div className="variant-comparison">
                  <div className="variant">
                    <h5>Variant A</h5>
                    <p>Total: {abTestResults.variantA.total}</p>
                    <p>Conversions: {abTestResults.variantA.conversions}</p>
                    <p>Conversion Rate: {abTestResults.variantA.conversionRate}%</p>
                  </div>
                  <div className="variant">
                    <h5>Variant B</h5>
                    <p>Total: {abTestResults.variantB.total}</p>
                    <p>Conversions: {abTestResults.variantB.conversions}</p>
                    <p>Conversion Rate: {abTestResults.variantB.conversionRate}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'retention' && retentionData && (
        <div className="retention-section">
          <h3>Retention Metrics</h3>
          <div className="retention-stats">
            <div className="retention-stat">
              <span>Total Users:</span>
              <strong>{retentionData.totalUsers}</strong>
            </div>
            <div className="retention-stat">
              <span>Day 1 Retention:</span>
              <strong>{retentionData.day1RetentionRate}%</strong>
            </div>
            <div className="retention-stat">
              <span>Day 7 Retention:</span>
              <strong>{retentionData.day7RetentionRate}%</strong>
            </div>
            <div className="retention-stat">
              <span>Day 30 Retention:</span>
              <strong>{retentionData.day30RetentionRate}%</strong>
            </div>
            <div className="retention-stat">
              <span>Day 90 Retention:</span>
              <strong>{retentionData.day90RetentionRate}%</strong>
            </div>
          </div>

          <div className="retention-chart">
            <h4>Retention Curve</h4>
            <div className="retention-bars">
              <div className="retention-bar">
                <span>Day 1</span>
                <div className="bar" style={{ width: `${retentionData.day1RetentionRate}%` }} />
                <span>{retentionData.day1RetentionRate}%</span>
              </div>
              <div className="retention-bar">
                <span>Day 7</span>
                <div className="bar" style={{ width: `${retentionData.day7RetentionRate}%` }} />
                <span>{retentionData.day7RetentionRate}%</span>
              </div>
              <div className="retention-bar">
                <span>Day 30</span>
                <div className="bar" style={{ width: `${retentionData.day30RetentionRate}%` }} />
                <span>{retentionData.day30RetentionRate}%</span>
              </div>
              <div className="retention-bar">
                <span>Day 90</span>
                <div className="bar" style={{ width: `${retentionData.day90RetentionRate}%` }} />
                <span>{retentionData.day90RetentionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
