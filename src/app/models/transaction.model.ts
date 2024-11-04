export interface Transaction {
    symbol: string;
    quantity: number;
    price: number;
    timeStamp: Date;
    type: TransactionType;
  }
  
  // Enum for TransactionType (based on Java enum)
  export enum TransactionType {
    BUY = 'BUY',
    SELL = 'SELL'
  }
  