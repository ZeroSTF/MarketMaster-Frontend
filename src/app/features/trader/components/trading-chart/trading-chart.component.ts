import {
  Component,
  OnDestroy,
  effect,
  input,
  signal,
  computed,
  inject,
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
  TVBaselineChartComponent,
  TVAreaChartComponent,
  TVBarChartDirective,
  TVChartDirective,
} from 'ngx-lightweight-charts';

import { Asset } from '../../../../models/asset.model';
import { ChartService } from '../../../../services/chart.service';
import {
  DarkModeService,
  AppTheme,
} from '../../../../services/dark-mode.service';
import { IndicatorUtils } from '../../../../utils/indicators.utils';

@Component({
  selector: 'app-trading-chart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TVCandleStickChartComponent,
    TVChartCollectorDirective,
    TVChartSyncDirective,
    TVChartCrosshairDataDirective,
    TVChartGroupDirective,
    TVChartDirective,
    TVHistogramChartComponent,
    TVAreaChartComponent,
    TVBaselineChartComponent,
  ],
  templateUrl: './trading-chart.component.html',
  styleUrl: './trading-chart.component.scss',
})
export class TradingChartComponent implements OnDestroy {
  asset = input.required<Asset>();
  volumeData = signal<any[]>([]);
  selectedTimeframe = signal<string>('D');
  crosshairPosition = signal<{ x: number; y: number } | null>(null);
  chartService = inject(ChartService);
  currentCrosshairData = signal<any>(null);
  indicatorData = signal<Map<string, any[]>>(new Map());

  // Chart data, computed based on selected timeframe
  candlestickData = signal<any[]>([]);
  lineChartData = computed(() => {
    return this.candlestickData().map((d) => ({
      time: d.time,
      value: d.close,
    }));
  });

  baselineChartData = computed(() => {
    return this.candlestickData().map((d) => ({
      time: d.time,
      value: d.close,
      baseline: d.open,
    }));
  });

  areaChartData = computed(() => {
    return this.candlestickData().map((d) => ({
      time: d.time,
      value: d.close,
    }));
  });

  // Indicator data, computed based on selected indicators
  smaData = computed(() => {
    const data = this.candlestickData();
    return data.length ? IndicatorUtils.calculateSMA(data, 20) : [];
  });

  rsiData = computed(() => {
    const data = this.candlestickData();
    return data.length ? IndicatorUtils.calculateRSI(data, 14) : [];
  });

  macdData = computed(() => {
    const data = this.candlestickData();
    return data.length ? IndicatorUtils.calculateMACD(data) : [];
  });

  bbData = computed(() => {
    const data = this.candlestickData();
    return data.length ? IndicatorUtils.calculateBollingerBands(data) : [];
  });

  // Chart options, computed based on theme
  chartOptions = computed(() => {
    const isDark = this.darkModeService.currentTheme() === AppTheme.DARK;
    return {
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
  });

  volumeOptions = computed(() => ({
    ...this.chartOptions(),
    height: 200,
  }));

  constructor(private darkModeService: DarkModeService) {
    effect(() => {
      const currentAsset = this.asset();
      if (currentAsset) {
        this.loadChartData(currentAsset.symbol);
      }
    });

    effect(() => {
      const indicators = this.chartService.indicators();
      this.updateIndicators(indicators);
    });
  }

  async loadChartData(symbol: string) {
    try {
      await this.chartService.loadHistoricalData(symbol);
      const historicalData = this.chartService.historicalData();
      const isDark = this.darkModeService.currentTheme() === AppTheme.DARK;

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
              ? isDark
                ? '#2e7d32'
                : '#26a69a'
              : isDark
              ? '#c62828'
              : '#ef5350',
        }))
      );
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  }

  private updateIndicators(indicators: string[]) {
    const newData = new Map<string, any[]>();

    indicators.forEach((indicator) => {
      switch (indicator) {
        case 'MA':
          newData.set('MA', this.smaData());
          break;
        case 'RSI':
          newData.set('RSI', this.rsiData());
          break;
        case 'MACD':
          newData.set('MACD', this.macdData());
          break;
        case 'BB':
          newData.set('BB', this.bbData());
          break;
      }
    });

    this.indicatorData.set(newData);
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
