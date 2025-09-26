import { Module } from '@nestjs/common';
import { KafkaModule } from '@app/infra/kafka';
import { ExchangeHandlerService } from './exchange-handler.service';
import { ExchangeListenerService } from './exchange-listener.service';
import { BookKeeperService } from './book-keeper.service';

@Module({
  imports: [KafkaModule],
  providers: [
    ExchangeHandlerService,
    ExchangeListenerService,
    BookKeeperService,
  ],
})
export class BooKeeperModule {}
