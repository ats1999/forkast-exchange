import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { KafkaModule } from '@app/infra/kafka';
import { RedisModule } from '@app/infra/redis';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [KafkaModule, RedisModule, PrismaModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
