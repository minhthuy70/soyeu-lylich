import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CacheControlMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Static assets caching
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // API responses caching
    else if (req.url.startsWith('/api/')) {
      // Cache GET requests for 5 minutes
      if (req.method === 'GET') {
        res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
      } else {
        // Don't cache POST, PUT, DELETE
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      }
    }
    // HTML pages
    else {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }

    // ETag support
    res.setHeader('ETag', Date.now().toString());

    next();
  }
}
