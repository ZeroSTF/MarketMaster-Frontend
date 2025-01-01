import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { Asset } from '../models/asset.model';
import { catchError, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { MarketDataRequestDto, MarketDataResponseDto } from './game-chart.service';
import { ChartDataPoint, ChartType, Indicator } from '../models/chart.model';


interface HistoricalDataResponse {
  data: {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  symbol: string;
  timeframe: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChartService implements OnDestroy {
  private historicalDataSignal = signal<ChartDataPoint[]>([]);
  private timeframeSignal = signal<string>('D');
  private indicatorsSignal = signal<Indicator[]>([]);
  private selectedAssetSignal = signal<Asset | null>(null);
  private chartTypeSignal = signal<ChartType>('Candlestick');

  private refreshInterval: any = null;

  readonly historicalData = computed(() => this.historicalDataSignal());
  readonly timeframe = computed(() => this.timeframeSignal());
  readonly indicators = computed(() => this.indicatorsSignal());
  readonly selectedAsset = computed(() => this.selectedAssetSignal());
  readonly chartType = computed(() => this.chartTypeSignal());

  private readonly apiUrl = environment.flaskUrl;
  private readonly apiUrl1 = environment.apiUrl;


  constructor(private http: HttpClient) {}

  async loadHistoricalData(symbol: string) {
    try {
      const timeframe = this.timeframeSignal();
      const response = await firstValueFrom(
        this.http
          .get<HistoricalDataResponse>(
            `${this.apiUrl}/api/assets/${symbol}/history?timeframe=${timeframe}`
          )
          .pipe(
            catchError((error: HttpErrorResponse) => {
              console.error('API Error:', error);
              throw new Error(error.message);
            })
          )
      );

      if (response?.data) {
        const transformedData = response.data.map((d: any) => ({
          time: new Date(d.time * 1000).getTime() / 1000,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
        }));
        this.updateHistoricalData(transformedData);
      }
    } catch (error) {
      console.error('Error loading historical data:', error);
      throw error;
    }
  }

  updateHistoricalData(data: ChartDataPoint[]) {
    console.log('updateHistoricalData', data);
    this.historicalDataSignal.set(data);
  }

  addNewDataPoint(point: ChartDataPoint) {
    this.historicalDataSignal.update((current) => {
      const newData = [...current];
      const lastIndex = newData.length - 1;

      // If we have a point for this timestamp, update it
      if (lastIndex >= 0 && newData[lastIndex].time === point.time) {
        newData[lastIndex] = point;
      } else {
        // Otherwise add new point
        newData.push(point);
      }

      return newData;
    });
  }

  setTimeframe(timeframe: string) {
    this.timeframeSignal.set(timeframe);
    const currentSymbol = this.selectedAssetSignal()?.symbol;
    if (currentSymbol) {
      this.setupDataRefresh(currentSymbol);
    }
  }

  addIndicator(indicator: Indicator) {
    this.indicatorsSignal.update((current) => [...current, indicator]);
  }

  removeIndicator(indicator: Indicator) {
    this.indicatorsSignal.update((current) =>
      current.filter((ind) => ind.type !== indicator.type)
    );
  }

  setSelectedAsset(asset: Asset): void {
    this.selectedAssetSignal.set(asset);
    this.setupDataRefresh(asset.symbol);
  }

  setChartType(type: ChartType) {
    this.chartTypeSignal.set(type);
  }

  setupDataRefresh(symbol: string) {
    this.clearDataRefresh();

    if (this.timeframeSignal() === '1') {
      this.refreshInterval = setInterval(() => {
        this.loadHistoricalData(symbol);
      }, 60000);
    }
  }

  clearDataRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.clearDataRefresh();
  }

  async fetchGameMarketData(gameId: number, assetSymbol: string, lastPauseTimestamp: string) {
    try {
      const request: MarketDataRequestDto = { gameId, assetSymbol, lastPauseTimestamp };
      const response = await firstValueFrom(
        this.http
          .post<MarketDataResponseDto>(`${this.apiUrl1}/games/market-data`, request)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              console.error('API Error:', error.message);
              throw new Error(error.message);
            })
          )
      );

      // Process the past and upcoming market data
      if (response?.pastMarketData?.length) {
        const transformedPastData = response.pastMarketData.map((data) => ({
          time: new Date(data.timestamp).getTime() / 1000,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
          volume: data.volume,
        }));
        this.updateHistoricalData(transformedPastData);
      }

      if (response?.upcomingMarketData?.length) {
        // Optionally, handle upcoming data (e.g., store in a signal or use it for predictions)
        console.log('Upcoming Market Data:', response.upcomingMarketData);
      }
    } catch (error) {
      console.error('Error fetching game market data:', error);
    }
  }
}
