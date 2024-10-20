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
  private yfinanceService = inject(YfinanceService);
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
    // Check selected asset initially
    this.checkSelectedAsset();

    // Create a reactive watcher for changes in the selected asset
    // this.selectedAsset.subscribe(() => {
    //   this.checkSelectedAsset();
    // });
  }

  private checkSelectedAsset(): void {
    const selectedAssetValue = this.selectedAsset(); // Get the current value of the signal

    if (selectedAssetValue) {
      this.fetchStatistics(selectedAssetValue.symbol);
    } else {
      console.error('No asset selected');
      this.error = 'No asset selected. Please select an asset first.';
    }
  }

  fetchStatistics(symbol: string) {
    if (!symbol) {
      this.error = 'Please enter a stock symbol';
      return;
    }

    this.yfinanceService.getstats(symbol).subscribe({
      next: (data) => {
        this.statistics = data;
        this.error = ''; // Clear any previous error
      },
      error: (err) => {
        console.error('Error fetching statistics', err);
        this.error = 'Failed to fetch statistics. Please try again.';
        this.statistics = null; // Reset statistics on error
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