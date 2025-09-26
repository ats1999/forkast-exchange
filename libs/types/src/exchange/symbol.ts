export type SymbolId = number;

export interface Symbol {
  id: number;
  symbol: string; // text representation, e.g., "GOOG"
  name: string; // e.g google inc
  market: string; // e.g. BSE, NASDAQ
  currency: string; // defaults to "USD"
  createdAt: number;
  updatedAt: number;
}
