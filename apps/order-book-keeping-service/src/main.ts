import { NestFactory } from '@nestjs/core';
import { OrderBookKeepingServiceModule } from './order-book-keeping-service.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(OrderBookKeepingServiceModule);
  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  Logger.log(`✅ Orders app is running on http://localhost:${port}`);
}
bootstrap();
