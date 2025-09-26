import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookKeeperService } from './book-keeper/book-keeper.service';

@Controller()
export class OrderBookKeepingServiceController {
  constructor(private readonly bookKeeperService: BookKeeperService) {}

  @UseGuards(AuthGuard('basic'))
  @Get(':symbolId')
  getOrderBook(@Param('symbolId') symbolId: string) {
    return this.bookKeeperService.getOrderBook(Number(symbolId));
  }
}
