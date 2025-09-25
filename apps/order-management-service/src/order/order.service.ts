import { Injectable } from '@nestjs/common';
import { RedisService } from '@app/infra/redis';
import { KafkaService } from '@app/infra/kafka';
import { TOPICS } from '@app/infra/kafka/topics';
import CreateOrderDto from './dto/CreateOrderDTO';

@Injectable()
export class OrderService {
  constructor(
    private readonly redisService: RedisService,
    private readonly kafkaService: KafkaService,
  ) {}

  async publishOrderForTrade(order: CreateOrderDto): Promise<string> {
    const key = `user-orders:${order.userId}`;
    await this.redisService.getClient().lPush(key, JSON.stringify(order));

    const producer = this.kafkaService.getProducer();
    await producer.send({
      topic: TOPICS.NEW_ORDER,
      messages: [{ key: String(order.symbolId), value: JSON.stringify(order) }],
    });

    return order.id;
  }
}
