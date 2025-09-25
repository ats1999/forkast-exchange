import { NestFactory } from '@nestjs/core';
import { OrderManagementServiceModule } from './order-management-service.module';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(OrderManagementServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
