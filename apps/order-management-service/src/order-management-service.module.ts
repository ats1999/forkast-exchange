import { Module } from '@nestjs/common';
import { OrderManagementServiceController } from './order-management-service.controller';
import { OrderManagementServiceService } from './order-management-service.service';

@Module({
  imports: [],
  controllers: [OrderManagementServiceController],
  providers: [OrderManagementServiceService],
})
export class OrderManagementServiceModule {}
