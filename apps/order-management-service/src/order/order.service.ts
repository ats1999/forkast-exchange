import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@app/infra/redis';
import { KafkaService } from '@app/infra/kafka';
import { TOPICS } from '@app/infra/kafka/topics';
import CreateOrderDto from './dto/CreateOrderDTO';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly kafkaService: KafkaService,
  ) {}

  async publishOrderForTrade(order: CreateOrderDto): Promise<string> {
    if (order.type === 'LIMIT' && !order.price) {
      throw new HttpException(
        'Price must be provided for LIMIT orders',
        HttpStatus.BAD_REQUEST,
      );
    }

    const key = `user-orders:${order.userId}`;
    await this.redisService.getClient().lPush(key, JSON.stringify(order));

    const producer = this.kafkaService.getProducer();
    await producer.send({
      topic: TOPICS.NEW_ORDER,
      messages: [{ key: String(order.symbolId), value: JSON.stringify(order) }],
    });

    this.logger.log(`Published order to Kafka: `, JSON.stringify(order));
    return order.id;
  }
}
