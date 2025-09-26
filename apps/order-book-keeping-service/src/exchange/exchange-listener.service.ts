import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '@app/infra/kafka';
import { TOPICS } from '@app/infra/kafka/topics';
import { Consumer } from 'kafkajs';
import { ExchangeHandlerService } from './exchange-handler.service';

@Injectable()
export class ExchangeListenerService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly exchangeHandlerService: ExchangeHandlerService,
  ) {}

  async onModuleInit() {
    this.consumer = this.kafkaService.getConsumer();
    await this.consumer.subscribe({
      topic: TOPICS.ORDER_EXCHANGE,
      fromBeginning: true,
    });

    this.consumer.run({
      eachBatch: async ({ batch }) => {
        const messages = batch.messages.map((msg) => ({
          message: msg,
          partition: batch.partition,
        }));

        await this.exchangeHandlerService.handleExchangeBatch(messages);
      },
    });
  }

  async onModuleDestroy() {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }
}
