import { NestFactory } from '@nestjs/core';
import { OrderBookKeepingServiceModule } from './order-book-keeping-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderBookKeepingServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
