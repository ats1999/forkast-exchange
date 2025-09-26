import { Module } from '@nestjs/common';
import { AuthModule } from '@app/auth';
import { OrderModule } from './order/order.module';

@Module({
  imports: [AuthModule, OrderModule],
})
export class OrderManagementServiceModule {}
