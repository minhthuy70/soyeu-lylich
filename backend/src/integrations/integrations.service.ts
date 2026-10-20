import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntegrationDto, IntegrationProvider } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class IntegrationsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(userId: number, createIntegrationDto: CreateIntegrationDto) {
    // Check if integration already exists for this provider
    const existing = await this.prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: createIntegrationDto.provider,
        },
      },
    });

    if (existing) {
      // Update existing integration
      return this.update(userId, existing.id, createIntegrationDto as any);
    }

    return this.prisma.integration.create({
      data: {
        userId,
        ...createIntegrationDto,
        metadata: createIntegrationDto.metadata || {},
        settings: createIntegrationDto.settings || {},
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.integration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: number, id: number) {
    const integration = await this.prisma.integration.findUnique({
      where: { id },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    if (integration.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return integration;
  }

  async update(userId: number, id: number, updateIntegrationDto: UpdateIntegrationDto) {
    const integration = await this.findOne(userId, id);

    return this.prisma.integration.update({
      where: { id },
      data: {
        ...updateIntegrationDto,
        metadata: (updateIntegrationDto as any).metadata || integration.metadata,
        settings: (updateIntegrationDto as any).settings || integration.settings,
        lastSyncedAt: new Date(),
      },
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    return this.prisma.integration.delete({
      where: { id },
    });
  }

  // Twitter OAuth
  async getTwitterAuthUrl(userId: number) {
    const state = this.jwtService.sign({ userId, provider: 'twitter' });
    const twitterClientId = process.env.TWITTER_CLIENT_ID || '';
    const callbackUrl = process.env.TWITTER_CALLBACK_URL || '';

    return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${twitterClientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=tweet.read%20users.read&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
  }

  async handleTwitterCallback(code: string, state: string) {
    try {
      const payload = this.jwtService.verify(state);
      const { userId } = payload;

      // Exchange code for access token
      const tokenResponse = await axios.post(
        'https://api.twitter.com/2/oauth2/token',
        new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: process.env.TWITTER_CLIENT_ID || '',
          client_secret: process.env.TWITTER_CLIENT_SECRET || '',
          redirect_uri: process.env.TWITTER_CALLBACK_URL || '',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // Get user info
      const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
        },
      });

      return this.create(userId, {
        provider: IntegrationProvider.TWITTER,
        providerId: userResponse.data.data.id,
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token,
        metadata: {
          username: userResponse.data.data.username,
          name: userResponse.data.data.name,
        },
      });
    } catch (error) {
      throw new Error('Twitter OAuth failed');
    }
  }

  // Slack OAuth
  async getSlackAuthUrl(userId: number) {
    const state = this.jwtService.sign({ userId, provider: 'slack' });
    const slackClientId = process.env.SLACK_CLIENT_ID || '';
    const callbackUrl = process.env.SLACK_CALLBACK_URL || '';

    return `https://slack.com/oauth/v2/authorize?client_id=${slackClientId}&scope=chat:write,channels:read,users:read&redirect_uri=${encodeURIComponent(callbackUrl)}&state=${state}`;
  }

  async handleSlackCallback(code: string, state: string) {
    try {
      const payload = this.jwtService.verify(state);
      const { userId } = payload;

      const tokenResponse = await axios.post(
        'https://slack.com/api/oauth.v2.access',
        new URLSearchParams({
          code,
          client_id: process.env.SLACK_CLIENT_ID || '',
          client_secret: process.env.SLACK_CLIENT_SECRET || '',
          redirect_uri: process.env.SLACK_CALLBACK_URL || '',
        }),
      );

      if (!tokenResponse.data.ok) {
        throw new Error('Slack OAuth failed');
      }

      return this.create(userId, {
        provider: IntegrationProvider.SLACK,
        providerId: tokenResponse.data.team.id,
        accessToken: tokenResponse.data.access_token,
        metadata: {
          teamName: tokenResponse.data.team.name,
          botUserId: tokenResponse.data.bot_user_id,
        },
      });
    } catch (error) {
      throw new Error('Slack OAuth failed');
    }
  }

  // Notion OAuth
  async getNotionAuthUrl(userId: number) {
    const state = this.jwtService.sign({ userId, provider: 'notion' });
    const notionClientId = process.env.NOTION_CLIENT_ID || '';
    const callbackUrl = process.env.NOTION_CALLBACK_URL || '';

    return `https://api.notion.com/v1/oauth/authorize?client_id=${notionClientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(callbackUrl)}&state=${state}`;
  }

  async handleNotionCallback(code: string, state: string) {
    try {
      const payload = this.jwtService.verify(state);
      const { userId } = payload;

      const tokenResponse = await axios.post('https://api.notion.com/v1/oauth/token', {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NOTION_CALLBACK_URL,
        client_id: process.env.NOTION_CLIENT_ID,
        client_secret: process.env.NOTION_CLIENT_SECRET,
      });

      return this.create(userId, {
        provider: IntegrationProvider.NOTION,
        providerId: tokenResponse.data.workspace_id,
        accessToken: tokenResponse.data.access_token,
        metadata: {
          workspaceName: tokenResponse.data.workspace_name,
          workspaceIcon: tokenResponse.data.workspace_icon,
        },
      });
    } catch (error) {
      throw new Error('Notion OAuth failed');
    }
  }

  // Google Calendar OAuth
  async getGoogleCalendarAuthUrl(userId: number) {
    const state = this.jwtService.sign({ userId, provider: 'google_calendar' });
    const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
    const callbackUrl = process.env.GOOGLE_CALENDAR_CALLBACK_URL || '';

    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=https://www.googleapis.com/auth/calendar.events&state=${state}&access_type=offline&prompt=consent`;
  }

  async handleGoogleCalendarCallback(code: string, state: string) {
    try {
      const payload = this.jwtService.verify(state);
      const { userId } = payload;

      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          redirect_uri: process.env.GOOGLE_CALENDAR_CALLBACK_URL || '',
          grant_type: 'authorization_code',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // Get user info
      const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
        },
      });

      return this.create(userId, {
        provider: IntegrationProvider.GOOGLE_CALENDAR,
        providerId: userResponse.data.id,
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token,
        metadata: {
          email: userResponse.data.email,
          name: userResponse.data.name,
        },
      });
    } catch (error) {
      throw new Error('Google Calendar OAuth failed');
    }
  }

  // SendGrid Integration
  async connectSendgrid(userId: number, apiKey: string) {
    try {
      // Validate API key
      await axios.get('https://api.sendgrid.com/v3/user/profile', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      return this.create(userId, {
        provider: IntegrationProvider.SENDGRID,
        accessToken: apiKey,
        settings: {
          apiKey,
        },
      });
    } catch (error) {
      throw new Error('Invalid SendGrid API key');
    }
  }

  async sendEmail(userId: number, to: string, subject: string, content: string) {
    const integration = await this.prisma.integration.findFirst({
      where: {
        userId,
        provider: IntegrationProvider.SENDGRID,
        isActive: true,
      },
    });

    if (!integration) {
      throw new NotFoundException('SendGrid not connected');
    }

    await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        personalizations: [
          {
            to: [{ email: to }],
            subject,
          },
        ],
        from: { email: process.env.SENDGRID_FROM_EMAIL },
        content: [
          {
            type: 'text/html',
            value: content,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${integration.accessToken}`,
        },
      },
    );

    return { success: true };
  }

  // Twilio Integration
  async connectTwilio(userId: number, accountSid: string, authToken: string) {
    try {
      // Validate credentials
      await axios.get(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
        auth: {
          username: accountSid,
          password: authToken,
        },
      });

      return this.create(userId, {
        provider: IntegrationProvider.TWILIO,
        accessToken: authToken,
        settings: {
          accountSid,
          authToken,
        },
      });
    } catch (error) {
      throw new Error('Invalid Twilio credentials');
    }
  }

  async sendSMS(userId: number, to: string, message: string) {
    const integration = await this.prisma.integration.findFirst({
      where: {
        userId,
        provider: IntegrationProvider.TWILIO,
        isActive: true,
      },
    });

    if (!integration) {
      throw new NotFoundException('Twilio not connected');
    }

    const { accountSid, authToken } = integration.settings as any;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '';

    await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      `From=${encodeURIComponent(twilioPhoneNumber)}&To=${encodeURIComponent(to)}&Body=${encodeURIComponent(message)}`,
      {
        auth: {
          username: accountSid,
          password: authToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return { success: true };
  }

  // Stripe Integration
  async connectStripe(userId: number, apiKey: string) {
    try {
      // Validate API key
      await axios.get('https://api.stripe.com/v1/account', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      return this.create(userId, {
        provider: IntegrationProvider.STRIPE,
        accessToken: apiKey,
        settings: {
          apiKey,
        },
      });
    } catch (error) {
      throw new Error('Invalid Stripe API key');
    }
  }

  async createPaymentIntent(userId: number, amount: number, currency: string = 'usd') {
    const integration = await this.prisma.integration.findFirst({
      where: {
        userId,
        provider: IntegrationProvider.STRIPE,
        isActive: true,
      },
    });

    if (!integration) {
      throw new NotFoundException('Stripe not connected');
    }

    const response = await axios.post(
      'https://api.stripe.com/v1/payment_intents',
      new URLSearchParams({
        amount: (amount * 100).toString(),
        currency,
      }),
      {
        headers: {
          Authorization: `Bearer ${integration.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    // Create payment transaction record
    await this.prisma.paymentTransaction.create({
      data: {
        userId,
        provider: IntegrationProvider.STRIPE,
        providerId: response.data.id,
        amount,
        currency,
        status: 'pending',
      },
    });

    return response.data;
  }

  // AWS S3 Integration
  async connectAwsS3(userId: number, accessKeyId: string, secretAccessKey: string, region: string, bucket: string) {
    return this.create(userId, {
      provider: IntegrationProvider.AWS_S3,
      settings: {
        accessKeyId,
        secretAccessKey,
        region,
        bucket,
      },
    });
  }

  async uploadFileToS3(userId: number, file: any, key?: string) {
    const integration = await this.prisma.integration.findFirst({
      where: {
        userId,
        provider: IntegrationProvider.AWS_S3,
        isActive: true,
      },
    });

    if (!integration) {
      throw new NotFoundException('AWS S3 not connected');
    }

    const { accessKeyId, secretAccessKey, region, bucket } = integration.settings as any;
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const fileKey = key || `${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${fileKey}`;

    // Save file record
    const savedFile = await this.prisma.cloudStorageFile.create({
      data: {
        userId,
        provider: IntegrationProvider.AWS_S3,
        fileName: file.originalname,
        filePath: fileKey,
        fileSize: file.size,
        mimeType: file.mimetype,
        bucket,
        url: fileUrl,
      },
    });

    return savedFile;
  }

  async listS3Files(userId: number) {
    const integration = await this.prisma.integration.findFirst({
      where: {
        userId,
        provider: IntegrationProvider.AWS_S3,
        isActive: true,
      },
    });

    if (!integration) {
      throw new NotFoundException('AWS S3 not connected');
    }

    return this.prisma.cloudStorageFile.findMany({
      where: {
        userId,
        provider: IntegrationProvider.AWS_S3,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteS3File(userId: number, fileId: number) {
    const file = await this.prisma.cloudStorageFile.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== userId) {
      throw new NotFoundException('File not found');
    }

    const integration = await this.prisma.integration.findFirst({
      where: {
        userId,
        provider: IntegrationProvider.AWS_S3,
        isActive: true,
      },
    });

    if (!integration) {
      throw new NotFoundException('AWS S3 not connected');
    }

    const { accessKeyId, secretAccessKey, region, bucket } = integration.settings as any;
    const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: file.filePath,
    });

    await s3Client.send(command);

    await this.prisma.cloudStorageFile.delete({
      where: { id: fileId },
    });

    return { success: true };
  }
}
