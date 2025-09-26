import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';
import CreateOrderDto from './dto/CreateOrderDTO';
import CreateOrderUserRequest from './dto/CreateOrderUserRequest';
import { GetOrdersDto } from './dto/GetOrdersDTO';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('basic')) // protect endpoint
  @Post()
  async create(@Body() body: CreateOrderUserRequest, @Request() req) {
    // using dynamic import due to ESM restriction
    const { v4: uuidv4 } = await import('uuid');
    const order: CreateOrderDto = {
      ...body,
      userId: req.user.id,
      id: uuidv4(),
    };

    const orderId = await this.orderService.publishOrderForTrade(order);
    return { orderId };
  }

  @UseGuards(AuthGuard('basic'))
  @Get()
  async getOrders(@Query() query: GetOrdersDto, @Request() req) {
    const { page, limit } = query;
    const orders = await this.orderService.getOrdersByUser(
      req.user.id,
      page,
      limit,
    );
    return { page, limit, orders };
  }

  @UseGuards(AuthGuard('basic'))
  @Get(':id')
  async getOrderById(@Param('id') id: string, @Request() req) {
    return this.orderService.getOrderById(id, req.user.id);
  }
}
