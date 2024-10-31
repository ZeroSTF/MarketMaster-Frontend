export interface ChartData {
  ohlcv: number[][];
  onchart: Indicator[];
  offchart: Indicator[];
}

export interface Indicator {
  name: string;
  type: string;
  data: number[][];
  settings?: any;
}