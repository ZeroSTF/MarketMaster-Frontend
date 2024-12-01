export interface LimitOrder {
    symbol: string;
    quantity: number;
    limitPrice: number;
    type: TransactionType;
    status: OrderStatus;
  }
  
  // Enum for TransactionType (based on Java enum)
  export enum TransactionType {
    BUY = 'BUY',
    SELL = 'SELL'
  }
  export enum OrderStatus {
    PENDING = 'PENDING',
    EXECUTED = 'EXECUTED',
    CANCELLED = 'CANCELLED'
  }
 