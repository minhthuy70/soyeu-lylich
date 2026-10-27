import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

export interface WebhookPayload {
  event: string;
  data: unknown;
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

  registerWebhook(userId: number, config: Omit<WebhookConfig, 'isActive'>) {
    const webhookId = `${userId}-${Date.now()}`;
    this.webhooks.set(webhookId, {
      ...config,
      isActive: true,
    });
    return { webhookId, ...config };
  }

  async triggerWebhook(event: string, payload: WebhookPayload) {
    const triggeredWebhooks: Array<{ webhookId: string; status: string; error?: string }> = [];

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
        triggeredWebhooks.push({
          webhookId,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return triggeredWebhooks;
  }

  getWebhooks(userId: number) {
    const userWebhooks: Array<{ webhookId: string } & WebhookConfig> = [];
    for (const [webhookId, config] of this.webhooks.entries()) {
      if (webhookId.startsWith(userId.toString())) {
        userWebhooks.push({ webhookId, ...config });
      }
    }
    return userWebhooks;
  }

  deleteWebhook(webhookId: string) {
    return this.webhooks.delete(webhookId);
  }

  private generateSignature(payload: WebhookPayload, secret: string): string {
    const hmac = createHmac('sha256', secret);
    const serializedPayload = JSON.stringify(payload);
    if (serializedPayload === undefined) {
      throw new TypeError('Webhook payload could not be serialized');
    }
    hmac.update(serializedPayload);
    return hmac.digest('hex');
  }
}
