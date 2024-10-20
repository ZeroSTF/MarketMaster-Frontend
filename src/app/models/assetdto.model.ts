export interface AssetDailyDto {
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
    [key: string]: string | number | undefined; // Add index signature

  }