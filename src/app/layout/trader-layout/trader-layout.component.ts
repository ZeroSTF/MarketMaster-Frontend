// trader-layout.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartToolbarComponent } from '../../features/trader/components/chart-toolbar/chart-toolbar.component';
import { TradingChartComponent } from '../../features/trader/components/trading-chart/trading-chart.component';
import { AssetSelectorComponent } from '../../features/trader/components/asset-selector/asset-selector.component';
import { ChartService } from '../../services/chart.service';
import { Asset } from '../../models/asset.model';

@Component({
  selector: 'app-trader-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ChartToolbarComponent,
    TradingChartComponent,
    AssetSelectorComponent,
  ],
  templateUrl: './trader-layout.component.html',
  styleUrl: './trader-layout.component.css',
})
export class TraderLayoutComponent {
  private chartService = inject(ChartService);

  selectedAsset = this.chartService.selectedAsset;

  constructor() {
    effect(() => {
      const asset = this.selectedAsset();
      if (asset) {
        this.loadAssetData(asset);
      }
    });
  }

  private async loadAssetData(asset: Asset) {
    try {
      await this.chartService.loadHistoricalData(asset.symbol);
    } catch (error) {
      console.error('Error loading asset data:', error);
    }
  }
}
