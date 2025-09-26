import { NestFactory } from '@nestjs/core';
import { OrderBookKeepingServiceModule } from './order-book-keeping-service.module';
import { Logger } from '@nestjs/common';

import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(OrderBookKeepingServiceModule);
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  Logger.log(`✅ Orders app is running on http://localhost:${port}`);
}
bootstrap();
