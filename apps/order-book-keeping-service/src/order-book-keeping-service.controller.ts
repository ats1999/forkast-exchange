import { Controller, Get, Param, Sse, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookKeeperService } from './book-keeper/book-keeper.service';
import { filter, interval, map, Observable } from 'rxjs';
import { Order } from '@app/types/order/order';

@Controller()
export class OrderBookKeepingServiceController {
  constructor(private readonly bookKeeperService: BookKeeperService) {}

  @UseGuards(AuthGuard('basic'))
  @Get('order-book/:symbolId')
  getOrderBook(@Param('symbolId') symbolId: string) {
    return this.bookKeeperService.getOrderBook(Number(symbolId));
  }

  @UseGuards(AuthGuard('basic'))
  @Sse('order-book/:symbolId/stream')
  streamOrderBook(
    @Param('symbolId') symbolId: string,
  ): Observable<{ data: { buy: Order[]; sell: Order[] } }> {
    const STREAM_INTERVAL = 1000;
    const symbol = Number(symbolId);
    let lastOrderBook = this.bookKeeperService.getOrderBook(symbol);

    return interval(STREAM_INTERVAL).pipe(
      map(() => this.bookKeeperService.getOrderBook(symbol)),
      filter(
        (orderBook) =>
          orderBook.orderBookSnapShotId != lastOrderBook.orderBookSnapShotId,
      ), // only emit if changed
      map((orderBook) => {
        lastOrderBook = orderBook;
        return { data: orderBook };
      }),
    );
  }
}
