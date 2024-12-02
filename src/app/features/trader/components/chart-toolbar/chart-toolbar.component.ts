import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ChartService } from '../../../../services/chart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import {
  ChartType,
  Indicator,
  TimeFrame,
  chartTypes,
  indicators,
  timeframes,
} from '../../../../models/chart.model';
import { IndicatorParametersDialogComponent } from '../indicator-parameters-dialog/indicator-parameters-dialog.component';

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
  chartType: ChartType = 'Candlestick';
  chartTypes = chartTypes;
  timeframes = timeframes;
  indicators = indicators;

  chartService = inject(ChartService);

  constructor(private dialog: MatDialog) {}

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
      // If indicator has parameters, open dialog first
      if (indicator.parameters && indicator.parameters.length > 0) {
        this.openIndicatorParameters(indicator);
      } else {
        this.chartService.addIndicator(indicator);
      }
    } else {
      this.chartService.removeIndicator(indicator);
    }
  }

  openIndicatorParameters(indicator: Indicator) {
    const dialogRef = this.dialog.open(IndicatorParametersDialogComponent, {
      width: '400px',
      data: {
        indicator: { ...indicator },
        currentParameters: this.getCurrentIndicatorParameters(indicator.type),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Update indicator with new parameters
        const updatedIndicator = {
          ...indicator,
          parameters: result.map((param: any) => ({
            ...param,
            value: param.value,
          })),
        };

        // Remove existing indicator of this type
        this.chartService.removeIndicator(indicator);

        // Add updated indicator
        this.chartService.addIndicator(updatedIndicator);
      } else if (!indicator.active) {
        // If dialog is cancelled and indicator was not previously active, revert active state
        indicator.active = false;
      }
    });
  }

  private getCurrentIndicatorParameters(type: string) {
    const indicatorConfig = this.indicators.find((i) => i.type === type);
    return (
      indicatorConfig?.parameters?.map((param) => ({
        name: param.name,
        value: param.default,
        min: param.min,
        max: param.max,
        step: param.step,
      })) || []
    );
  }
}
