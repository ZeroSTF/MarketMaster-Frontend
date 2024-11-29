import { Component, effect, inject, OnInit, signal} from '@angular/core';
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
import { Asset, WatchlistItem } from '../../../../models/asset.model';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
import { TransactionService } from '../../../../services/transaction.service';
import { WatchListDTO } from '../../../../models/watchlist.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { StockPredictionResponse } from '../../../../models/StockPredictionResponse.model';
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
    FormsModule
],
  templateUrl: './assetdetails.component.html',
  styleUrl: './assetdetails.component.css'
})
export class AssetdetailsComponent implements OnInit {
  private assetService = inject(AssetService);
  private snackBar = inject(MatSnackBar);
  private transactionService = inject(TransactionService);
  public selectedAsset = this.assetService.selectedAsset;
  public showPredictionWidget = false;
  public predictedPrice: number | null = null;
  public predictedChange: number | null = null;
  public selectedSymbol: string | null = null;
  public predictionDuration = 1;
  public isLoadingPrediction = false;
  
  result: any;
  error: string | null = null;
  newsItems = [
    { id: 1, headline: 'Breaking News: Major Market Movement' },
    { id: 2, headline: 'Quarterly Earnings Report Released' },
    { id: 3, headline: 'New Product Launch Announced' },
  ];

  constructor(private router: Router) {}
  

  ngOnInit() {}


  navigateToBuySell() {
    const asset = this.selectedAsset();
    if (asset) {
      this.router.navigate(['/buysell'], {
        queryParams: { symbol: asset.symbol, price: asset.currentPrice },
      });
    }
  }

  addWatchList() {
    const asset = this.selectedAsset();
    if (asset) {
      this.transactionService.addWatchList('zerostf', asset.symbol).subscribe({
        next: () => this.snackBar.open('Added to watchlist!', 'Close', { duration: 3000 }),
        error: (err) => console.error(err),
      });
    }
  }
  openPredictWidget(symbol: string): void {
    this.selectedSymbol = symbol;
    this.showPredictionWidget = true;
  }

  closePredictWidget(): void {
    this.showPredictionWidget = false;
    this.predictedPrice = null;
    this.predictedChange = null;
  }

  confirmPrediction(): void {
    if (this.selectedSymbol) {
      this.isLoadingPrediction = true; // Show loading spinner
      this.assetService.predictStock(this.selectedSymbol, true).subscribe({
        next: (response: StockPredictionResponse) => {
          this.predictedPrice = response.predicted_price;
          this.predictedChange = response.predicted_change;
          this.isLoadingPrediction = false; // Hide loading spinner
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Failed to predict price', 'Close', {
            duration: 3000,
          });
          this.isLoadingPrediction = false; // Hide loading spinner
        },
      });
    }
  }
  
  
  
  }  