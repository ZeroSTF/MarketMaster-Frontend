import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { AssetService } from '../../../../services/asset.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionService } from '../../../../services/transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { StockPredictionResponse } from '../../../../models/StockPredictionResponse.model';
import { Chart, registerables } from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../../auth/auth.service';

Chart.register(...registerables);
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
    FormsModule,
  ],
  templateUrl: './assetdetails.component.html',
  styleUrl: './assetdetails.component.css',
})
export class AssetdetailsComponent implements OnInit {
  private assetService = inject(AssetService);
  private snackBar = inject(MatSnackBar);
  private transactionService = inject(TransactionService);
  public selectedAsset = this.assetService.selectedAsset;
  public showPredictionWidget = false;
  public predictedPrice: number | null = null;
  public predictedChange: number | null = 0; // Default value of 0
  public selectedSymbol: string | null = null;
  public predictionDuration = 1;
  public isLoadingPrediction = false;
  public chart: any; // Chart.js instance
  public chartLabels: string[] = []; // Dates for the chart
  public chartData: number[] = []; // Prices for the chart
  private authService=inject(AuthService)
  private username:string='';

  result: any;
  error: string | null = null;
  newsItems = [
    { id: 1, headline: 'Breaking News: Major Market Movement' },
    { id: 2, headline: 'Quarterly Earnings Report Released' },
    { id: 3, headline: 'New Product Launch Announced' },
  ];

  constructor(private router: Router,private cdr: ChangeDetectorRef) {}
  

  ngOnInit() {
    const currentUser=this.authService.currentUser();
    if(currentUser){
    this.username=currentUser.username;}
  }

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
      this.transactionService.addWatchList(this.username, asset.symbol).subscribe({
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
    this.chartLabels = [];
    this.chartData = [];
    this.predictedPrice = null;
    this.predictedChange = null;
  }

  confirmPrediction(): void {
    if (this.selectedSymbol) {
      this.isLoadingPrediction = true;

      this.assetService.predictStock(this.selectedSymbol, true, 14).subscribe({
        next: (response) => {
          this.chartLabels = response.predicted_prices.map((p) => p.date);
          this.chartData = response.predicted_prices.map((p) => p.price);

          this.predictedPrice =
            response.predicted_prices[response.predicted_prices.length - 1]
              .price;
          this.predictedChange = response.predicted_change;

          this.isLoadingPrediction = false;

          this.initializeChart();
        },
        error: (error) => {
          console.error('Prediction Error:', error);
          this.isLoadingPrediction = false;
        },
      });
    }
  }
  
  initializeChart(): void {
    this.cdr.detectChanges(); // Ensure DOM changes are applied
    const canvas = document.getElementById('predictionChart') as HTMLCanvasElement;
  
    if (!canvas) {
      console.error('Canvas element not found after ChangeDetectorRef.detectChanges()');
      return;
    }
  
    if (this.chart) {
      this.chart.destroy();
    }
  
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Predicted Prices',
            data: this.chartData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Price ($)',
            },
          },
        },
      },
    });
  
    console.log('Chart successfully created');
  }
  
  
  
  
  
  }  
