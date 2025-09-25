import { Controller, Get } from '@nestjs/common';
import { OrderBookKeepingServiceService } from './order-book-keeping-service.service';

@Controller()
export class OrderBookKeepingServiceController {
  constructor(private readonly orderBookKeepingServiceService: OrderBookKeepingServiceService) {}

  @Get()
  getHello(): string {
    return this.orderBookKeepingServiceService.getHello();
  }
}
