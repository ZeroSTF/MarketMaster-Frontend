export interface Stock {
    symbol: string;
    price: number;
    volume: number;
    marketCap: number;
    peRatio: number;
    dividendYield: number;
    sector: string;
    trendDirection: 'up' | 'down';
    logoUrl: string;
  }