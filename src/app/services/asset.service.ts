import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Asset,
  AssetPortfolio,
  PageResponse,
  WatchlistItem,
} from '../models/asset.model';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, Subject, takeUntil } from 'rxjs';
import { StockPredictionResponse } from '../models/StockPredictionResponse.model';
import { FlaskWebSocketService } from './flask-websocket.service';

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

  private readonly destroy$ = new Subject<void>();
  private webSocketService = inject(FlaskWebSocketService);

  constructor(private http: HttpClient) {
    this.webSocketService
      .getAssetUpdates()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedAsset) => {
        this.updateAssetData(updatedAsset);
      });
  }

  getAssetMetrics(symbol: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiFlask}/api/assets/${symbol}/metrics`)
      .pipe(
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
      .get<PageResponse<WatchlistItem>>(
        `${this.apiUrl1}/watchlist/${username}`,
        { params }
      )
      .subscribe({
        next: (response) => {
          console.log('API Response:', response.content);
          this.watchlistSignal.set(response.content);
        },
        error: (error) => {
          console.error(
            `Error fetching watchlist for username "${username}":`,
            error
          );
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

  predictStock(
    symbol: string,
    train: boolean,
    futureDays: number = 14
  ): Observable<StockPredictionResponse> {
    return this.http.post<StockPredictionResponse>(
      `${this.apiFlask}/api/predict/${symbol}`,
      {
        train,
        future_days: futureDays,
      }
    );
  }
  historicPrice(symbol: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiFlask}/api/assets/${symbol}/close_dates`
    );
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
      const index = current.findIndex(
        (item) => item.symbol === updatedAsset.symbol
      );
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
    this.destroy$.next();
    this.destroy$.complete();
  }

  setSelectedAsset(asset: Asset): void {
    this.selectedAssetSignal.set(asset);
  }

  getAssetRecommendations(symbol: string): Observable<{
    recommendation: { action: string; reason: string };
    symbol: string;
  }> {
    return this.http.get<{
      recommendation: { action: string; reason: string };
      symbol: string;
    }>(`${this.apiFlask}/api/assets/${symbol}/recommendations`);
  }
}
