import { Injectable, Logger } from '@nestjs/common';
import { Kafka, KafkaMessage } from 'kafkajs';
import { NewOrder } from '@app/types/order/order';
import { Trade } from '@app/types/exchange/trade';
import { ExchangeMessage } from './types/exchange.message';
import { BookKeeperService } from './book-keeper.service';

@Injectable()
export class ExchangeHandlerService {
  private readonly logger = new Logger(ExchangeHandlerService.name);

  constructor(private readonly bookKeeperService: BookKeeperService) {}
  async handleNewOrder(partition: number, message: KafkaMessage) {
    if (!message.value) {
      return;
    }

    const exchangeMessage: ExchangeMessage = JSON.parse(
      message.value.toString(),
    );

    this.logger.log(`Received new order: ${message.value.toString()}`);

    this.bookKeeperService.handleExchange(exchangeMessage);
  }
}
