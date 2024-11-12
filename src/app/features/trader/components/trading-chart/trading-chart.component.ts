// trading-chart.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  effect,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TVCandleStickChartComponent,
  TVHistogramChartComponent,
  TVChartCollectorDirective,
  TVChartSyncDirective,
  TVChartCrosshairDataDirective,
  TVChartGroupDirective,
} from 'ngx-lightweight-charts';

import { Asset } from '../../../../models/asset.model';
import { ChartService } from '../../../../services/chart.service';

@Component({
  selector: 'app-trading-chart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TVCandleStickChartComponent,
    TVHistogramChartComponent,
    TVChartCollectorDirective,
    TVChartSyncDirective,
    TVChartCrosshairDataDirective,
    TVChartGroupDirective,
  ],
  templateUrl: './trading-chart.component.html',
  styleUrl: './trading-chart.component.scss',
})
export class TradingChartComponent implements OnInit, OnDestroy {
  // Input for the asset
  asset = input.required<Asset>();

  // Signals for chart data
  candlestickData = signal<any[]>([]);
  volumeData = signal<any[]>([]);
  selectedTimeframe = signal<string>('D');
  currentCrosshairData = signal<any>(null);

  // Chart options
  mainChartOptions = {
    layout: {
      background: { color: '#ffffff' },
      textColor: '#333',
    },
    grid: {
      vertLines: { color: '#f0f0f0' },
      horzLines: { color: '#f0f0f0' },
    },
    rightPriceScale: {
      borderVisible: false,
    },
    timeScale: {
      borderVisible: false,
    },
  };

  volumeChartOptions = {
    ...this.mainChartOptions,
    height: 200,
  };

  constructor(private chartService: ChartService) {
    // Effect to handle asset changes
    effect(() => {
      const currentAsset = this.asset();
      if (currentAsset) {
        this.loadChartData(currentAsset.symbol);
      }
    });
  }

  ngOnInit() {
    const initialAsset = this.asset();
    if (initialAsset) {
      this.loadChartData(initialAsset.symbol);
    }
  }

  async loadChartData(symbol: string) {
    try {
      await this.chartService.loadHistoricalData(symbol);
      const historicalData = this.chartService.historicalData();

      // Transform data for candlestick chart
      this.candlestickData.set(
        historicalData.map((d) => ({
          time: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }))
      );

      // Transform data for volume chart
      this.volumeData.set(
        historicalData.map((d) => ({
          time: d.time,
          value: d.volume,
          color: d.close >= d.open ? '#26a69a' : '#ef5350',
        }))
      );
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  }

  onCrosshairData(data: any) {
    this.currentCrosshairData.set(data);
  }

  formatPrice(price: number): string {
    return price?.toFixed(2) ?? '-';
  }

  formatVolume(volume: number): string {
    return volume?.toLocaleString() ?? '-';
  }

  ngOnDestroy() {
    // Cleanup if needed
  }
}
