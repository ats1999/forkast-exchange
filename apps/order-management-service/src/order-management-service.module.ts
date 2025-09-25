import { Module } from '@nestjs/common';
import { OrderManagementServiceController } from './order-management-service.controller';
import { OrderManagementServiceService } from './order-management-service.service';
import { AuthModule } from '@app/auth';

@Module({
  imports: [AuthModule],
  controllers: [OrderManagementServiceController],
  providers: [OrderManagementServiceService],
})
export class OrderManagementServiceModule {}
