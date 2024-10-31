import { Injectable, signal, computed } from '@angular/core';

interface ChartDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private historicalDataSignal = signal<ChartDataPoint[]>([]);
  private timeframeSignal = signal<string>('1D');
  private indicatorsSignal = signal<string[]>([]);

  readonly historicalData = computed(() => this.historicalDataSignal());
  readonly timeframe = computed(() => this.timeframeSignal());
  readonly indicators = computed(() => this.indicatorsSignal());

  updateHistoricalData(data: ChartDataPoint[]) {
    this.historicalDataSignal.set(data);
  }

  setTimeframe(timeframe: string) {
    this.timeframeSignal.set(timeframe);
  }

  addIndicator(indicator: string) {
    this.indicatorsSignal.update(current => [...current, indicator]);
  }

  removeIndicator(indicator: string) {
    this.indicatorsSignal.update(current => 
      current.filter(ind => ind !== indicator)
    );
  }
}