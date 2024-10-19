import { AssetService } from '../../../../services/asset.service';
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AssetdetailsComponent } from '../../components/assetdetails/assetdetails.component';
import { AssetDiscover } from '../../../../models/asset.model';
import { WebsocketService } from '../../../../services/websocket.service';
import { AssetDailyDto } from '../../../../models/assetdto.model';
import { AssetStatisticsDto, YfinanceService } from '../../../../services/yfinance.service';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    AssetdetailsComponent,
  ],
  templateUrl: './discover.component.html',
})
export class DiscoverComponent implements OnInit{
  //asset table
  columns = [
    { field: 'logoUrl', label: 'Logo' },
    { field: 'symbol', label: 'Symbol' },
    { field: 'price', label: 'Price' },
    { field: 'volume', label: 'Volume' },
    { field: 'marketCap', label: 'Market Cap' },
    { field: 'peRatio', label: 'P/E Ratio' },
    { field: 'dividendYield', label: 'Dividend Yield' },
    { field: 'trend', label: 'Trend' },
    { field: 'actions', label: 'Actions' },
  ];
  columns1 = [
    { field: 'logoUrl', label: 'Logo' },
    { field: 'symbol', label: 'Symbol' },
    { field: 'open', label: 'Open' },
    { field: 'high', label: 'High' },
    { field: 'low', label: 'Low' },
    { field: 'price', label: 'Price' },
    { field: 'volume', label: 'Volume' },
    { field: 'latestTradingDay', label: 'Latest Trading Day' },
    { field: 'previousClose', label: 'Previous Close' },
    { field: 'change', label: 'Change' },
    { field: 'changePercent', label: 'Change Percent' },
    { field: 'actions', label: 'Actions' },
  ];

  private webSocketService = inject(WebsocketService);
  private assetservice = inject(AssetService);
  private yfinanceService = inject(YfinanceService);
  selectedAsset: AssetStatisticsDto | null = null;
  assetDetailsVisible: { [symbol: string]: boolean } = {};
  //selectedAsset: AssetDiscover | null = null;
  displayedColumns = this.columns.map((col) => col.field);
  stockColumns = this.columns1.map((col) => col.field); // Columns for stock data
  dataSource = new MatTableDataSource<AssetDiscover>();
  stockDataSource = new MatTableDataSource<AssetDailyDto>(); // DataSource for stock data
  stockDatas: AssetDailyDto[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchControl = signal('');
  sectorControl = signal('all');
  trendControl = signal('all');

  assets = this.assetservice.assets;

  filteredAssets = computed(() => {
    const searchTerm = this.searchControl().toLowerCase();
    const sector = this.sectorControl();
    const trend = this.trendControl();

    return this.assets()?.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(searchTerm) &&
        (sector === 'all' || asset.sector === sector) &&
        (trend === 'all' || asset.trendDirection === trend)
    );
  });

  constructor() {
 
  }

  ngOnInit() {
   
    this.webSocketService.getStockData().subscribe((data: AssetDailyDto[]) => {
      this.stockDatas = data;
      this.stockDataSource.data = data; // Set stock data to stockDataSource
    });
   // this.webSocketService.fetchStockData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onSearchChange(event: Event) {
    this.searchControl.set((event.target as HTMLInputElement).value);
  }

  onSectorChange(event: Event) {
    this.sectorControl.set((event.target as HTMLSelectElement).value);
  }

  onTrendChange(event: Event) {
    this.trendControl.set((event.target as HTMLSelectElement).value);
  }

  // Open asset details
  // viewAssetDetails(asset: Asset) {
  //   this.selectedAsset = this.selectedAsset === asset ? null : asset;
  //   this.assetDetailsVisible[asset.symbol] = !this.assetDetailsVisible[asset.symbol];
  // }
  viewAssetDetails(asset: AssetStatisticsDto) {
    this.yfinanceService.selectAsset(asset); // Set selected asset in the service
    this.selectedAsset = this.selectedAsset === asset ? null : asset;
    this.assetDetailsVisible[asset.symbol] =
      !this.assetDetailsVisible[asset.symbol];
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }
}
