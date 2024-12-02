import { Directive, effect, inject } from '@angular/core';
import { TVChartCollectorDirective, TVChart } from 'ngx-lightweight-charts';
import { DrawingToolService } from '../services/drawing-tool.service';
import { DrawingToolType } from '../models/drawing-tool.model';

@Directive({
  selector: '[chartDrawing]',
  standalone: true,
})
export class ChartDrawingDirective {
  readonly #collector = inject(TVChartCollectorDirective);
  readonly #drawingToolService = inject(DrawingToolService);

  constructor() {
    effect(() => {
      const activeDrawingTool = this.#drawingToolService.activeDrawingTool();

      // this.#collector.charts()?.forEach((chart: TVChart<any>) => {
      //   chart.removeAllDrawingTools();

      //   if (activeDrawingTool) {
      //     this.applyDrawingTool(chart, activeDrawingTool);
      //   }
      // });
    });
  }

  private applyDrawingTool(chart: TVChart<any>, tool: DrawingToolType) {
    const config = this.#drawingToolService.drawingConfig();

    switch (tool) {
      case DrawingToolType.LINE:
        this.setupLineTool(chart, config);
        break;
      case DrawingToolType.TREND_LINE:
        this.setupTrendLineTool(chart, config);
        break;
      case DrawingToolType.HORIZONTAL_LINE:
        this.setupHorizontalLineTool(chart, config);
        break;
    }
  }

  private setupLineTool(chart: TVChart<any>, config: any) {
    // chart.addDrawingTool('line', {
    //   color: config.color,
    //   lineWidth: config.lineWidth,
    // });
  }

  private setupTrendLineTool(chart: TVChart<any>, config: any) {
    // chart.addDrawingTool('trend', {
    //   color: config.color,
    //   lineWidth: config.lineWidth,
    // });
  }

  private setupHorizontalLineTool(chart: TVChart<any>, config: any) {
    // chart.addDrawingTool('horizontal', {
    //   color: config.color,
    //   lineWidth: config.lineWidth,
    // });
  }
}
