import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartService } from '../../../../services/chart.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  HistogramData,
} from 'lightweight-charts';
import { Asset } from '../../../../models/asset.model';
import { AssetSelectorComponent } from '../asset-selector/asset-selector.component';

@Component({
  selector: 'app-trading-chart',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, AssetSelectorComponent],
  templateUrl: './trading-chart.component.html',
  styleUrls: ['./trading-chart.component.scss'],
})
export class TradingChartComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  private chart?: IChartApi;
  private candlestickSeries?: ISeriesApi<'Candlestick'>;
  private volumeSeries?: ISeriesApi<'Histogram'>;
  loading = signal(false);
  error = signal<string | null>(null);

  async loadData(symbol: string) {
    try {
      this.loading.set(true);
      this.error.set(null);
      await this.chartService.loadHistoricalData(symbol);
    } catch (err) {
      this.error.set('Failed to load chart data');
    } finally {
      this.loading.set(false);
    }
  }

  constructor(private chartService: ChartService) {
    effect(() => {
      const asset = this.chartService.selectedAsset();
      if (asset) {
        this.chartService.loadHistoricalData(asset.symbol);

        this.updateChartData(asset);
      }
    });

    effect(() => {
      const historicalData = this.chartService.historicalData();
      if (this.candlestickSeries && historicalData.length > 0) {
        const candleData: CandlestickData<Time>[] = historicalData.map((d) => ({
          time: d.time as Time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));

        this.candlestickSeries.setData(candleData);

        if (this.volumeSeries) {
          const volumeData: HistogramData<Time>[] = historicalData.map((d) => ({
            time: d.time as Time,
            value: d.volume,
            color: d.close >= d.open ? '#26a69a' : '#ef5350',
          }));

          this.volumeSeries.setData(volumeData);
        }
      }
    });
  }

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    this.chart = createChart(this.chartContainer.nativeElement, {
      width: this.chartContainer.nativeElement.offsetWidth,
      height: 600,
      layout: {
        background: { color: '#1e2129' },
        textColor: '#dedddd',
      },
      grid: {
        vertLines: { color: '#292f3a' },
        horzLines: { color: '#292f3a' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#292f3a',
      },
      timeScale: {
        borderColor: '#292f3a',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    this.candlestickSeries = this.chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    this.volumeSeries = this.chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    window.addEventListener('resize', () => {
      if (this.chart) {
        this.chart.applyOptions({
          width: this.chartContainer.nativeElement.offsetWidth,
        });
      }
    });
  }

  private updateChartData(asset: Asset) {
    const timestamp = new Date().getTime() / 1000;
    const time = timestamp as Time;

    if (this.candlestickSeries) {
      this.candlestickSeries.update({
        time: time,
        open: asset.openPrice,
        high: asset.dayHigh,
        low: asset.dayLow,
        close: asset.currentPrice,
      });
    }

    if (this.volumeSeries) {
      this.volumeSeries.update({
        time: time,
        value: asset.volume,
        color: asset.currentPrice >= asset.openPrice ? '#26a69a' : '#ef5350',
      });
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.remove();
    }
  }
}
