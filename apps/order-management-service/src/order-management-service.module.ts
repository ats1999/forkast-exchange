import { Module } from '@nestjs/common';
import { OrderManagementServiceController } from './order-management-service.controller';
import { OrderManagementServiceService } from './order-management-service.service';
import { AuthModule } from '@app/auth';
import { OrderModule } from './order/order.module';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

@Module({
  imports: [AuthModule, OrderModule],
  controllers: [OrderManagementServiceController, OrderController],
  providers: [OrderManagementServiceService, OrderService],
})
export class OrderManagementServiceModule {}
