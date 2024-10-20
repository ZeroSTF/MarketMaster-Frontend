export interface Asset {
  symbol: string;
  open: number;
  high: number;
  low: number;
  price: number;
  volume: number;
  latestTradingDay: string;
  previousClose: number;
  change: number;
  changePercent: string;





  


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
  }