import { SymbolId } from '../exchange/symbol';

export type OrderId = string;

export type OrderSide = 'BUY' | 'SELL';

export type OrderStatus =
  | 'PENDING'
  | 'PARTIALLY_FILLED'
  | 'FILLED'
  | 'CANCELLED';

export type OrderType = 'MARKET' | 'LIMIT';

export interface Order {
  id: OrderId;
  userId: number;
  symbolId: SymbolId;
  type: OrderType;
  price?: number;
  quantity: number;
  filledQuantity: number;
  status: OrderStatus;
  side: OrderSide;
}

export interface NewOrder {
  symbolId: SymbolId;
  type: OrderType;
  quantity: number;
  side: OrderSide;
  userId: number;
  id: OrderId;
  price?: number;
}
