import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  effect,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../../../services/asset.service';
import { ChartService } from '../../../../services/chart.service';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
} from 'lightweight-charts';
import { Asset } from '../../../../models/asset.model';

@Component({
  selector: 'app-trading-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trading-chart.component.html',
  styleUrls: ['./trading-chart.component.scss'],
})
export class TradingChartComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  private chart?: IChartApi;
  private candlestickSeries?: ISeriesApi<'Candlestick'>;
  private volumeSeries?: ISeriesApi<'Histogram'>;

  constructor(
    private assetService: AssetService,
    private chartService: ChartService,
    private destroyRef: DestroyRef
  ) {
    effect(() => {
      const asset = this.assetService.selectedAsset();
      if (asset) {
        this.updateChartData(asset);
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

    // Add candlestick series
    this.candlestickSeries = this.chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Add volume series
    this.volumeSeries = this.chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // Set to empty to create a new scale
    });

    // Handle window resize
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
