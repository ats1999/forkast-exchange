import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { KafkaService } from '@app/infra/kafka';
import { Producer } from 'kafkajs';
import { TOPICS } from '@app/infra/kafka/topics';
import { NewOrder } from '@app/types/order/order';
import { Trade } from '@app/types/exchange/trade';

@Injectable()
export class OrderExchangePublisherService
  implements OnModuleInit, OnModuleDestroy
{
  private producer: Producer;

  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    this.producer = this.kafkaService.getProducer();
    await this.producer.connect();
  }

  async onModuleDestroy() {
    if (this.producer) {
      await this.producer.disconnect();
    }
  }

  async publishOrder(type: 'ORDER' | 'TRADE', data: NewOrder | Trade) {
    const dataToSend = {
      type,
      data,
    };

    await this.producer.send({
      topic: TOPICS.ORDER_EXCHANGE,
      messages: [
        {
          key: data.symbolId?.toString() ?? null,
          value: JSON.stringify(dataToSend),
        },
      ],
    });
  }
}
