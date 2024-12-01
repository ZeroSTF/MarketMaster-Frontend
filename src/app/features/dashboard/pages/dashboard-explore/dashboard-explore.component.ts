import { AssetService } from '../../../../services/asset.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
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
  templateUrl: './dashboard-explore.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardExploreComponent implements OnDestroy {
  private assetService = inject(AssetService);

  readonly columns = [
    { field: 'logoUrl', label: 'Logo' },
    { field: 'symbol', label: 'Symbol' },
    { field: 'openPrice', label: 'Open' },
    { field: 'dayHigh', label: 'High' },
    { field: 'dayLow', label: 'Low' },
    { field: 'currentPrice', label: 'Price' },
    { field: 'volume', label: 'Volume' },
    { field: 'previousClose', label: 'Previous Close' },
    { field: 'priceChange', label: 'Change' },
    { field: 'priceChangePercent', label: 'Change%' },
    { field: 'actions', label: 'Actions' },
  ] as const;

  readonly stockColumns = this.columns.map((col) => col.field);

  public selectedAsset = signal<Asset | null>(null);
  public isLoading = signal<boolean>(true);
  public stockDataSource: MatTableDataSource<Asset> =
    new MatTableDataSource<Asset>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public searchControl = signal<string>('');
  public sectorControl = signal<string>('all');
  public trendControl = signal<string>('all');

  private assets = signal<Asset[]>([]);
  
  public filteredAssets = computed(() => {
    const searchTerm = this.searchControl().toLowerCase();
    const sector = this.sectorControl();
    const trend = this.trendControl();
    const data = this.assets();

    return data.filter((asset) => {
      const matchesSearch =
        searchTerm === '' || asset.symbol.toLowerCase().includes(searchTerm);
      const matchesSector = sector === 'all' || asset.symbol === sector;
      const matchesTrend =
        trend === 'all' ||
        (trend === 'up' ? asset.priceChange > 0 : asset.priceChange < 0);

      return matchesSearch && matchesSector && matchesTrend;
    });
  });

  constructor() {
    // Subscribe to the assets signal from the service
    effect(
      () => {
        const assets = this.assetService.assets();
        if (assets.length === 0) {
          // Initial load of assets if empty
          this.assetService.getAllAssets();
        }
        this.assets.set(assets);
      },
      { allowSignalWrites: true }
    );

    // Effect for updating the data source when filters change
    effect(
      () => {
        this.updateDataSource();
      },
      { allowSignalWrites: true }
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
    this.stockDataSource.sortingDataAccessor = (
      item: Asset,
      property: string
    ) => {
      const numericProperties = [
        'openPrice',
        'dayHigh',
        'dayLow',
        'currentPrice',
        'volume',
        'previousClose',
        'priceChange',
        'priceChangePercent',
      ];
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

  public viewAssetDetails(asset: Asset) {
    this.selectedAsset.set(asset);
    this.assetService.setSelectedAsset(asset);
  }

  public formatNumber(num: number | undefined): string {
    return num !== undefined ? num.toLocaleString() : '';
  }

  ngOnDestroy(): void {
    this.assetService.ngOnDestroy();
  }
}
