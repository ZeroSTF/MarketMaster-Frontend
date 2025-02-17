import { Directive, effect, inject, Input } from '@angular/core';
import { TVChartCollectorDirective, TVChart } from 'ngx-lightweight-charts';
import {
  SMA,
  RSI,
  MACD as MACDIndicator,
  BollingerBands,
  EMA,
  WMA,
  Stochastic,
  CCI,
  ATR,
} from '@debut/indicators';
import { LineData } from 'lightweight-charts';
import { ChartService } from '../services/chart.service';
import { Indicator } from '../models/chart.model';

@Directive({
  selector: '[chartIndicators]',
  standalone: true,
})
export class ChartIndicatorsDirective {
  readonly #collector = inject(TVChartCollectorDirective);
  readonly #chartService = inject(ChartService);

  @Input() data: any[] = [];

  private mainChart: TVChart<any> | null = null;
  //private volumeChart: TVChart<any> | null = null;
  private additionalSeries: Record<string, any> = {};
  private indicatorValues: Record<string, LineData[]> = {};

  constructor() {
    effect(() => {
      const charts = this.#collector.charts();
      if (!charts?.length) return;

      this.mainChart = charts[0];
      //this.volumeChart = charts[1];
      this.updateIndicators();
    });
    effect(() => {
      const indicators = this.#chartService.indicators();
      if (this.mainChart) {
        this.updateIndicators(indicators);
      }
    });
  }

  private updateIndicators(indicators: Indicator[] = []) {
    // Clear indicator values
    this.indicatorValues = {};

    // Clear additional series
    Object.keys(this.additionalSeries).forEach((key) => {
      const series = this.additionalSeries[key];
      if (Array.isArray(series)) {
        // Handle multi-series indicators
        series.forEach((singleSeries) => {
          if (singleSeries) {
            this.mainChart?.removeSeries(singleSeries);
          }
        });
      } else if (series) {
        // Handle single-series indicators
        this.mainChart?.removeSeries(series);
      }
      delete this.additionalSeries[key];
    });

    if (indicators.length === 0) {
      return;
    }

    indicators.forEach((indicator) => {
      // Extract parameters with their values
      const params = indicator.parameters
        ? indicator.parameters.map((p) => p.value ?? p.default)
        : [];

      switch (indicator.type) {
        case 'SMA':
          this.addMovingAverage('SMA', params[0] ?? 20);
          break;
        case 'EMA':
          this.addMovingAverage('EMA', params[0] ?? 20);
          break;
        case 'WMA':
          this.addMovingAverage('WMA', params[0] ?? 20);
          break;
        case 'RSI':
          this.addRSI(params[0] ?? 14);
          break;
        case 'MACD':
          this.addMACD(params[0] ?? 12, params[1] ?? 26, params[2] ?? 9);
          break;
        case 'BB':
          this.addBollingerBands(params[0] ?? 20, params[1] ?? 2);
          break;
        case 'Stochastic':
          this.addStochasticOscillator(params[0] ?? 14, params[1] ?? 3);
          break;
        case 'CCI':
          this.addCCI(params[0] ?? 20);
          break;
        case 'ATR':
          this.addATR(params[0] ?? 14);
          break;
      }
    });
  }

  private addMovingAverage(
    type: 'SMA' | 'EMA' | 'WMA' = 'SMA',
    length: number = 20
  ) {
    if (!this.mainChart) return;

    let indicator;
    switch (type) {
      case 'SMA':
        indicator = new SMA(length);
        break;
      case 'EMA':
        indicator = new EMA(length);
        break;
      case 'WMA':
        indicator = new WMA(length);
        break;
    }

    const maData: LineData[] = [];

    this.data.forEach((point) => {
      const ma = indicator.nextValue(point.close);
      if (ma !== undefined) {
        maData.push({ time: point.time, value: ma });
      }
    });

    const series = this.mainChart.addAdditionalSeries('Line', {
      color:
        type === 'SMA' ? '#FF6B6B' : type === 'EMA' ? '#4ECDC4' : '#9C27B0',
      lineWidth: 2,
      title: `${type} ${length}`,
    });

    series.series?.setData(maData);
    this.additionalSeries[type] = series.series;
    this.indicatorValues[`${type} ${length}`] = maData;
  }

  private addRSI(length: number = 14) {
    if (!this.mainChart) return;

    const rsiIndicator = new RSI(length);
    const rsiData: LineData[] = [];

    this.data.forEach((point) => {
      const rsi = rsiIndicator.nextValue(point.close);
      if (rsi !== undefined) {
        rsiData.push({ time: point.time, value: rsi });
      }
    });

    const series = this.mainChart.addAdditionalSeries('Histogram', {
      color: '#4ECDC4',
      title: `RSI ${length}`,
    });

    series.series?.setData(rsiData);
    this.additionalSeries['RSI'] = series.series;
    this.indicatorValues[`RSI ${length}`] = rsiData;
  }

