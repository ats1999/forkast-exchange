import { Controller, Get } from '@nestjs/common';
import { OrderManagementServiceService } from './order-management-service.service';

@Controller()
export class OrderManagementServiceController {
  constructor(private readonly orderManagementServiceService: OrderManagementServiceService) {}

  @Get()
  getHello(): string {
    return this.orderManagementServiceService.getHello();
  }
}
