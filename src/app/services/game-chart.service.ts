import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, firstValueFrom } from 'rxjs';
import { Asset } from '../models/asset.model';
import { ChartType, Indicator } from '../models/chart.model';

export interface MarketDataStreamDto {
  timestamp: string;
  assetSymbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketDataResponseDto {
  pastMarketData: MarketDataStreamDto[];
  upcomingMarketData: MarketDataStreamDto[];
}

export interface MarketDataRequestDto {
  gameId: number;
  assetSymbol: string;
  lastPauseTimestamp: string; // ISO string format
}

interface ChartDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

@Injectable({
  providedIn: 'root',
})
export class GameChartService implements OnDestroy {
  private pastDataSignal = signal<ChartDataPoint[]>([]);
  private upcomingDataSignal = signal<MarketDataStreamDto[]>([]);
  private selectedAssetSignal = signal<Asset | null>(null);
  private indicatorsSignal = signal<Indicator[]>([]);
  private chartTypeSignal = signal<ChartType>('Candlestick');
  private timeframeSignal = signal<string>('D');

  private refreshInterval: any = null;

  readonly pastData = computed(() => this.pastDataSignal());
  readonly upcomingData = computed(() => this.upcomingDataSignal());
  readonly selectedAsset = computed(() => this.selectedAssetSignal());
  readonly indicators = computed(() => this.indicatorsSignal());
  readonly chartType = computed(() => this.chartTypeSignal());
  readonly timeframe = computed(() => this.timeframeSignal());

  private readonly apiUrl = `${environment.apiUrl}/games/market-data`;

  constructor(private http: HttpClient) {}

  async loadMarketData(gameId: number, assetSymbol: string, lastPauseTimestamp: string): Promise<void> {
    const payload: MarketDataRequestDto = { gameId, assetSymbol, lastPauseTimestamp };
    try {
      const response = await firstValueFrom(
        this.http
          .post<MarketDataResponseDto>(this.apiUrl, payload)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              console.error('API Error:', error);
              throw new Error(error.message);
            })
          )
      );

      if (response) {
        const pastData = response.pastMarketData.map((d) => ({
          time: new Date(d.timestamp).getTime() / 1000,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
        }));
        this.pastDataSignal.set(pastData);
        this.scheduleUpcomingData(response.upcomingMarketData);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }

  private scheduleUpcomingData(upcomingData: MarketDataStreamDto[]): void {
    this.upcomingDataSignal.set(upcomingData);

    upcomingData.forEach((data) => {
      const delay = new Date(data.timestamp).getTime() - Date.now();
      if (delay > 0) {
        setTimeout(() => this.addDataPoint(data), delay);
      }
    });
  }

  private addDataPoint(dataPoint: MarketDataStreamDto): void {
    const chartDataPoint: ChartDataPoint = {
      time: new Date(dataPoint.timestamp).getTime() / 1000,
      open: dataPoint.open,
      high: dataPoint.high,
      low: dataPoint.low,
      close: dataPoint.close,
      volume: dataPoint.volume,
    };
    this.pastDataSignal.update((current) => [...current, chartDataPoint]);
  }

  setSelectedAsset(asset: Asset): void {
    this.selectedAssetSignal.set(asset);
    this.setupDataRefresh(asset.symbol);
  }

  setChartType(type: ChartType): void {
    this.chartTypeSignal.set(type);
  }

  setTimeframe(timeframe: string): void {
    this.timeframeSignal.set(timeframe);
  }

  addIndicator(indicator: Indicator): void {
    this.indicatorsSignal.update((current) => [...current, indicator]);
  }

  removeIndicator(indicator: Indicator): void {
    this.indicatorsSignal.update((current) =>
      current.filter((ind) => ind.type !== indicator.type)
    );
  }

  private setupDataRefresh(symbol: string): void {
    this.clearDataRefresh();

    if (this.timeframeSignal() === '1') {
      this.refreshInterval = setInterval(() => {
        const asset = this.selectedAssetSignal();
        if (asset) {
          this.loadMarketData(7, asset.symbol, '');
        }
      }, 60000);
    }
  }

  private clearDataRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.clearDataRefresh();
  }
}
