import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as zlib from 'zlib';

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Skip compression if client doesn't accept encoding
    const acceptEncoding = req.headers['accept-encoding'];
    if (!acceptEncoding || !acceptEncoding.includes('gzip')) {
      return next();
    }

    // Skip compression for small responses
    const originalSend = res.send;
    let responseBody: any;

    res.send = function (data: any) {
      responseBody = data;
      if (Buffer.byteLength(data) < 1024) {
        return originalSend.call(this, data);
      }

      zlib.gzip(data, (err, compressed) => {
        if (err) {
          return originalSend.call(this, data);
        }
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Length', compressed.length);
        return originalSend.call(this, compressed);
      });
    };

    next();
  }
}
