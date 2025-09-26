import { Module } from '@nestjs/common';
import { ExchangeHandlerService } from './exchange-handler.service';
import { ExchangeListenerService } from './exchange-listener.service';
import { BooKeeperModule } from '../book-keeper/book-keeper.module';
import { TradeExecutionModule } from '../trade/trade-execution.module';
import { KafkaModule } from '@app/infra/kafka';

@Module({
  imports: [KafkaModule, BooKeeperModule, TradeExecutionModule],
  providers: [ExchangeHandlerService, ExchangeListenerService],
})
export class ExchangeModule {}
