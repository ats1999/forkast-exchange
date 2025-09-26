import { Module } from '@nestjs/common';
import { OrderBookKeepingServiceController } from './order-book-keeping-service.controller';
import { OrderBookKeepingServiceService } from './order-book-keeping-service.service';
import { BooKeeperModule } from './book-keeper/book-keeper.module';

@Module({
  imports: [BooKeeperModule],
  controllers: [OrderBookKeepingServiceController],
  providers: [OrderBookKeepingServiceService],
})
export class OrderBookKeepingServiceModule {}
