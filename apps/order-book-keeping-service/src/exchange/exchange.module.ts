import { Module } from '@nestjs/common';
import { ExchangeHandlerService } from './exchange-handler.service';
import { ExchangeListenerService } from './exchange-listener.service';
import { TradeExecutionModule } from '../trade/trade-execution.module';

@Module({
  imports: [TradeExecutionModule],
  providers: [ExchangeHandlerService, ExchangeListenerService],
})
export class ExchangeModule {}
