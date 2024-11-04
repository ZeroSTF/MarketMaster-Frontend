import { Component, inject, OnInit} from '@angular/core';
import { AssetService } from '../../../../services/asset.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ChartComponent } from "../chart/chart.component";
import { AssetStatisticsDto, YfinanceService } from '../../../../services/yfinance.service';
import { Asset } from '../../../../models/asset.model';
import { Router } from '@angular/router';
import { state } from '@angular/animations';

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
  public selectedAsset = this.assetService.selectedAsset;
  
  constructor(private router:Router){}
  ngOnInit() {}
  expandedNews: { [key: number]: boolean } = {};
  activeTab: 'overview' | 'financial' | 'news' = 'overview';
  // stockDatas: any[] = [];
  // statistics: AssetStatisticsDto | null = null;
  // symbol: string = '';
  // error: string = '';
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
  
  
  setActiveTab(tab: 'overview' | 'financial' | 'news') {
    this.activeTab = tab;
  }

  toggleFullText(id: number) {
    this.expandedNews[id] = !this.expandedNews[id];
  }

  navigateToBuySell() {
    const asset = this.selectedAsset();
    if (asset) {
      this.router.navigate(['/buysell'], {
        queryParams: {
          symbol: asset.symbol,
          price: asset.currentPrice
        }
      });
    }
  }
}