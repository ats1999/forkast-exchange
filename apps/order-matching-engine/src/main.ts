import { NestFactory } from '@nestjs/core';
import { OrderMatchingEngineModule } from './order-matching-engine.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderMatchingEngineModule);
  await app.listen(process.env.PORT ?? 3002); // Add this line to start the server
}

bootstrap();
