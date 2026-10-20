const API_BASE = 'http://localhost:3000';

const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const analyticsService = {
  // Track event
  async trackEvent(eventData) {
    const response = await fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Failed to track event');
    return response.json();
  },

  // End session
  async endSession(sessionId) {
    const response = await fetch(`${API_BASE}/analytics/session/end`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ sessionId }),
    });
    if (!response.ok) throw new Error('Failed to end session');
    return response.json();
  },

  // Get user behavior analytics
  async getBehaviorAnalytics(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(`${API_BASE}/analytics/behavior?${params}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get behavior analytics');
    return response.json();
  },

  // Get session analytics
  async getSessionAnalytics(limit = 50) {
    const response = await fetch(`${API_BASE}/analytics/sessions?limit=${limit}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get session analytics');
    return response.json();
  },

  // Get dashboard analytics
  async getDashboardAnalytics(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(`${API_BASE}/analytics/dashboard?${params}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get dashboard analytics');
    return response.json();
  },

  // Funnel management
  async createFunnel(funnelName, steps) {
    const response = await fetch(`${API_BASE}/analytics/funnel`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ funnelName, steps }),
    });
    if (!response.ok) throw new Error('Failed to create funnel');
    return response.json();
  },

  async trackFunnelEvent(sessionId, funnelName, stepName) {
    const response = await fetch(`${API_BASE}/analytics/funnel/track`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ sessionId, funnelName, stepName }),
    });
    if (!response.ok) throw new Error('Failed to track funnel event');
    return response.json();
  },

  async getFunnelAnalytics(funnelName) {
    const response = await fetch(`${API_BASE}/analytics/funnel/${funnelName}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get funnel analytics');
    return response.json();
  },

  // A/B Testing
  async createABTest(name, description, variantA, variantB, trafficSplit) {
    const response = await fetch(`${API_BASE}/analytics/ab-test`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, description, variantA, variantB, trafficSplit }),
    });
    if (!response.ok) throw new Error('Failed to create A/B test');
    return response.json();
  },

  async assignUserToABTest(testName) {
    const response = await fetch(`${API_BASE}/analytics/ab-test/assign?testName=${testName}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to assign user to A/B test');
    return response.json();
  },

  async trackABTestConversion(testName) {
    const response = await fetch(`${API_BASE}/analytics/ab-test/convert`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ testName }),
    });
    if (!response.ok) throw new Error('Failed to track A/B test conversion');
    return response.json();
  },

  async getABTestResults(testName) {
    const response = await fetch(`${API_BASE}/analytics/ab-test/${testName}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get A/B test results');
    return response.json();
  },

  // Retention
  async trackRetention() {
    const response = await fetch(`${API_BASE}/analytics/retention/track`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to track retention');
    return response.json();
  },

  async getRetentionMetrics(cohortDate) {
    const params = cohortDate ? `?cohortDate=${cohortDate}` : '';
    const response = await fetch(`${API_BASE}/analytics/retention${params}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get retention metrics');
    return response.json();
  },
};
