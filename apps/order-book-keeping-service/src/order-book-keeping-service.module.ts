import { Module } from '@nestjs/common';
import { OrderBookKeepingServiceController } from './order-book-keeping-service.controller';
import { OrderBookKeepingServiceService } from './order-book-keeping-service.service';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [ExchangeModule],
  controllers: [OrderBookKeepingServiceController],
  providers: [OrderBookKeepingServiceService],
})
export class OrderBookKeepingServiceModule {}
