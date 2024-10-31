import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartToolbarComponent } from '../../features/trader/components/chart-toolbar/chart-toolbar.component';
import { TradingChartComponent } from '../../features/trader/components/trading-chart/trading-chart.component';

@Component({
  selector: 'app-trader-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ChartToolbarComponent, TradingChartComponent],
  templateUrl: './trader-layout.component.html',
  styleUrl: './trader-layout.component.css',
})
export class TraderLayoutComponent {
}
