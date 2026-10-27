import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  // OAuth endpoints must come before dynamic routes
  // Twitter OAuth
  @Get('twitter/auth-url')
  getTwitterAuthUrl(@Req() req: AuthenticatedRequest) {
    return this.integrationsService.getTwitterAuthUrl(req.user.userId);
  }

  @Get('twitter/callback')
  handleTwitterCallback(@Query('code') code: string, @Query('state') state: string) {
    return this.integrationsService.handleTwitterCallback(code, state);
  }

  // Slack OAuth
  @Get('slack/auth-url')
  getSlackAuthUrl(@Req() req: AuthenticatedRequest) {
    return this.integrationsService.getSlackAuthUrl(req.user.userId);
  }

  @Get('slack/callback')
  handleSlackCallback(@Query('code') code: string, @Query('state') state: string) {
    return this.integrationsService.handleSlackCallback(code, state);
  }

  // Notion OAuth
  @Get('notion/auth-url')
  getNotionAuthUrl(@Req() req: AuthenticatedRequest) {
    return this.integrationsService.getNotionAuthUrl(req.user.userId);
  }

  @Get('notion/callback')
  handleNotionCallback(@Query('code') code: string, @Query('state') state: string) {
    return this.integrationsService.handleNotionCallback(code, state);
  }

  // Google Calendar OAuth
  @Get('google-calendar/auth-url')
  getGoogleCalendarAuthUrl(@Req() req: AuthenticatedRequest) {
    return this.integrationsService.getGoogleCalendarAuthUrl(req.user.userId);
  }

  @Get('google-calendar/callback')
  handleGoogleCalendarCallback(@Query('code') code: string, @Query('state') state: string) {
    return this.integrationsService.handleGoogleCalendarCallback(code, state);
  }

  // SendGrid
  @Post('sendgrid/connect')
  connectSendgrid(@Req() req: AuthenticatedRequest, @Body('apiKey') apiKey: string) {
    return this.integrationsService.connectSendgrid(req.user.userId, apiKey);
  }

  @Post('sendgrid/send')
  sendEmail(
    @Req() req: AuthenticatedRequest,
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('content') content: string
  ) {
    return this.integrationsService.sendEmail(req.user.userId, to, subject, content);
  }

  // Twilio
  @Post('twilio/connect')
  connectTwilio(
    @Req() req: AuthenticatedRequest,
    @Body('accountSid') accountSid: string,
    @Body('authToken') authToken: string
  ) {
    return this.integrationsService.connectTwilio(req.user.userId, accountSid, authToken);
  }

  @Post('twilio/send')
  sendSMS(
    @Req() req: AuthenticatedRequest,
    @Body('to') to: string,
    @Body('message') message: string
  ) {
    return this.integrationsService.sendSMS(req.user.userId, to, message);
  }

  // Stripe
  @Post('stripe/connect')
  connectStripe(@Req() req: AuthenticatedRequest, @Body('apiKey') apiKey: string) {
    return this.integrationsService.connectStripe(req.user.userId, apiKey);
  }

  @Post('stripe/payment-intent')
  createPaymentIntent(
    @Req() req: AuthenticatedRequest,
    @Body('amount') amount: number,
    @Body('currency') currency?: string
  ) {
    return this.integrationsService.createPaymentIntent(req.user.userId, amount, currency);
  }

  // AWS S3
  @Post('aws-s3/connect')
  connectAwsS3(
    @Req() req: AuthenticatedRequest,
    @Body('accessKeyId') accessKeyId: string,
    @Body('secretAccessKey') secretAccessKey: string,
    @Body('region') region: string,
    @Body('bucket') bucket: string
  ) {
    return this.integrationsService.connectAwsS3(
      req.user.userId,
      accessKeyId,
      secretAccessKey,
      region,
      bucket
    );
  }

  @Post('aws-s3/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileToS3(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('key') key?: string
  ) {
    return this.integrationsService.uploadFileToS3(req.user.userId, file, key);
  }

  @Get('aws-s3/files')
  listS3Files(@Req() req: AuthenticatedRequest) {
    return this.integrationsService.listS3Files(req.user.userId);
  }

  @Delete('aws-s3/files/:id')
  deleteS3File(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.integrationsService.deleteS3File(req.user.userId, +id);
  }

  // CRUD endpoints
  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() createIntegrationDto: CreateIntegrationDto) {
    return this.integrationsService.create(req.user.userId, createIntegrationDto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.integrationsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.integrationsService.findOne(req.user.userId, +id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateIntegrationDto: UpdateIntegrationDto
  ) {
    return this.integrationsService.update(req.user.userId, +id, updateIntegrationDto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.integrationsService.remove(req.user.userId, +id);
  }
}
