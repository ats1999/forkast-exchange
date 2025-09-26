import { Injectable, Logger } from '@nestjs/common';
import { NewOrder, Order } from '@app/types/order/order';
import { Trade } from '@app/types/exchange/trade';
import { ExchangeMessage } from './types/exchange.message';

@Injectable()
export class BookKeeperService {
  private readonly logger = new Logger(BookKeeperService.name);

  // In-memory order books per symbol
  private buyOrderBooks: Map<number, Order[]> = new Map();
  private sellOrderBooks: Map<number, Order[]> = new Map();

  constructor() {}

  public handleExchange(exchangeMessage: ExchangeMessage) {
    switch (exchangeMessage.type) {
      case 'ORDER':
        this.handleOrder(exchangeMessage.data as NewOrder);
        break;
      case 'TRADE':
        this.handleTrade(exchangeMessage.data as Trade);
        break;
      default:
        // it should never reach here
        this.logger.warn(
          `Unknown exchange message type: ${exchangeMessage.type}`,
          JSON.stringify(exchangeMessage),
        );
    }
  }

  private handleOrder(newOrder: NewOrder) {
    const order: Order = { ...newOrder, filledQuantity: 0, status: 'PENDING' };

    const book =
      newOrder.side === 'BUY' ? this.buyOrderBooks : this.sellOrderBooks;

    if (!book.has(newOrder.symbolId)) {
      book.set(newOrder.symbolId, []);
    }

    book.get(newOrder.symbolId)!.push(order);

    const comparator =
      newOrder.side === 'BUY' ? buyOrderComparator : sellOrderComparator;
    book.set(newOrder.symbolId, book.get(newOrder.symbolId)!.sort(comparator));

    this.logger.log(
      `Added ${newOrder.side} order: ${JSON.stringify(newOrder)} to order book`,
    );
  }

  private handleTrade(trade: Trade) {
    const buyBook = this.buyOrderBooks.get(trade.symbolId);
    if (buyBook) {
      const buyOrder = buyBook.find((o) => o.id === trade.buyOrderId);
      if (buyOrder) {
        buyOrder.filledQuantity += trade.quantity;
        buyOrder.status = this.getOrderStatus(
          buyOrder.quantity,
          buyOrder.filledQuantity,
        );

        if (this.shouldRemoveOrder(buyOrder.status)) {
          this.removeOrderFromBook(
            trade.symbolId,
            this.buyOrderBooks,
            trade.buyOrderId,
          );
        }
      }
    }

    const sellBook = this.sellOrderBooks.get(trade.symbolId);
    if (sellBook) {
      const sellOrder = sellBook.find((o) => o.id === trade.sellOrderId);
      if (sellOrder) {
        sellOrder.filledQuantity += trade.quantity;
        sellOrder.status = this.getOrderStatus(
          sellOrder.quantity,
          sellOrder.filledQuantity,
        );

        if (this.shouldRemoveOrder(sellOrder.status)) {
          this.removeOrderFromBook(
            trade.symbolId,
            this.sellOrderBooks,
            trade.sellOrderId,
          );
        }
      }
    }

    this.logger.log(`Processed trade: ${JSON.stringify(trade)}`);
  }

  private removeOrderFromBook(
    symbolId: number,
    book: Map<number, Order[]>,
    orderId: Order['id'],
  ) {
    const orderBook = book.get(symbolId)!;
    book.set(
      symbolId,
      orderBook.filter((o) => o.id !== orderId),
    );
  }

  private shouldRemoveOrder(orderStatus: Order['status']): boolean {
    return orderStatus === 'FILLED' || orderStatus === 'CANCELLED';
  }

  private getOrderStatus(
    quantity: number,
    filledQuantity: number,
  ): Order['status'] {
    if (filledQuantity === 0) return 'PENDING';

    return quantity === filledQuantity ? 'FILLED' : 'PARTIALLY_FILLED';
  }
  public getOrderBook(symbolId: number) {
    return {
      buy: this.buyOrderBooks.get(symbolId) || [],
      sell: this.sellOrderBooks.get(symbolId) || [],
    };
  }
}

export function buyOrderComparator(a: Order, b: Order): number {
  if (a.price === null && b.price !== null) return -1; // a is market
  if (a.price !== null && b.price === null) return 1; // b is market
  if (a.price === null && b.price === null) return 0; // both market
  return b.price! - a.price!; // higher price first
}

export function sellOrderComparator(a: Order, b: Order): number {
  if (a.price === null && b.price !== null) return -1; // a is market
  if (a.price !== null && b.price === null) return 1; // b is market
  if (a.price === null && b.price === null) return 0; // both market
  return a.price! - b.price!; // lower price first
}
