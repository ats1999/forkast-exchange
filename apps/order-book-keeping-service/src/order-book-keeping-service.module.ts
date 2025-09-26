import { Module } from '@nestjs/common';
import { OrderBookKeepingServiceController } from './order-book-keeping-service.controller';
import { ExchangeModule } from './exchange/exchange.module';
import { AuthModule } from '@app/auth';
import { BooKeeperModule } from './book-keeper/book-keeper.module';

@Module({
  imports: [ExchangeModule, AuthModule, BooKeeperModule],
  controllers: [OrderBookKeepingServiceController],
  providers: [],
})
export class OrderBookKeepingServiceModule {}
