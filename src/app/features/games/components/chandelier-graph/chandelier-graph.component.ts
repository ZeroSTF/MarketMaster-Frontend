import { Component, effect, inject } from '@angular/core';
import { Asset } from '../../../../models/asset.model';
import { GameChartService } from '../../../../services/game-chart.service';
import { AssetSelectorComponent } from '../trader/components/asset-selector/asset-selector.component';
import { TradingChartComponent } from '../trader/components/trading-chart/trading-chart.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartToolbarComponent } from '../trader/components/chart-toolbar/chart-toolbar.component';
import { ChartService } from '../../../../services/chart.service';


@Component({
  selector: 'app-chandelier-graph',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ChartToolbarComponent,
    TradingChartComponent,
    AssetSelectorComponent,
  ],
  templateUrl: './chandelier-graph.component.html',
  styleUrl: './chandelier-graph.component.css',
})
export class ChandelierGraphComponent {
  private chartService = inject(ChartService);

  selectedAsset = this.chartService.selectedAsset;
}
