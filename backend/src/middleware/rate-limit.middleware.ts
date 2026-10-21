import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store = new Map<string, RateLimitStore>();
  private windowMs = 60 * 1000; // 1 minute window
  private maxRequests = 100; // Max requests per window

  use(req: Request, res: Response, next: NextFunction) {
    const key = this.getKey(req);
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      // Create new record or reset expired
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      this.setRateLimitHeaders(res, 1, this.maxRequests, now + this.windowMs);
      return next();
    }

    if (record.count >= this.maxRequests) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('X-RateLimit-Reset', record.resetTime.toString());
      
      return res.status(429).json({
        message: 'Too many requests',
        error: 'TOO_MANY_REQUESTS',
        retryAfter,
      });
    }

    // Increment count
    record.count++;
    this.setRateLimitHeaders(res, this.maxRequests - record.count, this.maxRequests, record.resetTime);
    next();
  }

  private getKey(req: Request): string {
    // Use IP address or user ID if authenticated
    const userId = (req as any).user?.id;
    if (userId) {
      return `user:${userId}`;
    }
    return `ip:${req.ip}`;
  }

  private setRateLimitHeaders(res: Response, remaining: number, limit: number, resetTime: number) {
    res.setHeader('X-RateLimit-Limit', limit.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', resetTime.toString());
  }

  // Cleanup expired records periodically
  cleanupExpiredRecords() {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}
