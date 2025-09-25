import { Injectable } from '@nestjs/common';
import { KafkaMessage } from 'kafkajs';
import { OrderExchangePublisherService } from '../order-exchnage-publisher.service';
import { Order } from '@app/types/order/order';
import { Trade } from '@app/types/exchange/trade';

const buyOrderBooks: Map<number, Order[]> = new Map();
const sellOrderBooks: Map<number, Order[]> = new Map();

function buyOrderComparator(order1: Order, order2: Order) {
  if (order1.price === null && order2.price === null) return 0;
  if (order1.price === null) return -1;
  if (order2.price === null) return 1;
  return order2.price! - order1.price!;
}

function sellOrderComparator(order1: Order, order2: Order) {
  if (order1.price === null && order2.price === null) return 0;
  if (order1.price === null) return -1;
  if (order2.price === null) return 1;
  return order1.price! - order2.price!;
}

@Injectable()
export class ExchangeService {
  constructor(
    private readonly orderExchangePublisher: OrderExchangePublisherService,
  ) {}

  // TODO: user can not buy his own sell orders and vice versa
  handleNewOrder(partition: number, message: KafkaMessage) {
    console.log(`Received message on partition ${partition}: ${message.value}`);
    if (!message.value) return;
    const order: Order = JSON.parse(message.value!.toString());
    this.addOrder(order);

    // errors can be retried in production and logged to a centralized system
    this.matchOrders(order.symbolId).catch(console.error);
  }

  private addOrder(order: Order) {
    // Get or create the order book for this symbol
    const buyOrders = buyOrderBooks.get(order.symbolId) || [];
    const sellOrders = sellOrderBooks.get(order.symbolId) || [];

    if (order.side === 'BUY') {
      buyOrders.push({ ...order });
      buyOrders.sort(buyOrderComparator);
      buyOrderBooks.set(order.symbolId, buyOrders);
    } else {
      sellOrders.push({ ...order });
      sellOrders.sort(sellOrderComparator);
      sellOrderBooks.set(order.symbolId, sellOrders);
    }
  }

  private async matchOrders(symbolId: number) {
    const buyOrders = buyOrderBooks.get(symbolId);
    const sellOrders = sellOrderBooks.get(symbolId);

    if (!buyOrders || !sellOrders) return;

    while (buyOrders.length && sellOrders.length) {
      const buy = buyOrders[0];
      const sell = sellOrders[0];

      const isBuyMarket = buy.type === 'MARKET';
      const isSellMarket = sell.type === 'MARKET';

      if (isBuyMarket || isSellMarket || buy.price! >= sell.price!) {
        const quantity = Math.min(buy.quantity, sell.quantity);

        const tradePrice =
          isBuyMarket && !isSellMarket
            ? sell.price!
            : !isBuyMarket && isSellMarket
              ? buy.price!
              : sell.price!;

        // using dynamic import due to ESM restriction
        // UUID will be loaded only once
        const { v4: uuidv4 } = await import('uuid');

        const trade: Trade = {
          tradeId: uuidv4(),
          symbolId: symbolId,
          price: tradePrice,
          quantity,
          buyOrderId: buy.id,
          sellOrderId: sell.id,
          timestamp: Date.now(),
        };

        // Debug log (remove in prod)
        console.log('Trade executed:', trade);

        await this.orderExchangePublisher.publishOrder('TRADE', trade);

        buy.quantity -= quantity;
        sell.quantity -= quantity;

        if (buy.quantity === 0) buyOrders.shift();
        if (sell.quantity === 0) sellOrders.shift();
      } else {
        break;
      }
    }
  }
}
