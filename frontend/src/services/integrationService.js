const API_BASE = 'http://localhost:3000';

const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const integrationService = {
  // Get all integrations
  async getAll() {
    const response = await fetch(`${API_BASE}/integrations`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch integrations');
    return response.json();
  },

  // Get integration by ID
  async getById(id) {
    const response = await fetch(`${API_BASE}/integrations/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch integration');
    return response.json();
  },

  // Create integration
  async create(data) {
    const response = await fetch(`${API_BASE}/integrations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create integration');
    return response.json();
  },

  // Update integration
  async update(id, data) {
    const response = await fetch(`${API_BASE}/integrations/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update integration');
    return response.json();
  },

  // Delete integration
  async delete(id) {
    const response = await fetch(`${API_BASE}/integrations/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete integration');
    return response.json();
  },

  // Twitter OAuth
  async getTwitterAuthUrl() {
    const response = await fetch(`${API_BASE}/integrations/twitter/auth-url`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get Twitter auth URL');
    return response.json();
  },

  // Slack OAuth
  async getSlackAuthUrl() {
    const response = await fetch(`${API_BASE}/integrations/slack/auth-url`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get Slack auth URL');
    return response.json();
  },

  // Notion OAuth
  async getNotionAuthUrl() {
    const response = await fetch(`${API_BASE}/integrations/notion/auth-url`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get Notion auth URL');
    return response.json();
  },

  // Google Calendar OAuth
  async getGoogleCalendarAuthUrl() {
    const response = await fetch(`${API_BASE}/integrations/google-calendar/auth-url`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get Google Calendar auth URL');
    return response.json();
  },

  // SendGrid
  async connectSendgrid(apiKey) {
    const response = await fetch(`${API_BASE}/integrations/sendgrid/connect`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ apiKey }),
    });
    if (!response.ok) throw new Error('Failed to connect SendGrid');
    return response.json();
  },

  async sendEmail(to, subject, content) {
    const response = await fetch(`${API_BASE}/integrations/sendgrid/send`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ to, subject, content }),
    });
    if (!response.ok) throw new Error('Failed to send email');
    return response.json();
  },

  // Twilio
  async connectTwilio(accountSid, authToken) {
    const response = await fetch(`${API_BASE}/integrations/twilio/connect`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ accountSid, authToken }),
    });
    if (!response.ok) throw new Error('Failed to connect Twilio');
    return response.json();
  },

  async sendSMS(to, message) {
    const response = await fetch(`${API_BASE}/integrations/twilio/send`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ to, message }),
    });
    if (!response.ok) throw new Error('Failed to send SMS');
    return response.json();
  },

  // Stripe
  async connectStripe(apiKey) {
    const response = await fetch(`${API_BASE}/integrations/stripe/connect`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ apiKey }),
    });
    if (!response.ok) throw new Error('Failed to connect Stripe');
    return response.json();
  },

  async createPaymentIntent(amount, currency = 'usd') {
    const response = await fetch(`${API_BASE}/integrations/stripe/payment-intent`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, currency }),
    });
    if (!response.ok) throw new Error('Failed to create payment intent');
    return response.json();
  },

  // AWS S3
  async connectAwsS3(accessKeyId, secretAccessKey, region, bucket) {
    const response = await fetch(`${API_BASE}/integrations/aws-s3/connect`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ accessKeyId, secretAccessKey, region, bucket }),
    });
    if (!response.ok) throw new Error('Failed to connect AWS S3');
    return response.json();
  },

  async uploadFileToS3(file, key) {
    const formData = new FormData();
    formData.append('file', file);
    if (key) formData.append('key', key);

    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE}/integrations/aws-s3/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload file to S3');
    return response.json();
  },

  async listS3Files() {
    const response = await fetch(`${API_BASE}/integrations/aws-s3/files`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to list S3 files');
    return response.json();
  },

  async deleteS3File(id) {
    const response = await fetch(`${API_BASE}/integrations/aws-s3/files/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete S3 file');
    return response.json();
  },
};
