export interface IndicatorValue {
  time: number;
  value: number;
  color?: string;
}

export interface MACDValue {
  time: number;
  macd: number;
  signal: number;
  histogram: number;
}

export class IndicatorUtils {
  static calculateSMA(data: any[], length: number): IndicatorValue[] {
    const values = data.map((d) => d.close);
    const result: IndicatorValue[] = [];

    for (let i = length - 1; i < values.length; i++) {
      const sum = values
        .slice(i - length + 1, i + 1)
        .reduce((a, b) => a + b, 0);
      result.push({
        time: data[i].time,
        value: sum / length,
      });
    }

    return result;
  }

  static calculateRSI(data: any[], length: number = 14): IndicatorValue[] {
    const values = data.map((d) => d.close);
    const result: IndicatorValue[] = [];
    let gains: number[] = [];
    let losses: number[] = [];

    // Calculate initial gains and losses
    for (let i = 1; i < values.length; i++) {
      const difference = values[i] - values[i - 1];
      gains.push(Math.max(0, difference));
      losses.push(Math.max(0, -difference));
    }

    // Calculate RSI
    for (let i = length; i < values.length; i++) {
      const avgGain =
        gains.slice(i - length, i).reduce((a, b) => a + b, 0) / length;
      const avgLoss =
        losses.slice(i - length, i).reduce((a, b) => a + b, 0) / length;

      const rs = avgGain / (avgLoss || 1); // Avoid division by zero
      const rsi = 100 - 100 / (1 + rs);

      result.push({
        time: data[i].time,
        value: rsi,
      });
    }

    return result;
  }

  static calculateMACD(
    data: any[],
    fastLength: number = 12,
    slowLength: number = 26,
    signalLength: number = 9
  ): MACDValue[] {
    const values = data.map((d) => d.close);
    const result: MACDValue[] = [];

    // Calculate EMAs
    const fastEMA = this.calculateEMA(values, fastLength);
    const slowEMA = this.calculateEMA(values, slowLength);

    // Calculate MACD line
    const macdLine: number[] = [];
    for (let i = 0; i < values.length; i++) {
      if (i < slowLength - 1) {
        macdLine.push(0);
      } else {
        macdLine.push(fastEMA[i] - slowEMA[i]);
      }
    }

    // Calculate signal line (9-day EMA of MACD line)
    const signalLine = this.calculateEMA(macdLine, signalLength);

    // Calculate histogram
    for (let i = slowLength - 1; i < values.length; i++) {
      result.push({
        time: data[i].time,
        macd: macdLine[i],
        signal: signalLine[i],
        histogram: macdLine[i] - signalLine[i],
      });
    }

    return result;
  }

  static calculateBollingerBands(
    data: any[],
    length: number = 20,
    stdDev: number = 2
  ): any[] {
    const values = data.map((d) => d.close);
    const result = [];

    for (let i = length - 1; i < values.length; i++) {
      const slice = values.slice(i - length + 1, i + 1);
      const sma = slice.reduce((a, b) => a + b, 0) / length;

      // Calculate Standard Deviation
      const variance =
        slice.reduce((a, b) => a + Math.pow(b - sma, 2), 0) / length;
      const sd = Math.sqrt(variance);

      result.push({
        time: data[i].time,
        middle: sma,
        upper: sma + stdDev * sd,
        lower: sma - stdDev * sd,
      });
    }

    return result;
  }

  private static calculateEMA(values: number[], length: number): number[] {
    const k = 2 / (length + 1);
    const ema = [values[0]];

    for (let i = 1; i < values.length; i++) {
      ema.push(values[i] * k + ema[i - 1] * (1 - k));
    }

    return ema;
  }
}
