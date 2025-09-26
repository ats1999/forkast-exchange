import { SymbolId } from './symbol';
import { OrderId } from '../order/order';

export type TradeId = string;

export interface Trade {
  tradeId: TradeId;
  symbolId: SymbolId;
  price: number;
  quantity: number;
  buyOrderId: OrderId;
  sellOrderId: OrderId;
  timestamp: number;
}
