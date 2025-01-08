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
import { AssetdetailsComponent } from '../assetdetails/assetdetails.component';
import { AssetService } from '../../../../services/asset.service';
import { TransactionService } from '../../../../services/transaction.service';
import { Asset } from '../../../../models/asset.model';
import { BestWinner } from '../../../../models/BestWinner.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchListoverview',
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
  ],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchlistComponent implements OnInit {
  private transactionService = inject(TransactionService);
  public bestWinners: BestWinner[] = [];

  private assetService = inject(AssetService);
  private router = inject(Router);

  readonly columns = [
    { field: 'logoUrl', label: 'Logo' },
    { field: 'symbol', label: 'Symbol' },
    { field: 'openPrice', label: 'Open' },
    { field: 'dayHigh', label: 'High' },
    { field: 'currentPrice', label: 'Price' },
    { field: 'previousClose', label: 'Close' },
    { field: 'priceChange', label: 'Change' },
  ] as const;

  readonly stockColumns = this.columns.map((col) => col.field);

  public selectedAsset = signal<Asset | null>(null);
  public isLoading = signal<boolean>(true);
  public isEmpty = signal<boolean>(false);

  public stockDataSource: MatTableDataSource<Asset> =
    new MatTableDataSource<Asset>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public searchControl = signal<string>('');
  public sectorControl = signal<string>('all');
  public trendControl = signal<string>('all');

  private watchlistAssets = signal<Asset[]>([]);

  public filteredAssets = computed(() => {
    const searchTerm = this.searchControl().toLowerCase();
    const sector = this.sectorControl();
    const trend = this.trendControl();
    const data = this.watchlistAssets();

    return data.filter((asset) => {
      const matchesSearch =
        searchTerm === '' || asset.symbol.toLowerCase().includes(searchTerm);
      const matchesSector = sector === 'all' || asset.sector === sector;
      const matchesTrend =
        trend === 'all' ||
        (trend === 'up' ? asset.priceChange > 0 : asset.priceChange < 0);

      return matchesSearch && matchesSector && matchesTrend;
    });
  });
  constructor() {
    effect(
      () => {
        const assets = this.assetService.watchlist();
        if (assets.length === 0) {
          // Initial load of watchlist if empty
          this.assetService.getWatchlist();
        }
        this.watchlistAssets.set(assets);
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

  ngOnInit(): void {
    this.fetchBestWinners();
  }
  private fetchBestWinners(): void {
    this.transactionService.getBestWinners().subscribe({
      next: (winners: BestWinner[]) => {
        this.bestWinners = winners;
        console.log('Best Winners:', this.bestWinners);
      },
      error: (err) => {
        console.error('Error fetching best winners:', err);
      },
    });
  }

  private updateDataSource() {
    const filteredData = this.filteredAssets();
    this.stockDataSource.data = filteredData;

    const hasInitialData = this.watchlistAssets().length > 0;
    const hasValidData =
      filteredData.length > 0 &&
      filteredData.every(
        (asset) =>
          asset.volume !== undefined &&
          asset.volume !== null &&
          asset.volume > 0
      );

    if (hasInitialData && filteredData.length === 0) {
      this.isEmpty.set(true);
      this.isLoading.set(false);
    } else {
      this.isEmpty.set(false);
      this.isLoading.set(hasInitialData ? !hasValidData : true);
    }
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

  goToExplore(): void {
    this.router.navigate(['/dashboard/discover']);
  }
}
