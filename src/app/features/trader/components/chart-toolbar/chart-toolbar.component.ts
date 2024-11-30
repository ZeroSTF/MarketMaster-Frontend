import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChartService } from '../../../../services/chart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Indicator {
  name: string;
  type: string;
  icon: string;
  active: boolean;
  parameters?: {
    name: string;
    default: number;
  }[];
}

interface TimeFrame {
  name: string;
  value: string;
  label: string;
}

export type ChartType =
  | 'Candlestick'
  | 'Line'
  | 'Area'
  | 'Bar'
  | 'Baseline'
  | 'Area';

@Component({
  selector: 'app-chart-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './chart-toolbar.component.html',
  styleUrls: ['./chart-toolbar.component.scss'],
})
export class ChartToolbarComponent {
  chartTypes = [
    {
      name: 'Candlestick',
      value: 'Candlestick' as ChartType,
      icon: 'candlestick_chart',
    },
    { name: 'Line', value: 'Line' as ChartType, icon: 'show_chart' },
    { name: 'Area', value: 'Area' as ChartType, icon: 'area_chart' },
    {
      name: 'Bar',
      value: 'Bar' as ChartType,
      icon: 'bar_chart',
    },
    {
      name: 'Baseline',
      value: 'Baseline' as ChartType,
      icon: 'stacked_line_chart',
    },
  ];

  chartType: ChartType = 'Candlestick';

  timeframes: TimeFrame[] = [
    { name: '1m', value: '1', label: '1 min' },
    { name: '5m', value: '5', label: '5 min' },
    { name: '15m', value: '15', label: '15 min' },
    { name: '30m', value: '30', label: '30 min' },
    { name: '1h', value: '60', label: '1 hour' },
    { name: '4h', value: '240', label: '4 hour' },
    { name: '1D', value: 'D', label: 'Day' },
    { name: '1W', value: 'W', label: 'Week' },
    { name: '1M', value: 'M', label: 'Month' },
  ];

  indicators: Indicator[] = [
    {
      name: 'Moving Average',
      type: 'SMA',
      icon: 'show_chart',
      active: false,
      parameters: [{ name: 'length', default: 20 }],
    },
    {
      name: 'RSI',
      type: 'RSI',
      icon: 'analytics',
      active: false,
      parameters: [{ name: 'length', default: 14 }],
    },
    {
      name: 'MACD',
      type: 'MACD',
      icon: 'trending_up',
      active: false,
      parameters: [
        { name: 'fastLength', default: 12 },
        { name: 'slowLength', default: 26 },
        { name: 'signalLength', default: 9 },
      ],
    },
    {
      name: 'Bollinger Bands',
      type: 'BB',
      icon: 'design_services',
      active: false,
      parameters: [
        { name: 'length', default: 20 },
        { name: 'stdDev', default: 2 },
      ],
    },
    {
      name: 'Volume',
      type: 'VOL',
      icon: 'bar_chart',
      active: true,
      parameters: [],
    },
  ];

  constructor(public chartService: ChartService) {}

  onChartTypeChange(type: ChartType) {
    this.chartType = type;
    this.chartService.setChartType(type);
  }

  onTimeframeChange(timeframe: TimeFrame) {
    this.chartService.setTimeframe(timeframe.value);
  }

  toggleIndicator(indicator: Indicator) {
    indicator.active = !indicator.active;
    if (indicator.active) {
      this.chartService.addIndicator(indicator.type);
    } else {
      this.chartService.removeIndicator(indicator.type);
    }
  }
}
