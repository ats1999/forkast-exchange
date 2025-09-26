import { Module } from '@nestjs/common';
import { KafkaModule } from '@app/infra/kafka';
import { OrderHandlerService } from './order-handler.service';
import { OrderListenerService } from './order-listener.service';
import { OrderExchangePublisherService } from './order-exchnage-publisher.service';
import { ExchangeService } from './exchange/exchange.service';

@Module({
  imports: [KafkaModule],
  providers: [
    OrderHandlerService,
    OrderListenerService,
    OrderExchangePublisherService,
    ExchangeService,
  ],
})
export class EngineModule {}
