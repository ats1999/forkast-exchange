import { Injectable } from '@nestjs/common';
import { Kafka, KafkaMessage } from 'kafkajs';
import { OrderExchangePublisherService } from '../order-exchnage-publisher.service';

@Injectable()
export class ExchangeService {
  constructor(
    private readonly orderExchangePublisher: OrderExchangePublisherService,
  ) {}

  handleNewOrder(partition: number, message: KafkaMessage) {
    // TODO: implement the exchange logic here
  }
}
