import { computed, Injectable, signal } from '@angular/core';
import { AssetDiscover, WatchlistItem } from '../models/asset.model';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private assetsSignal =signal<AssetDiscover[]>  ([
  { symbol: 'AAPL', price: 145.00, volume: 1000000, marketCap: 2400000000000, peRatio: 28.00, dividendYield: 0.58, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo1.png' },
  { symbol: 'MSFT', price: 300.00, volume: 800000, marketCap: 2250000000000, peRatio: 35.00, dividendYield: 0.82, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
  { symbol: 'GOOGL', price: 2800.00, volume: 500000, marketCap: 1900000000000, peRatio: 29.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo3.png' },
  { symbol: 'AMZN', price: 3400.00, volume: 400000, marketCap: 1700000000000, peRatio: 60.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
  { symbol: 'JNJ', price: 160.00, volume: 700000, marketCap: 420000000000, peRatio: 20.00, dividendYield: 2.50, sector: 'health', trendDirection: 'up', logoUrl: 'images/logo3.png' },
  { symbol: 'TSLA', price: 700.00, volume: 600000, marketCap: 700000000000, peRatio: 200.00, dividendYield: 0.00, sector: 'auto', trendDirection: 'down', logoUrl: 'images/logo1.png' }
  ,{ symbol: 'AAPL', price: 145.00, volume: 1000000, marketCap: 2400000000000, peRatio: 28.00, dividendYield: 0.58, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo1.png' },
  { symbol: 'MSFT', price: 300.00, volume: 800000, marketCap: 2250000000000, peRatio: 35.00, dividendYield: 0.82, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
  { symbol: 'GOOGL', price: 2800.00, volume: 500000, marketCap: 1900000000000, peRatio: 29.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo3.png' },
  { symbol: 'AMZN', price: 3400.00, volume: 400000, marketCap: 1700000000000, peRatio: 60.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
  { symbol: 'JNJ', price: 160.00, volume: 700000, marketCap: 420000000000, peRatio: 20.00, dividendYield: 2.50, sector: 'health', trendDirection: 'up', logoUrl: 'images/logo3.png' },
  { symbol: 'TSLA', price: 700.00, volume: 600000, marketCap: 700000000000, peRatio: 200.00, dividendYield: 0.00, sector: 'auto', trendDirection: 'down', logoUrl: 'images/logo1.png' }
  ,{ symbol: 'AAPL', price: 145.00, volume: 1000000, marketCap: 2400000000000, peRatio: 28.00, dividendYield: 0.58, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo1.png' },
  { symbol: 'MSFT', price: 300.00, volume: 800000, marketCap: 2250000000000, peRatio: 35.00, dividendYield: 0.82, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
  { symbol: 'GOOGL', price: 2800.00, volume: 500000, marketCap: 1900000000000, peRatio: 29.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo3.png' },
  { symbol: 'AMZN', price: 3400.00, volume: 400000, marketCap: 1700000000000, peRatio: 60.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
  { symbol: 'JNJ', price: 160.00, volume: 700000, marketCap: 420000000000, peRatio: 20.00, dividendYield: 2.50, sector: 'health', trendDirection: 'up', logoUrl: 'images/logo3.png' },
  { symbol: 'TSLA', price: 700.00, volume: 600000, marketCap: 700000000000, peRatio: 200.00, dividendYield: 0.00, sector: 'auto', trendDirection: 'down', logoUrl: 'images/logo1.png' }

  ]);
  private watchlistSignal = signal<WatchlistItem[]>([
    { symbol: 'CMPA', performance: 15.2, category: 'Tech', trend: 'up' },
    { symbol: 'CMPB', performance: 8.5, category: 'Finance', trend: 'down' },
    { symbol: 'CMPA', performance: 15.2, category: 'Tech', trend: 'up' },
    { symbol: 'CMPB', performance: 8.5, category: 'Finance', trend: 'down' },
    { symbol: 'WNRB', performance: 14.3, category: 'Healthcare', trend: 'up' },
    { symbol: 'WNRA', performance: 18.7, category: 'Tech', trend: 'up' },
    { symbol: 'WNRB', performance: 14.3, category: 'Healthcare', trend: 'up' },
    
    ]);

  private bestWinnersSignal = signal<WatchlistItem[]>([
    { symbol: 'WNRA', performance: 18.7, category: 'Tech', trend: 'up' },
    { symbol: 'WNRB', performance: 14.3, category: 'Healthcare', trend: 'up' },
    { symbol: 'WNRA', performance: 18.7, category: 'Tech', trend: 'up' },
    ]);

  constructor() {}

  selectedAssetSignal = signal<AssetDiscover | null>(null);

  readonly assets = computed(() => this.assetsSignal());
  readonly watchlist = computed(() => this.watchlistSignal());
  readonly bestWinners = computed(() => this.bestWinnersSignal());

  getAssets() {
    return this.assetsSignal();
  }
  selectAsset(asset: AssetDiscover) {
    this.selectedAssetSignal.set(asset);
  }
  updateWatchlist(newWatchlist: WatchlistItem[]) {
    this.watchlistSignal.set(newWatchlist);
  }

  updateBestWinners(newBestWinners: WatchlistItem[]) {
    this.bestWinnersSignal.set(newBestWinners);
  }


}
