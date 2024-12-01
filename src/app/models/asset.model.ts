export interface Asset {
  symbol: string;
  name: string;
  type: AssetType;
  // Data from API
  openPrice: number;
  dayHigh: number;
  dayLow: number;
  currentPrice: number;
  volume: number;
  previousClose: number;
  priceChange: number;
  priceChangePercent: number;
  marketCap: number;
  peRatio: number;
  dividendYieldPercent: number;
  beta: number;
  yearHigh: number;
  yearLow: number;
  averageVolume: number;
  sector: string;
}

export enum AssetType {
  STOCK = 'STOCK',
  BOND = 'BOND',
  COMMODITY = 'COMMODITY',
  CURRENCY = 'CURRENCY',
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AssetPortfolio {
  name: string;
  symbol: string;
  percentChange: number;
  portfolioValue: number;
  trendImageUrl: string;
}

export interface WatchlistItem {
  symbol: string;
  performance: number;
  category: string;
  trend: 'up' | 'down';
  currentPrice?: number;
}
