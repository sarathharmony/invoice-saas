import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return {
      status: 'ok',
      service: 'invoice-saas',
      company: process.env.COMPANY_NAME ?? null,
      hasDb: Boolean(process.env.DATABASE_URL),
      hasRedis: Boolean(process.env.REDIS_URL),
      hasStripe: Boolean(process.env.STRIPE_SECRET_KEY),
      timestamp: new Date().toISOString(),
    };
  }
}
