// rate-limiter.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private limiter: ReturnType<typeof rateLimit>;

  constructor() {
    this.limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: 'Too many login attempts from this IP, please try again after 15 minutes',
      headers: true,
    });
  }

  use(req: any, res: any, next: () => void) {
    this.limiter(req, res, next);
  }
}
