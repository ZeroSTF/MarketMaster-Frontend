import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChartService } from '../../../../services/chart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ChartType,
  Indicator,
  TimeFrame,
  chartTypes,
  indicators,
  timeframes,
} from '../../../../models/chart.model';

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
  chartTypes = chartTypes;
  chartType: ChartType = 'Candlestick';

  timeframes = timeframes;

  indicators = indicators;

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
