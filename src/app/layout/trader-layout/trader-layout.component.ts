import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartToolbarComponent } from '../../features/trader/components/chart-toolbar/chart-toolbar.component';
import { TradingChartComponent } from '../../features/trader/components/trading-chart/trading-chart.component';
import { AssetSelectorComponent } from '../../features/trader/components/asset-selector/asset-selector.component';
import { Asset, AssetType } from '../../models/asset.model';

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
  selectedAsset: Asset = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: AssetType.STOCK,
    openPrice: 0,
    dayHigh: 0,
    dayLow: 0,
    currentPrice: 0,
    volume: 0,
    previousClose: 0,
    priceChange: 0,
    priceChangePercent: 0,
    marketCap: 0,
    peRatio: 0,
    dividendYieldPercent: 0,
    beta: 0,
    yearHigh: 0,
    yearLow: 0,
    averageVolume: 0,
    sector: 'Technology',
  };
}
