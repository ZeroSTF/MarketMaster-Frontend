export interface TransactionDTO {
    symbol: string;
    quantity: number;
    price: number;
    timeStamp: Date;
    type: TransactionType;
}
export enum TransactionType {
    BUY = 'BUY',
    SELL = 'SELL'
}