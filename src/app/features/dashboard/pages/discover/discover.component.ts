import { AssetService } from '../../../../services/asset.service';
import {
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DiscoverComponent {
  private webSocketService = inject(WebsocketService);
  private yfinanceService = inject(YfinanceService);

  readonly columns = [
    { field: 'logoUrl', label: 'Logo' },
    { field: 'symbol', label: 'Symbol' },
    { field: 'open', label: 'Open' },
    { field: 'high', label: 'High' },
    { field: 'low', label: 'Low' },
    { field: 'price', label: 'Price' },
    { field: 'volume', label: 'Volume' },
    { field: 'latestTradingDay', label: 'Latest' },
    { field: 'previousClose', label: 'Previous Close' },
    { field: 'change', label: 'Change' },
    { field: 'changePercent', label: 'Change%' },
    { field: 'actions', label: 'Actions' },
  ] as const;
  selectedAsset: AssetStatisticsDto | null = null;
  assetDetailsVisible: { [symbol: string]: boolean } = {};
  readonly stockColumns = this.columns.map((col) => col.field);
  stockDataSource = new MatTableDataSource<AssetDailyDto>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchControl = signal('');
  sectorControl = signal('all');
  trendControl = signal('all');

  assets = this.webSocketService.getStockData();

  filteredAssets = computed(() => {
    const searchTerm = this.searchControl().toLowerCase();
    const sector = this.sectorControl();
    const trend = this.trendControl();

    return this.assets()?.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(searchTerm) &&
        (sector === 'all' || asset.symbol === sector) &&
        (trend === 'all' || asset.symbol === trend)
    ); //symbol & symbol need to be changed with the real filters sector and trend , new API
  });

  constructor() {
    effect(() => {
      this.stockDataSource.data = this.filteredAssets()??[];
    }); 
  }

  

  ngAfterViewInit() {
    this.stockDataSource.sort = this.sort;
    this.stockDataSource.paginator = this.paginator;
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
