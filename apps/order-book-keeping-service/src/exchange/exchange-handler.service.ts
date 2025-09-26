import { Injectable, Logger } from '@nestjs/common';
import { KafkaMessage } from 'kafkajs';
import { ExchangeMessage } from './types/exchange.message';
import { BookKeeperService } from '../book-keeper/book-keeper.service';

@Injectable()
export class ExchangeHandlerService {
  private readonly logger = new Logger(ExchangeHandlerService.name);

  constructor(private readonly bookKeeperService: BookKeeperService) {}
  async handleNewOrder(_partition: number, message: KafkaMessage) {
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
