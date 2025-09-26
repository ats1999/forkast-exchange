import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '@app/infra/kafka';
import { TOPICS } from '@app/infra/kafka/topics';
import { Consumer } from 'kafkajs';
import { OrderHandlerService } from './order-handler.service';

@Injectable()
export class OrderListenerService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly orderHandler: OrderHandlerService,
  ) {}

  async onModuleInit() {
    this.consumer = this.kafkaService.getConsumer();
    await this.consumer.subscribe({
      topic: TOPICS.NEW_ORDER,
      fromBeginning: true,
    });

    this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.orderHandler.handleNewOrder(partition, message);
      },
    });
  }

  async onModuleDestroy() {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }
}
