import { Injectable } from '@nestjs/common';

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: Date;
  userId?: number;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
}

@Injectable()
export class WebhooksService {
  private webhooks: Map<string, WebhookConfig> = new Map();

  async registerWebhook(userId: number, config: Omit<WebhookConfig, 'isActive'>) {
    const webhookId = `${userId}-${Date.now()}`;
    this.webhooks.set(webhookId, {
      ...config,
      isActive: true,
    });
    return { webhookId, ...config };
  }

  async triggerWebhook(event: string, payload: WebhookPayload) {
    const triggeredWebhooks = [];

    for (const [webhookId, config] of this.webhooks.entries()) {
      if (!config.isActive || !config.events.includes(event)) {
        continue;
      }

      try {
        const signature = this.generateSignature(payload, config.secret);

        const response = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': event,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          triggeredWebhooks.push({ webhookId, status: 'success' });
        } else {
          triggeredWebhooks.push({ webhookId, status: 'failed', error: response.statusText });
        }
      } catch (error) {
        triggeredWebhooks.push({ webhookId, status: 'failed', error: error.message });
      }
    }

    return triggeredWebhooks;
  }

  async getWebhooks(userId: number) {
    const userWebhooks = [];
    for (const [webhookId, config] of this.webhooks.entries()) {
      if (webhookId.startsWith(userId.toString())) {
        userWebhooks.push({ webhookId, ...config });
      }
    }
    return userWebhooks;
  }

  async deleteWebhook(webhookId: string) {
    return this.webhooks.delete(webhookId);
  }

  private generateSignature(payload: any, secret: string): string {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }
}
