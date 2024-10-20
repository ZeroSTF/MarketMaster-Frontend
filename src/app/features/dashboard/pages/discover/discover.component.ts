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
import { AssetStatisticsDto, YfinanceService } from '../../../../services/yfinance.service';
import { Asset } from '../../../../models/asset.model';

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

  readonly stockColumns = this.columns.map((col) => col.field);

  public selectedAsset = signal<AssetStatisticsDto | null>(null);
  public isLoading = signal<boolean>(true);
  public stockDataSource = new MatTableDataSource<Asset>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public searchControl = signal<string>('');
  public sectorControl = signal<string>('all');
  public trendControl = signal<string>('all');

  private rawData = signal<Asset[]>([]);

  public filteredAssets = computed(() => {
    const searchTerm = this.searchControl().toLowerCase();
    const sector = this.sectorControl();
    const trend = this.trendControl();
    const data = this.rawData();

    return data.filter(asset => 
      (searchTerm === '' || asset.symbol.toLowerCase().includes(searchTerm)) &&
      (sector === 'all' || asset.symbol === sector) &&
      (trend === 'all' ||
       (trend === 'up' && asset.change > 0) ||
       (trend === 'down' && asset.change < 0))
    );
  });

  constructor() {
    effect(
      () => {
        const wsData = this.webSocketService.getStockData()();
        this.rawData.set(wsData);
      },
      { allowSignalWrites: true } // Enable signal writes inside this effect
    );
  
    effect(
      () => {
        this.updateDataSource();
      },
      { allowSignalWrites: true } // Enable signal writes inside this effect
    );
  }
  

  private updateDataSource() {
    const filteredData = this.filteredAssets();
    this.stockDataSource.data = filteredData;
    this.isLoading.set(filteredData.length === 0);
  }

  ngAfterViewInit() {
    this.stockDataSource.sort = this.sort;
    this.stockDataSource.paginator = this.paginator;
    this.setupSortingAccessor();
  }

  private setupSortingAccessor() {
    this.stockDataSource.sortingDataAccessor = (item: Asset, property: string) => {
      const numericProperties = ['change', 'price', 'open', 'high', 'low', 'volume', 'previousClose', 'changePercent'];
      return numericProperties.includes(property)
        ? Number(item[property as keyof Asset]) || 0
        : item[property as keyof Asset]?.toString() || '';
    };
  }

  public onSearchChange(event: Event) {
    this.searchControl.set((event.target as HTMLInputElement).value);
  }

  public onSectorChange(event: Event) {
    this.sectorControl.set((event.target as HTMLSelectElement).value);
  }

  public onTrendChange(event: Event) {
    this.trendControl.set((event.target as HTMLSelectElement).value);
  }

  public viewAssetDetails(asset: AssetStatisticsDto) {
    this.selectedAsset.set(asset);
    console.log("viewDetails clicked" , this.selectedAsset);
    console.log("asset for yf" , asset);
    this.yfinanceService.selectAsset(asset);
  }

  public formatNumber(num: number): string {
    return num.toLocaleString();
  }
}