import { Directive, effect, inject, ElementRef } from '@angular/core';
import { TVChartCollectorDirective, TVChart } from 'ngx-lightweight-charts';

@Directive({
  selector: '[draggableBaseline]',
  standalone: true,
  host: {
    '(mousedown)': 'onMouseDown($event)',
  },
})
export class DraggableBaselineDirective {
  readonly #collector = inject(TVChartCollectorDirective);
  readonly #elementRef = inject(ElementRef);

  private isDragging = false;
  private chart: TVChart<'Baseline'> | null = null;
  private initialMouseY = 0;
  private initialBaselinePrice = 100;

  constructor() {
    effect(() => {
      const charts = this.#collector.charts();
      if (!charts?.length) return;

      this.chart = charts[0] as TVChart<'Baseline'>;
    });

    // Add global mouse events
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseDown(event: MouseEvent) {
    if (!this.chart) return;

    // Get the current baseline price from series options
    const seriesOptions = this.chart.series?.options();
    this.initialBaselinePrice = seriesOptions?.baseValue?.price || 100;

    // Check if mouse is close to the baseline (you might need to adjust this logic)
    const rect = this.#elementRef.nativeElement.getBoundingClientRect();
    const relativeY = event.clientY - rect.top;
    const chartHeight = rect.height;

    // Rough estimation of being close to baseline
    const baselinePositionRatio = 0.5; // Baseline is typically in the middle
    const baselinePixelPosition = chartHeight * baselinePositionRatio;

    if (Math.abs(relativeY - baselinePixelPosition) < 20) {
      this.isDragging = true;
      this.initialMouseY = event.clientY;
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.chart) return;

    // Calculate price change based on mouse movement
    const mouseDeltaY = event.clientY - this.initialMouseY;

    // Estimate price change (you might need to calibrate this)
    // This is a simple linear mapping where 100 pixels = 10% of the baseline price
    const priceDelta = (mouseDeltaY / 100) * (this.initialBaselinePrice * 0.1);

    const newBaselinePrice = this.initialBaselinePrice + priceDelta;

    // Apply new baseline price to the chart
    this.chart.series?.applyOptions({
      baseValue: {
        price: newBaselinePrice,
      },
    });
  }

  onMouseUp() {
    this.isDragging = false;
  }

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }
}
