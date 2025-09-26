import { Injectable } from '@nestjs/common';
import { KafkaMessage } from 'kafkajs';
import { ExchangeMessage } from './types/exchange.message';
import { BookKeeperService } from '../book-keeper/book-keeper.service';
import { TradeExecutionService } from '../trade/trade-execution.service';
import { Trade } from '@app/types/exchange/trade';

@Injectable()
export class ExchangeHandlerService {
  constructor(
    private readonly bookKeeperService: BookKeeperService,
    private readonly tradeExecutionService: TradeExecutionService,
  ) {}
  async handleExchangeBatch(
    messages: { partition: number; message: KafkaMessage }[],
  ) {
    const validMessages = messages.filter((msg) => !!msg.message);
    if (!validMessages.length) {
      return;
    }

    const trades: Trade[] = [] as Trade[];

    messages.forEach((msg) => {
      const value = msg.message.value!?.toString();
      const exchangeMessage: ExchangeMessage = JSON.parse(value);
      this.bookKeeperService.handleExchange(exchangeMessage);

      if (exchangeMessage.type === 'TRADE') {
        trades.push(exchangeMessage.data as Trade);
      }
    });

    this.tradeExecutionService.performTradeExecution(trades);
  }
}
