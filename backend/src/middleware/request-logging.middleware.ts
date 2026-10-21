import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, url, ip, headers } = req;

    // Log request
    this.logger.log(`Incoming: ${method} ${url} from ${ip}`);

    // Capture response
    const originalSend = res.send;
    res.send = function (data) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Log response
      if (statusCode >= 400) {
        this.logger.error(
          `${method} ${url} - ${statusCode} - ${duration}ms - ${ip}`,
        );
      } else if (statusCode >= 300) {
        this.logger.warn(
          `${method} ${url} - ${statusCode} - ${duration}ms - ${ip}`,
        );
      } else {
        this.logger.log(
          `${method} ${url} - ${statusCode} - ${duration}ms - ${ip}`,
        );
      }

      // Add response time header
      res.setHeader('X-Response-Time', `${duration}ms`);

      return originalSend.call(this, data);
    }.bind(this);

    next();
  }
}
