import { Component, inject, OnInit} from '@angular/core';
import { AssetService } from '../../../../services/asset.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ChartComponent } from "../chart/chart.component";
import { AssetDailyDto } from '../../../../models/assetdto.model';
import { WebsocketService } from '../../../../services/websocket.service';
import { AssetStatisticsDto, YfinanceService } from '../../../../services/yfinance.service';

@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ChartComponent
],
  templateUrl: './assetdetails.component.html',
  styleUrl: './assetdetails.component.css'
})
export class AssetdetailsComponent implements OnInit {
  
 
  private assetService = inject(AssetService);
  private webSocketService = inject(WebsocketService);
  private yfinanceService = inject(YfinanceService);
  // Signal to track the selected asset

  selectedAsset = this.yfinanceService.selectedAssetSignal;

  expandedNews: { [key: number]: boolean } = {};
  activeTab: 'overview' | 'financial' | 'news' = 'overview';
  stockDatas: any[] = [];
  statistics: AssetStatisticsDto | null = null;
  symbol: string = '';
  error: string = '';
  newsItems = [
    {
      id: 1,
      headline: 'Breaking News: Major Market Movement',
      content: 'Detailed content about the market movement...'
    },
    {
      id: 2,
      headline: 'Quarterly Earnings Report Released',
      content: 'Details about the quarterly earnings...'
    },
    {
      id: 3,
      headline: 'New Product Launch Announced',
      content: 'Information about the new product launch...'
    }
  ];
  ngOnInit(): void {
    const selectedAssetValue = this.selectedAsset();
    if (selectedAssetValue) {
      this.symbol = selectedAssetValue.symbol;
      this.fetchStatistics();
    } else {
      console.error('No asset selected');
      this.error = 'No asset selected. Please select an asset first.';
    }
    this.fetchStatistics()
  }
  fetchStatistics() {
    if (!this.symbol) {
      this.error = 'Please enter a stock symbol';
      return;
    }

    this.yfinanceService.getstats(this.symbol).subscribe({
      next: (data) => {
        this.statistics = data;
        this.error = '';
      },
      error: (err) => {
        console.error('Error fetching statistics', err);
        this.error = 'Failed to fetch statistics. Please try again.';
        this.statistics = null;
      }
    });
  }
  setActiveTab(tab: 'overview' | 'financial' | 'news') {
    this.activeTab = tab;
  }

  toggleFullText(id: number) {
    this.expandedNews[id] = !this.expandedNews[id];
  }

}