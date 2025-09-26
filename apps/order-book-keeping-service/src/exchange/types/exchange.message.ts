import { Trade } from '@app/types/exchange/trade';
import { NewOrder } from '@app/types/order/order';

export interface ExchangeMessage {
  type: 'ORDER' | 'TRADE';
  data: NewOrder | Trade;
}
