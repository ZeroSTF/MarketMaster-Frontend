export enum DrawingToolType {
  LINE = 'line',
  TREND_LINE = 'trend',
  FIBONACCI = 'fibonacci',
  RECTANGLE = 'rectangle',
  HORIZONTAL_LINE = 'horizontal',
  VERTICAL_LINE = 'vertical',
}

export interface DrawingTool {
  id: DrawingToolType;
  icon: string;
  label: string;
}

export const DRAWING_TOOLS: DrawingTool[] = [
  {
    id: DrawingToolType.LINE,
    icon: 'line-icon',
    label: 'Line',
  },
  {
    id: DrawingToolType.TREND_LINE,
    icon: 'trend-icon',
    label: 'Trend Line',
  },
  {
    id: DrawingToolType.FIBONACCI,
    icon: 'fibonacci-icon',
    label: 'Fibonacci Retracement',
  },
  {
    id: DrawingToolType.RECTANGLE,
    icon: 'rectangle-icon',
    label: 'Rectangle',
  },
  {
    id: DrawingToolType.HORIZONTAL_LINE,
    icon: 'horizontal-line-icon',
    label: 'Horizontal Line',
  },
  {
    id: DrawingToolType.VERTICAL_LINE,
    icon: 'vertical-line-icon',
    label: 'Vertical Line',
  },
];

export interface DrawingPoint {
  time: number;
  price: number;
}

export interface DrawingConfiguration {
  color?: string;
  lineWidth?: number;
  lineStyle?: number;
}
