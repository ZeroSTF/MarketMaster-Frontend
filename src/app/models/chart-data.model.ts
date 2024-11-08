import { CandlestickData, Time } from "lightweight-charts";

interface ChartData {
  ohlcv: CandlestickData<Time>[];
  indicators: Indicator[];
}

interface Indicator {
  name: string;
  type: string;
  data: number[][];
  settings?: any;
}
