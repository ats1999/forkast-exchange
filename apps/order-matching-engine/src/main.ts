import { NestFactory } from '@nestjs/core';
import { OrderMatchingEngineModule } from './order-matching-engine.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderMatchingEngineModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
