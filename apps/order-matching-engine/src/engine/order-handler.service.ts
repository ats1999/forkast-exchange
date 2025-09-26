import { Injectable, Logger } from '@nestjs/common';
import { Kafka, KafkaMessage } from 'kafkajs';
import { OrderExchangePublisherService } from './order-exchnage-publisher.service';
import { ExchangeService } from './exchange/exchange.service';
import { NewOrder } from '@app/types/order/order';

@Injectable()
export class OrderHandlerService {
  private readonly logger = new Logger(OrderHandlerService.name);

  constructor(
    private readonly orderExchangePublisher: OrderExchangePublisherService,
    private readonly exchangeService: ExchangeService,
  ) {}
  async handleNewOrder(partition: number, message: KafkaMessage) {
    if (!message.value) {
      return;
    }

    const newOrder: NewOrder = JSON.parse(message.value.toString());

    this.logger.log(`Received new order: ${message.value.toString()}`);
    await this.orderExchangePublisher.publishOrder('ORDER', newOrder);
    this.exchangeService.handleNewOrder(partition, newOrder);
  }
}
