import { NestFactory } from '@nestjs/core';
import { OrderManagementServiceModule } from './order-management-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderManagementServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
