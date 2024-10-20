import { computed, Injectable, signal } from '@angular/core';
import { Asset, AssetPortfolio, WatchlistItem } from '../models/asset.model';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';


@Injectable({
  providedIn: 'root',
})
export class AssetService {
private selectedAssetSignal = signal<Asset | null>(null);
readonly selectedAsset = computed(() => this.selectedAssetSignal()); 
  
readonly watchlist = computed(() => this.watchlistSignal());
readonly bestWinners = computed(() => this.bestWinnersSignal());
readonly userAssets = computed(() => this.userAssetsSignal());


private stompClient: Stomp.Client | null = null;
private readonly serverUrl = 'http://localhost:8081/market';
private stockDataSignal = signal<Asset[]>([]);

constructor() {
  this.connect();
}

private connect(): void {
  const socket = new SockJS(this.serverUrl);
  this.stompClient = Stomp.over(socket);
 this.stompClient.connect({}, 
    () => this.onConnect(),
    (error) => this.onError(error)
  );
}

private onConnect(): void {
  this.subscribeToStockData();
}

private subscribeToStockData(): void {
  if (!this.stompClient) {
    console.error('STOMP client not initialized.');
    return;
  }

  this.stompClient.subscribe('/topic/market', (message) => {
    this.handleMessage(message);
  });
}

private handleMessage(message: Stomp.Message): void {
  try {
    const newData: Asset[] = JSON.parse(message.body);
    this.stockDataSignal.set(newData);
  } catch (error) {
    console.error('Error parsing message:', error);
  }
}

getStockData() {
  return this.stockDataSignal.asReadonly();
}

private onError(error: string | Stomp.Frame): void {
  console.error('WebSocket Error:', error);
}

ngOnDestroy(): void {
  this.disconnect();
}

private disconnect(): void {
  if (this.stompClient) {
    this.stompClient.disconnect(() => {
      console.log('Disconnected from WebSocket');
    });
  }
}
setSelectedAsset(asset: Asset): void {
  this.selectedAssetSignal.set(asset);
}
// updateWatchlist(newWatchlist: WatchlistItem[]) {
//   this.watchlistSignal.set(newWatchlist);
// }

// updateBestWinners(newBestWinners: WatchlistItem[]) {
//   this.bestWinnersSignal.set(newBestWinners);
// }

  // Mock Data
  private watchlistSignal = signal<WatchlistItem[]| null>([
  { symbol: 'CMPA', performance: 15.2, category: 'Tech', trend: 'up' },
  { symbol: 'CMPB', performance: 8.5, category: 'Finance', trend: 'down' },
  { symbol: 'CMPA', performance: 15.2, category: 'Tech', trend: 'up' },
  { symbol: 'CMPB', performance: 8.5, category: 'Finance', trend: 'down' },
  { symbol: 'WNRB', performance: 14.3, category: 'Healthcare', trend: 'up' },
  { symbol: 'WNRA', performance: 18.7, category: 'Tech', trend: 'up' },
  { symbol: 'WNRB', performance: 14.3, category: 'Healthcare', trend: 'up' },
  
  ]);

  private bestWinnersSignal = signal<WatchlistItem[]| null>([
  { symbol: 'WNRA', performance: 18.7, category: 'Tech', trend: 'up' },
  { symbol: 'WNRB', performance: 14.3, category: 'Healthcare', trend: 'up' },
  { symbol: 'WNRA', performance: 18.7, category: 'Tech', trend: 'up' },
  ]);

  private userAssetsSignal = signal<AssetPortfolio[] | null>([
    { name: 'Apple Inc', symbol: 'AAPL', percentChange: 0.66, portfolioValue: 15215.70, trendImageUrl: 'images/upTrend.png' },
    { name: 'Microsoft Corp', symbol: 'MSFT', percentChange: -0.32, portfolioValue: 12500.50, trendImageUrl: 'images/downTrend.png' },
    { name: 'Amazon.com Inc', symbol: 'AMZN', percentChange: 1.25, portfolioValue: 9800.30, trendImageUrl: 'images/upTrend.png' },
    { name: 'Alphabet Inc', symbol: 'GOOGL', percentChange: 0.88, portfolioValue: 11300.20, trendImageUrl: 'images/upTrend.png' },
    { name: 'Meta Platforms Inc', symbol: 'META', percentChange: -0.75, portfolioValue: 8700.60, trendImageUrl: 'images/downTrend.png' },
    { name: 'Tesla Inc', symbol: 'TSLA', percentChange: 2.10, portfolioValue: 7500.40, trendImageUrl: 'images/upTrend.png' },
    { name: 'NVIDIA Corp', symbol: 'NVDA', percentChange: 1.50, portfolioValue: 10200.80, trendImageUrl: 'images/upTrend.png' },
    { name: 'JPMorgan Chase & Co', symbol: 'JPM', percentChange: -0.20, portfolioValue: 6800.90, trendImageUrl: 'images/downTrend.png' },
    { name: 'JPMorgan Chase & Co', symbol: 'JPM', percentChange: -0.20, portfolioValue: 6800.90, trendImageUrl: 'images/downTrend.png' },
    { name: 'JPMorgan Chase & Co', symbol: 'JPM', percentChange: -0.20, portfolioValue: 6800.90, trendImageUrl: 'images/downTrend.png' },
    { name: 'JPMorgan Chase & Co', symbol: 'JPM', percentChange: -0.20, portfolioValue: 6800.90, trendImageUrl: 'images/downTrend.png' },

  ])
}