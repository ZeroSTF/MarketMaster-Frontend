import { Directive, effect, inject, Input } from '@angular/core';
import { TVChartCollectorDirective, TVChart } from 'ngx-lightweight-charts';
import {
  SMA,
  RSI,
  MACD as MACDIndicator,
  BollingerBands,
} from '@debut/indicators';
import { LineData } from 'lightweight-charts';

@Directive({
  selector: '[chartIndicators]',
  standalone: true,
})
export class ChartIndicatorsDirective {
  readonly #collector = inject(TVChartCollectorDirective);

  @Input() data: any[] = [];
  @Input() indicators: string[] = [];

  private chart: TVChart<any> | null = null;
  private additionalSeries: Record<string, any> = {};

  constructor() {
    effect(() => {
      const charts = this.#collector.charts();
      if (!charts?.length || !this.data.length) return;

      this.chart = charts[0];
      this.updateIndicators();
    });
  }

  private updateIndicators() {
    // Remove existing additional series
    Object.keys(this.additionalSeries).forEach((key) => {
      if (this.additionalSeries[key]) {
        this.chart?.removeSeries(this.additionalSeries[key]);
        delete this.additionalSeries[key];
      }
    });

    // Add requested indicators
    this.indicators.forEach((indicator) => {
      switch (indicator) {
        case 'MA':
          this.addMovingAverage();
          break;
        case 'RSI':
          this.addRSI();
          break;
        case 'MACD':
          this.addMACD();
          break;
        case 'BB':
          this.addBollingerBands();
          break;
      }
    });
  }

  private addMovingAverage() {
    if (!this.chart) return;

    const smaIndicator = new SMA(20);
    const maData: LineData[] = [];

    this.data.forEach((point) => {
      const ma = smaIndicator.nextValue(point.close);
      if (ma !== undefined) {
        maData.push({ time: point.time, value: ma });
      }
    });

    const series = this.chart.addAdditionalSeries('Line', {
      color: '#FF6B6B',
      lineWidth: 2,
      title: 'MA 20',
    });

    series.series?.setData(maData);
    this.additionalSeries['MA'] = series.series;
  }

  private addRSI() {
    if (!this.chart) return;

    const rsiIndicator = new RSI(14);
    const rsiData: LineData[] = [];

    this.data.forEach((point) => {
      const rsi = rsiIndicator.nextValue(point.close);
      if (rsi !== undefined) {
        rsiData.push({ time: point.time, value: rsi });
      }
    });

    const series = this.chart.addAdditionalSeries('Histogram', {
      color: '#4ECDC4',
      title: 'RSI 14',
    });

    series.series?.setData(rsiData);
    this.additionalSeries['RSI'] = series.series;
  }

  private addMACD() {
    if (!this.chart) return;

    const macdIndicator = new MACDIndicator(12, 26, 9);
    const macdData: LineData[] = [];
    const signalData: LineData[] = [];

    this.data.forEach((point) => {
      const macdValues = macdIndicator.nextValue(point.close);
      if (macdValues) {
        macdData.push({ time: point.time, value: macdValues.macd });
        signalData.push({ time: point.time, value: macdValues.signal });
      }
    });

    const macdSeries = this.chart.addAdditionalSeries('Line', {
      color: '#FF6B6B',
      lineWidth: 2,
      title: 'MACD',
    });

    const signalSeries = this.chart.addAdditionalSeries('Line', {
      color: '#4ECDC4',
      lineWidth: 2,
      title: 'Signal',
    });

    macdSeries.series?.setData(macdData);
    signalSeries.series?.setData(signalData);

    this.additionalSeries['MACD'] = [macdSeries.series, signalSeries.series];
  }

  private addBollingerBands() {
    if (!this.chart) return;

    const bbIndicator = new BollingerBands(20, 2);
    const upperBandData: LineData[] = [];
    const middleBandData: LineData[] = [];
    const lowerBandData: LineData[] = [];

    this.data.forEach((point) => {
      const bbValues = bbIndicator.nextValue(point.close);
      if (bbValues) {
        upperBandData.push({ time: point.time, value: bbValues.upper });
        middleBandData.push({ time: point.time, value: bbValues.middle });
        lowerBandData.push({ time: point.time, value: bbValues.lower });
      }
    });

    const upperBandSeries = this.chart.addAdditionalSeries('Line', {
      color: '#FF6B6B',
      lineWidth: 1,
      lineStyle: 2, // dashed
      title: 'Upper BB',
    });

    const middleBandSeries = this.chart.addAdditionalSeries('Line', {
      color: '#4ECDC4',
      lineWidth: 2,
      title: 'Middle BB',
    });

    const lowerBandSeries = this.chart.addAdditionalSeries('Line', {
      color: '#FF6B6B',
      lineWidth: 1,
      lineStyle: 2, // dashed
      title: 'Lower BB',
    });

    upperBandSeries.series?.setData(upperBandData);
    middleBandSeries.series?.setData(middleBandData);
    lowerBandSeries.series?.setData(lowerBandData);

    this.additionalSeries['BB'] = [
      upperBandSeries.series,
      middleBandSeries.series,
      lowerBandSeries.series,
    ];
  }
}
