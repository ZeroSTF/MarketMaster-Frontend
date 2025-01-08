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

import { Asset } from '../../../../../../models/asset.model';
import { ChartService } from '../../../../../../services/chart.service';
import {
  DarkModeService,
  AppTheme,
} from '../../../../../../services/dark-mode.service';
import { ChartIndicatorsDirective } from '../../../../../../utils/chart-indicators.directive';
import { Store } from '@ngrx/store';
import { selectGameData, selectGameState } from '../../../../../../store/actions/game.selectors';

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

  constructor(private store: Store) {
    effect(
      () => {
        // Subscribe to the relevant game state and current simulation time using selectors
        this.store
          .select(selectGameState)
          .subscribe((gameState) => {
            console.log('GameState:', gameState);
            if (gameState?.gameState && gameState.currentSimulationTime) {
              const gameId = gameState.gameState.gameMetadata.id; 
              const lastPauseTimestamp = gameState.currentSimulationTime; 

              console.log(
                `Loading chart data for ${this.asset()?.symbol} with last pause timestamp ${lastPauseTimestamp}...`
              );

              const currentAsset = this.asset();
              if (currentAsset) {
                this.loadChartData(currentAsset.symbol, gameId, lastPauseTimestamp);
              }
            }
          });
      },
      { allowSignalWrites: true }
    );
  }
  
  

  async loadChartData(symbol: string, gameId: number, lastPauseTimestamp: string) {
    console.log(
      `Loading chart data for ${symbol} with last pause timestamp ${lastPauseTimestamp}...`
    );
    this.isLoading.set(true);
    this.loadingError.set(null);

    try {
      const formattedTimestamp = new Date(lastPauseTimestamp).toISOString();

      // Fetch game-specific market data
      await this.chartService.fetchGameMarketData(gameId, symbol, formattedTimestamp);
      const historicalData = this.chartService.historicalData(); // Data updated by the service
      const isDark = this.darkModeService.currentTheme() === AppTheme.DARK;

      console.log('Historical data:', historicalData);

      // Set candlestick data
      this.candlestickData.set(
        historicalData.map((d) => ({
          time: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }))
      );

      console.log('Candlestick data:', this.candlestickData());


      // Set volume data
      this.volumeData.set(
        historicalData.map((d) => ({
          time: d.time,
          value: d.volume,
          color:
            d.close >= d.open
              ? isDark
                ? '#2e7d32' // Green for positive changes in dark mode
                : '#26a69a' // Green for positive changes in light mode
              : isDark
              ? '#c62828' // Red for negative changes in dark mode
              : '#ef5350', // Red for negative changes in light mode
        }))
      );

      console.log('Volume data:', this.volumeData());
    } catch (error) {
      console.error('Error loading chart data:', error);
      this.loadingError.set(
        error instanceof Error ? error.message : 'Failed to load chart data'
      );
    } finally {
      console.log('Loading chart data complete.');
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
