import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Asset } from '../models/asset.model';
import { catchError, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface ChartDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

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
export class ChartService {
  private historicalDataSignal = signal<ChartDataPoint[]>([]);
  private timeframeSignal = signal<string>('D');
  private indicatorsSignal = signal<string[]>([]);
  private selectedAssetSignal = signal<Asset | null>(null);

  readonly historicalData = computed(() => this.historicalDataSignal());
  readonly timeframe = computed(() => this.timeframeSignal());
  readonly indicators = computed(() => this.indicatorsSignal());
  readonly selectedAsset = computed(() => this.selectedAssetSignal());

  private readonly apiUrl = environment.flaskUrl;

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
  }

  addIndicator(indicator: string) {
    this.indicatorsSignal.update((current) => [...current, indicator]);
  }

  removeIndicator(indicator: string) {
    this.indicatorsSignal.update((current) =>
      current.filter((ind) => ind !== indicator)
    );
  }

  setSelectedAsset(asset: Asset): void {
    this.selectedAssetSignal.set(asset);
  }
}
