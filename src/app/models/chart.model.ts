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

export interface TimeFrame {
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

export const chartTypes = [
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

export const timeframes: TimeFrame[] = [
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

export const indicators: Indicator[] = [
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
