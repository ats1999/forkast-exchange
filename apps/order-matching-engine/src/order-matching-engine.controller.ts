import { Controller, Get } from '@nestjs/common';
import { OrderMatchingEngineService } from './order-matching-engine.service';

@Controller()
export class OrderMatchingEngineController {
  constructor(private readonly orderMatchingEngineService: OrderMatchingEngineService) {}

  @Get()
  getHello(): string {
    return this.orderMatchingEngineService.getHello();
  }
}
