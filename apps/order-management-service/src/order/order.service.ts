import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@app/infra/redis';
import { KafkaService } from '@app/infra/kafka';
import { TOPICS } from '@app/infra/kafka/topics';
import CreateOrderDto from './dto/CreateOrderDTO';
import { PrismaService } from '@app/prisma';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly kafkaService: KafkaService,
    private readonly prisma: PrismaService,
  ) {}

  async publishOrderForTrade(order: CreateOrderDto): Promise<string> {
    if (order.type === 'LIMIT' && !order.price) {
      throw new HttpException(
        'Price must be provided for LIMIT and MARKET orders',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (order.type === 'MARKET' && order.price) {
      throw new HttpException(
        'Price must not be provided for MARKET orders',
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

  async getOrdersByUser(userId: number, page = 1, limit = 10) {
    const key = `user-orders:${userId}`;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const client = this.redisService.getClient();

    let orders = await client.lRange(key, start, end);
    orders = orders.map((order) => JSON.parse(order));

    const remaining = limit - orders.length;
    if (remaining > 0) {
      const skip = Math.max(0, start - (await client.lLen(key)));
      const dbOrders = await this.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: remaining,
      });
      orders = orders.concat(dbOrders as any);
    }

    return orders;
  }
}
