import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
  }

  async onModuleInit() {
    this.client.on('error', (err) =>
      this.logger.error('Redis Client Error', err),
    );
    await this.client.connect();
    this.logger.log('✅ Redis connected');
  }

  async onModuleDestroy() {
    await this.client.disconnect();
    this.logger.log('🔌 Redis disconnected');
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