  private addMACD(
    fastLength: number = 12,
    slowLength: number = 26,
    signalLength: number = 9
  ) {
    if (!this.mainChart) return;

    const macdIndicator = new MACDIndicator(
      fastLength,
      slowLength,
      signalLength
    );
    const macdData: LineData[] = [];
    const signalData: LineData[] = [];

    this.data.forEach((point) => {
      const macdValues = macdIndicator.nextValue(point.close);
      if (macdValues) {
        macdData.push({ time: point.time, value: macdValues.macd });
        signalData.push({ time: point.time, value: macdValues.signal });
      }
    });

    const macdSeries = this.mainChart.addAdditionalSeries('Line', {
      color: '#FF6B6B',
      lineWidth: 2,
      title: 'MACD',
    });

    const signalSeries = this.mainChart.addAdditionalSeries('Line', {
      color: '#4ECDC4',
      lineWidth: 2,
      title: 'Signal',
    });

    macdSeries.series?.setData(macdData);
    signalSeries.series?.setData(signalData);

    this.additionalSeries['MACD'] = [macdSeries.series, signalSeries.series];
    this.indicatorValues['MACD'] = macdData;
    this.indicatorValues['MACD Signal'] = signalData;
  }

  private addBollingerBands(length: number = 20, stdDev: number = 2) {
    if (!this.mainChart) return;

    const bbIndicator = new BollingerBands(length, stdDev);
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

    const upperBandSeries = this.mainChart.addAdditionalSeries('Line', {
      color: '#FF6B6B',
      lineWidth: 1,
      lineStyle: 2,
      title: 'Upper BB',
    });

    const middleBandSeries = this.mainChart.addAdditionalSeries('Line', {
      color: '#4ECDC4',
      lineWidth: 2,
      title: 'Middle BB',
    });

    const lowerBandSeries = this.mainChart.addAdditionalSeries('Line', {
      color: '#FF6B6B',
      lineWidth: 1,
      lineStyle: 2,
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
    this.indicatorValues['Upper BB'] = upperBandData;
    this.indicatorValues['Middle BB'] = middleBandData;
    this.indicatorValues['Lower BB'] = lowerBandData;
  }

  private addStochasticOscillator(
    length: number = 14,
    signalLength: number = 3
  ) {
    if (!this.mainChart) return;

    const stochIndicator = new Stochastic(length, signalLength);
    const stochData: LineData[] = [];
    const signalData: LineData[] = [];

    this.data.forEach((point) => {
      const stochValues = stochIndicator.nextValue(
        point.high,
        point.low,
        point.close
      );
      if (stochValues) {
        stochData.push({ time: point.time, value: stochValues.k });
        signalData.push({ time: point.time, value: stochValues.d });
      }
    });

    const stochSeries = this.mainChart.addAdditionalSeries('Line', {
      color: '#FF6B6B',
      lineWidth: 2,
      title: 'Stochastic K',
    });

    const signalSeries = this.mainChart.addAdditionalSeries('Line', {
      color: '#4ECDC4',
      lineWidth: 2,
      title: 'Stochastic D',
    });

    stochSeries.series?.setData(stochData);
    signalSeries.series?.setData(signalData);

    this.additionalSeries['Stochastic'] = [
      stochSeries.series,
      signalSeries.series,
    ];

    this.indicatorValues['Stochastic K'] = stochData;
    this.indicatorValues['Stochastic D'] = signalData;
  }

  private addCCI(length: number = 20) {
    if (!this.mainChart) return;

    const cciIndicator = new CCI(length);
    const cciData: LineData[] = [];

    this.data.forEach((point) => {
      const cci = cciIndicator.nextValue(point.high, point.low, point.close);
      if (cci !== undefined) {
        cciData.push({ time: point.time, value: cci });
      }
    });

    const series = this.mainChart.addAdditionalSeries('Line', {
      color: '#9C27B0',
      lineWidth: 2,
      title: `CCI ${length}`,
    });

    series.series?.setData(cciData);
    this.additionalSeries['CCI'] = series.series;
    this.indicatorValues[`CCI ${length}`] = cciData;
  }

  private addATR(length: number = 14) {
    if (!this.mainChart) return;

    const atrIndicator = new ATR(length);
    const atrData: LineData[] = [];

    this.data.forEach((point) => {
      const atr = atrIndicator.nextValue(point.high, point.low, point.close);
      if (atr !== undefined) {
        atrData.push({ time: point.time, value: atr });
      }
    });

    const series = this.mainChart.addAdditionalSeries('Line', {
      color: '#FF9800',
      lineWidth: 2,
      title: `ATR ${length}`,
    });

    series.series?.setData(atrData);
    this.additionalSeries['ATR'] = series.series;
    this.indicatorValues[`ATR ${length}`] = atrData;
  }

  getIndicatorValues(): Record<string, LineData[]> {
    return this.indicatorValues;
  }
}
