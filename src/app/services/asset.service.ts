import { computed, Injectable, signal } from '@angular/core';
import {
  Asset,
  AssetPortfolio,
  PageResponse,
  WatchlistItem,
} from '../models/asset.model';
import { environment } from '../../environments/environment';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { StockPredictionResponse } from '../models/StockPredictionResponse.model';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private selectedAssetSignal = signal<Asset | null>(null);
  private watchlistSignal = signal<any[]>([]);
  private bestWinnersSignal = signal<any[]>([]);
  private userAssetsSignal = signal<AssetPortfolio[]>([]);
  private assetsSignal = signal<Asset[]>([]);

  readonly selectedAsset = computed(() => this.selectedAssetSignal());
  readonly watchlist = computed(() => this.watchlistSignal());
  readonly bestWinners = computed(() => this.bestWinnersSignal());
  readonly userAssets = computed(() => this.userAssetsSignal());
  readonly assets = computed(() => this.assetsSignal());
  private readonly apiFlask = `${environment.flaskUrl}`;
  private readonly apiUrl = `${environment.apiUrl}/asset`;
  private readonly apiUrl1 = `${environment.apiUrl}/portf`;
  socket: Socket;

  constructor(private http: HttpClient) {
    // Initialize Socket.IO connection
    this.socket = io(environment.flaskUrl);
    // Listen for real-time updates
    this.socket.on('asset_update', (data: Asset) => {
      console.log('Real-time update:', data);
      this.updateAssetData(data);
    });
  }
  getAssetMetrics(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.apiFlask}/api/assets/${symbol}/metrics`).pipe(
      catchError((error) => {
        console.error('Error fetching asset metrics:', error);
        return of(null);
      })
    );
  }
  getAllWatchList(page: number = 0, size: number = 20, username: string): void {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    this.http
      .get<PageResponse<WatchlistItem>>(`${this.apiUrl1}/watchlist/${username}`, { params })
      .subscribe({
        next: (response) => {
          console.log('API Response:', response.content);
          this.watchlistSignal.set(response.content);
        },
        error: (error) => {
          console.error(`Error fetching watchlist for username "${username}":`, error);
        },
      });
  }

  // Get paginated asset data
  getAllAssets(page: number = 0, size: number = 20): void {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    this.http
      .get<PageResponse<Asset>>(`${this.apiUrl}/getAll`, { params })
      .subscribe((response) => {
        // Update signals with new data
        this.assetsSignal.set(response.content);
      });
  }

  predictStock(symbol: string, train: boolean): Observable<StockPredictionResponse> {
    return this.http.post<StockPredictionResponse>(`${this.apiUrl}/predict`, { symbol, train });
  }
  // Update individual asset data
  private updateAssetData(updatedAsset: Asset) {
    this.assetsSignal.update((current) => {
      const index = current.findIndex(
        (asset) => asset.symbol === updatedAsset.symbol
      );
      if (index !== -1) {
        const updated = [...current];
        updated[index] = { ...current[index], ...updatedAsset };
        return updated;
      }
      return current;
    });
    // Update selected asset if it matches
    if (this.selectedAsset()?.symbol === updatedAsset.symbol) {
      this.selectedAssetSignal.update((current) => ({
        ...current!,
        ...updatedAsset,
      }));
    }
    // Update watchlist if asset is in watchlist
    this.watchlistSignal.update((current) => {
      const index = current.findIndex(
        (item) => item.symbol === updatedAsset.symbol
      );
      if (index !== -1) {
        const updated = [...current];
        updated[index] = {
          ...current[index],
          currentPrice: updatedAsset.currentPrice,
        };
        return updated;
      }
      return current;
    });
  }
  private updateWatchlist(updatedAsset: Asset): void {
    this.watchlistSignal.update((current) => {
      const index = current.findIndex((item) => item.symbol === updatedAsset.symbol);
      if (index !== -1) {
        const updated = [...current];
        updated[index] = {
          ...current[index],
          currentPrice: updatedAsset.currentPrice,
          trend: updatedAsset.priceChange > 0 ? 'up' : 'down',
        };
        return updated;
      }
      return current;
    });
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  setSelectedAsset(asset: Asset): void {
    this.selectedAssetSignal.set(asset);
  }
}