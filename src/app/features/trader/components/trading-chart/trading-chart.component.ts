import {
  Component,
  OnDestroy,
  effect,
  input,
  signal,
  computed,
  inject,
  ViewChild,
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
  TVChartDirective,
  TVLineChartDirective,
} from 'ngx-lightweight-charts';

import { Asset } from '../../../../models/asset.model';
import { ChartService } from '../../../../services/chart.service';
import {
  DarkModeService,
  AppTheme,
} from '../../../../services/dark-mode.service';
import { ChartIndicatorsDirective } from '../../../../utils/chart-indicators.directive';

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
    TVLineChartDirective,
    ChartIndicatorsDirective,
  ],
  templateUrl: './trading-chart.component.html',
  styleUrl: './trading-chart.component.scss',
})
export class TradingChartComponent implements OnDestroy {
  @ViewChild(ChartIndicatorsDirective)
  chartIndicatorsDirective!: ChartIndicatorsDirective;

  chartService = inject(ChartService);
  private darkModeService = inject(DarkModeService);

  asset = input.required<Asset>();
  volumeData = signal<any[]>([]);
  selectedTimeframe = signal<string>('D');
  crosshairPosition = signal<{ x: number; y: number } | null>(null);
  currentCrosshairData = signal<any>(null);

  // Loading states
  isLoading = signal<boolean>(false);
  loadingError = signal<string | null>(null);

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

  // Main Chart options, computed based on theme
  chartOptions = computed(() => {
    const isDark = this.darkModeService.currentTheme() === AppTheme.DARK;
    return {
      layout: {
        background: { color: isDark ? '#111827' : '#ffffff' },
        textColor: isDark ? '#e0e0e0' : '#333',
        attributionLogo: false,
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

  // Volume chart options, computed based on the main chart options
  volumeOptions = computed(() => ({
    ...this.chartOptions(),
    height: 200,
  }));

  // Baseline series options
  baselineSeriesOptions = {
    baseValue: {
      price: 100,
    },
  };

  constructor() {
    effect(
      () => {
        const currentAsset = this.asset();
        if (currentAsset) {
          this.loadChartData(currentAsset.symbol);
        }
      },
      { allowSignalWrites: true }
    );
  }

  async loadChartData(symbol: string) {
    this.isLoading.set(true);
    this.loadingError.set(null);

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
      this.loadingError.set(
        error instanceof Error ? error.message : 'Failed to load chart data'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  onCrosshairData(data: any) {
    if (!data || Object.keys(data).length === 0) {
      this.currentCrosshairData.set(null);
      return;
    }

    const currentTime = data['main-chart']?.time;
    if (!currentTime) {
      this.currentCrosshairData.set(null);
      return;
    }

    const crosshairDataWithIndicators = { ...data };
    if (this.chartIndicatorsDirective) {
      try {
        const indicatorValues =
          this.chartIndicatorsDirective.getIndicatorValues();
        crosshairDataWithIndicators.indicators = {};

        if (Object.keys(indicatorValues).length > 0) {
          Object.entries(indicatorValues).forEach(([indicatorName, values]) => {
            const matchingValue = values.find((v) => v.time === currentTime);
            if (matchingValue) {
              crosshairDataWithIndicators.indicators[indicatorName] =
                matchingValue.value;
            }
          });
        }
      } catch (error) {
        console.error('Error processing indicator values:', error);
      }
    }

    if (Object.keys(crosshairDataWithIndicators).length > 0) {
      this.currentCrosshairData.set(crosshairDataWithIndicators);
    } else {
      this.currentCrosshairData.set(null);
    }
  }

  objectEntries(obj: Record<string, any>): [string, any][] {
    return Object.entries(obj);
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
