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
import {
  DarkModeService,
  AppTheme,
} from '../../../../services/dark-mode.service';

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
  asset = input.required<Asset>();
  candlestickData = signal<any[]>([]);
  volumeData = signal<any[]>([]);
  selectedTimeframe = signal<string>('D');
  currentCrosshairData = signal<any>(null);
  crosshairPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  chartOptions = signal({
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
  });

  volumeOptions = signal({
    ...this.chartOptions(),
    height: 200,
  });

  constructor(
    private chartService: ChartService,
    private darkModeService: DarkModeService
  ) {
    // Effect for asset changes
    effect(() => {
      const currentAsset = this.asset();
      if (currentAsset) {
        this.loadChartData(currentAsset.symbol);
      }
    });

    // Effect for theme changes
    effect(() => {
      const isDark = this.darkModeService.currentTheme() === AppTheme.DARK;
      this.updateChartTheme(isDark);
    });
  }

  private updateChartTheme(isDark: boolean) {
    console.log('updateChartTheme');
    const newOptions = {
      layout: {
        background: { color: isDark ? '#1e1e1e' : '#ffffff' },
        textColor: isDark ? '#e0e0e0' : '#333',
      },
      grid: {
        vertLines: { color: isDark ? '#2d2d2d' : '#f0f0f0' },
        horzLines: { color: isDark ? '#2d2d2d' : '#f0f0f0' },
      },
      rightPriceScale: {
        borderVisible: false,
        textColor: isDark ? '#e0e0e0' : '#333',
      },
      timeScale: {
        borderVisible: false,
        textColor: isDark ? '#e0e0e0' : '#333',
      },
    };

    this.chartOptions.set(newOptions);
    this.volumeOptions.set({
      ...newOptions,
      height: 200,
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

      this.candlestickData.set(
        historicalData.map((d) => ({
          time: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }))
      );

      this.volumeData.set(
        historicalData.map((d) => ({
          time: d.time,
          value: d.volume,
          color:
            d.close >= d.open
              ? this.darkModeService.currentTheme() === AppTheme.DARK
                ? '#2e7d32'
                : '#26a69a'
              : this.darkModeService.currentTheme() === AppTheme.DARK
              ? '#c62828'
              : '#ef5350',
        }))
      );
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  }

  onCrosshairData(data: any) {
    this.currentCrosshairData.set(data);
  }

  onChartMouseMove(event: MouseEvent) {
    this.crosshairPosition.set({
      x: event.clientX,
      y: event.clientY,
    });
  }

  formatPrice(price: number): string {
    return price?.toFixed(2) ?? '-';
  }

  formatVolume(volume: number): string {
    return volume?.toLocaleString() ?? '-';
  }

  ngOnDestroy() {}
}
