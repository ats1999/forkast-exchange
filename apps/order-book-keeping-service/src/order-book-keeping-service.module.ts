import { Module } from '@nestjs/common';
import { OrderBookKeepingServiceController } from './order-book-keeping-service.controller';
import { OrderBookKeepingServiceService } from './order-book-keeping-service.service';

@Module({
  imports: [],
  controllers: [OrderBookKeepingServiceController],
  providers: [OrderBookKeepingServiceService],
})
export class OrderBookKeepingServiceModule {}
