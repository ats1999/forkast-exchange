import {
  IsString,
  IsInt,
  IsPositive,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { OrderSide, OrderType } from '@prisma/client';

export default class CreateOrderUserRequest {
  @IsPositive()
  symbolId: number;

  @IsEnum(OrderType)
  type: OrderType;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsEnum(OrderSide)
  side: OrderSide;

  @IsOptional()
  @IsPositive()
  price?: number; // optional for market orders
}
