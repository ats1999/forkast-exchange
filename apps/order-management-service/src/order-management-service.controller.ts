import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { OrderManagementServiceService } from './order-management-service.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class OrderManagementServiceController {
  constructor(
    private readonly orderManagementServiceService: OrderManagementServiceService,
  ) {}

  @Get('hello')
  @UseGuards(AuthGuard('basic'))
  getHello(@Request() req): string {
    return this.orderManagementServiceService.getHello(req.user);
  }
}
