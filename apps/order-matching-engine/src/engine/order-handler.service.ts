import { Injectable } from '@nestjs/common';
import { Kafka, KafkaMessage } from 'kafkajs';
import { OrderExchangePublisherService } from './order-exchnage-publisher.service';
import { ExchangeService } from './exchange/exchange.service';

@Injectable()
export class OrderHandlerService {
  constructor(
    private readonly orderExchangePublisher: OrderExchangePublisherService,
    private readonly exchangeService: ExchangeService,
  ) {}
  async handleNewOrder(partition: number, message: KafkaMessage) {
    await this.orderExchangePublisher.publishOrder('ORDER', message);
    this.exchangeService.handleNewOrder(partition, message);
  }
}
