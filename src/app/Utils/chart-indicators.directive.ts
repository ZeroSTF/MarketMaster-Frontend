import { Directive, effect, inject, Input } from '@angular/core';
import { TVChartCollectorDirective, TVChart } from 'ngx-lightweight-charts';
import {
  SMA,
  RSI,
  MACD as MACDIndicator,
  BollingerBands,
} from '@debut/indicators';
import { LineData } from 'lightweight-charts';
import { ChartService } from '../services/chart.service';

@Directive({
  selector: '[chartIndicators]',
  standalone: true,
})
export class ChartIndicatorsDirective {
  readonly #collector = inject(TVChartCollectorDirective);
  readonly #chartService = inject(ChartService);

  @Input() data: any[] = [];

  private chart: TVChart<any> | null = null;
  private additionalSeries: Record<string, any> = {};

  constructor() {
    effect(() => {
      const charts = this.#collector.charts();
      if (!charts?.length || !this.data.length) return;

      this.chart = charts[0];
      this.updateIndicators();
    });
    effect(() => {
      const indicators = this.#chartService.indicators();
      if (this.chart) {
        this.updateIndicators(indicators);
      }
    });
  }

  private updateIndicators(indicators: string[] = []) {
    // Remove existing additional series
    Object.keys(this.additionalSeries).forEach((key) => {
      console.log('Removing series', key);
      if (this.additionalSeries[key]) {
        this.chart?.removeSeries(this.additionalSeries[key]);
        delete this.additionalSeries[key];
      }
    });

    // Add requested indicators
    indicators.forEach((indicator) => {
      switch (indicator) {
        case 'SMA':
          console.log('Adding SMA');
          this.addMovingAverage();
          break;
        case 'RSI':
          console.log('Adding RSI');
          this.addRSI();
          break;
        case 'MACD':
          console.log('Adding MACD');
          this.addMACD();
          break;
        case 'BB':
          console.log('Adding BB');
          this.addBollingerBands();
          break;
      }
    });
  }

  private addMovingAverage() {
    if (!this.chart) return;

    const smaIndicator = new SMA(20);
    const smaData: LineData[] = [];

    this.data.forEach((point) => {
      const sma = smaIndicator.nextValue(point.close);
      if (sma !== undefined) {
        smaData.push({ time: point.time, value: sma });
      }
    });

    const series = this.chart.addAdditionalSeries('Line', {
      color: '#FF6B6B',
      lineWidth: 2,
      title: 'SMA 20',
    });

    series.series?.setData(smaData);
    this.additionalSeries['SMA'] = series.series;
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
