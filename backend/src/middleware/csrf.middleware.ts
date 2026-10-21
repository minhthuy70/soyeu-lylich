import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private tokens = new Map<string, string>();

  use(req: Request, res: Response, next: NextFunction) {
    // Skip CSRF for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      // Generate and set CSRF token in cookie
      const token = this.generateToken();
      const csrfCookieName = '_csrf';
      
      res.cookie(csrfCookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour
      });

      this.tokens.set(token, Date.now().toString());
      return next();
    }

    // Validate CSRF token for state-changing requests
    const csrfCookieName = '_csrf';
    const csrfToken = req.cookies[csrfCookieName];
    const csrfHeader = req.headers['x-csrf-token'] as string;
    const csrfBody = req.body?._csrf;

    const providedToken = csrfHeader || csrfBody;

    if (!csrfToken || !providedToken || csrfToken !== providedToken) {
      return res.status(403).json({
        message: 'Invalid CSRF token',
        error: 'FORBIDDEN',
      });
    }

    // Check if token is still valid (not expired)
    const tokenTimestamp = this.tokens.get(csrfToken);
    if (!tokenTimestamp || Date.now() - parseInt(tokenTimestamp) > 3600000) {
      this.tokens.delete(csrfToken);
      return res.status(403).json({
        message: 'CSRF token expired',
        error: 'FORBIDDEN',
      });
    }

    next();
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Clean up expired tokens periodically
  cleanupExpiredTokens() {
    const now = Date.now();
    for (const [token, timestamp] of this.tokens.entries()) {
      if (now - parseInt(timestamp) > 3600000) {
        this.tokens.delete(token);
      }
    }
  }
}
