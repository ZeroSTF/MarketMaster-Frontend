export interface MarketDataStreamDto {
  timestamp: string; 
  assetSymbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
