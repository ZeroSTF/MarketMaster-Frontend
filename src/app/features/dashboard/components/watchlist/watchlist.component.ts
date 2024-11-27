import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AssetdetailsComponent } from '../assetdetails/assetdetails.component';
import { AssetService } from '../../../../services/asset.service';
import { TransactionService } from '../../../../services/transaction.service';
import { WatchListDTO } from '../../../../models/watchlist.model';
import { Asset } from '../../../../models/asset.model';
import { WatchlistItem } from '../../../../models/asset.model';
import { BestWinner } from '../../../../models/BestWinner.model';

@Component({
  selector: 'app-watchListoverview',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    AssetdetailsComponent,
  ],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistComponent implements OnInit {
  private assetService = inject(AssetService);
  private transactionService = inject(TransactionService);
  public watchlistItems = signal<WatchlistItem[]>([]);  // Use WatchlistItem
  public selectedWatchlistItem = signal<WatchlistItem | null>(null);
  public stockDataSource: MatTableDataSource<WatchlistItem> = new MatTableDataSource<WatchlistItem>();
  public bestWinners: BestWinner[] = [];
  readonly columns = [
    { field: 'symbol', label: 'Symbol' },
    { field: 'performance', label: 'Last' },
    { field: 'priceChange', label: 'Chg' },
    { field: 'priceChangePercent', label: 'Chg%' },
  ];

  readonly stockColumns = this.columns.map((col) => col.field);

  constructor() {}

  ngOnInit(): void {
    this.fetchBestWinners();
    // Effect to fetch and display watchlist items
    effect(() => {
      this.transactionService.getWatchList('johnDoe').subscribe({
        next: (watchlist: WatchListDTO[]) => {
          const watchlistItems = watchlist.map(item => ({
            symbol: item.assetSymbol,
            performance: 0,  // Example, you can calculate this based on your logic
            category: 'N/A',  // Adjust as needed
            trend: 'up' as 'up' | 'down',  // Explicitly set as 'up' or 'down'
          }));
          this.watchlistItems.set(watchlistItems);
          console.log(this.watchlistItems());  // Log the watchlist items
        },
        error: (err) => {
          console.error('Error fetching watchlist:', err);
        },
      });
    
      // Check if watchlistItems is getting populated
      const filteredWatchlistItems = this.watchlistItems().map((item) => {
        console.log(item);  // Log each item to check
        return item;
      });
    
      this.stockDataSource.data = filteredWatchlistItems;
    });
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
  public viewAssetDetails(item: WatchlistItem): void {
    this.selectedWatchlistItem.set(item);
    // Optionally set asset data in the AssetService if needed
  }

  public formatNumber(num: number | undefined): string {
    return num !== undefined ? num.toLocaleString() : '';
  }
}
