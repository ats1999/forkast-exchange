import { IsString, IsInt, IsPositive } from 'class-validator';
import CreateOrderUserRequest from './CreateOrderUserRequest';

export default class CreateOrderDto extends CreateOrderUserRequest {
  @IsString()
  id: string;

  @IsInt()
  @IsPositive()
  userId: number;
}
