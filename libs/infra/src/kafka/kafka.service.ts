import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private defaultConsumer: Consumer;
  private readonly logger = new Logger(KafkaService.name);

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'forkast-exchange',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });

    this.producer = this.kafka.producer();

    this.defaultConsumer = this.kafka.consumer({
      groupId: process.env.KAFKA_CONSUMER_GROUP || 'forkast-exchange-group',
    });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.defaultConsumer.connect();
    this.logger.log('Kafka producer and default consumer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.defaultConsumer.disconnect();
    this.logger.log('Kafka producer and consumer disconnected');
  }

  getProducer(): Producer {
    return this.producer;
  }

  getConsumer(groupId?: string): Consumer {
    if (!groupId) {
      return this.defaultConsumer;
    }
    return this.kafka.consumer({ groupId });
  }
}
