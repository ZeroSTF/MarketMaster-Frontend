export interface LimitOrder {
    symbol: string;
    quantity: number;
    limitPrice: number;
    type: TransactionType;
  }
  
  // Enum for TransactionType (based on Java enum)
  export enum TransactionType {
    BUY = 'BUY',
    SELL = 'SELL'
  }