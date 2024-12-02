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
      this.chartService.addIndicator(indicator);
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
        this.updateIndicatorParameters(indicator.type, result);
      }
    });
  }

  private getCurrentIndicatorParameters(type: string) {
    // This method would retrieve current parameters from your chart service
    // You might want to implement this based on your specific chart service implementation
    const defaultParams =
      this.indicators.find((i) => i.type === type)?.parameters || [];
    return defaultParams.map((param) => ({
      name: param.name,
      value: param.default,
    }));
  }

  private updateIndicatorParameters(type: string, parameters: any[]) {
    // Method to update indicator parameters in your chart service
    // This is a placeholder and should be implemented based on your specific requirements
    console.log(`Updating ${type} parameters:`, parameters);

    // You might want to call a method in your chart service to update the indicator
    //this.chartService.updateIndicatorParameters(type, parameters);
  }
}
