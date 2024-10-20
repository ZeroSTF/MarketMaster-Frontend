// export interface AssetDiscover {
//     symbol: string;
//     price: number;
//     volume: number;
//     marketCap: number;
//     peRatio: number;
//     dividendYield: number;
//     sector: string;
//     trendDirection: 'up' | 'down';
//     logoUrl: string;
//   }

  export interface AssetPortfolio {
    name: string;
    symbol: string;
    percentChange: number;
    portfolioValue: number;
    trendImageUrl: string;
  }
  export interface AssetDiscover {
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
  
  export interface WatchlistItem {
    symbol: string;
    performance: number;
    category: string;
    trend: 'up' | 'down';
  }