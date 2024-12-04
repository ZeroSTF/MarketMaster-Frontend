import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetPortfolio } from '../../../../models/asset.model';
import { ChartComponent } from '../../components/chart/chart.component';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { WatchlistComponent } from '../../components/watchlist/watchlist.component';
import { AssetService } from '../../../../services/asset.service';
import { TransactionService } from '../../../../services/transaction.service';
import { HoldingDTO } from '../../../../models/holding.model';
import { OverviewDTO } from '../../../../models/overview.model';
import { ChangeDetectorRef } from '@angular/core';
import { LimitOrder } from '../../../../models/limitOrder.model';
import { Chart, registerables, } from 'chart.js';
import { StockPredictionResponse } from '../../../../models/StockPredictionResponse.model';
import 'chartjs-adapter-date-fns';
import { InsuranceComponent } from "../../components/insurance/insurance.component";


@Component({
  selector: 'app-dashboard-portfolio',
  standalone: true,
  imports: [CommonModule, ChartComponent, DragDropModule, WatchlistComponent, InsuranceComponent],
  templateUrl: './dashboard-portfolio.component.html',
  styleUrl: './dashboard-portfolio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPortfolioComponent implements OnInit {
  isExpanded = true;
  
  selectedAsset: AssetPortfolio | null = null;
  selectedHoldingMetrics: any | null = null;
  private assetService = inject(AssetService);
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);
  userAssets = this.assetService.userAssets;
  firstRowAssets = this.assetService.userAssets()?.slice(0, 4);
  expandableAssets = this.assetService.userAssets()?.slice(4);
  overviewData: OverviewDTO | null = null;
  holdingData: HoldingDTO[] | null = null;
  limitOrders: LimitOrder[] = [];
  selectedOrder: LimitOrder | null = null;
  selectedHolding: HoldingDTO | null = null;
  username: string = 'gaddour77';
  tt:number | undefined;

  ngOnInit(): void {
    this.fetchLimitOrders();
    this.fetchOverviewData();
    this.fetchHoldingData();
    Chart.register(...registerables);
  }

  fetchOverviewData(): void {
    this.transactionService.getOverviewData(this.username).subscribe(
      (data: OverviewDTO) => {
        this.overviewData = data;
        this.cdr.detectChanges();
        console.log('Overview data fetched:', data);
      },
      (error) => {
        console.error('Error fetching overview data:', error);
      }
    );
  }

  fetchHoldingData(): void {
    this.transactionService.getHolding(this.username).subscribe(
      (data: HoldingDTO[]) => {
        this.holdingData = data;
        this.cdr.detectChanges();
        console.log('Holding data fetched:', data);
      },
      (error) => {
        console.error('Error fetching holding data:', error);
      }
    );
  }

  fetchLimitOrders(): void {
    this.transactionService.getLimitOrders(this.username).subscribe(
      (data: LimitOrder[]) => {
        this.limitOrders = data;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching limit orders:', error);
      }
    );
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.cdr.detectChanges();
  }

  selectAsset(asset: AssetPortfolio) {
    this.selectedAsset = asset;
    this.cdr.detectChanges();
  }

  clearSelectedAsset() {
    this.selectedAsset = null;
    this.cdr.detectChanges();
  }

  showOrderDetails(order: LimitOrder): void {
    this.selectedOrder = order;
    this.cdr.detectChanges();
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
    this.cdr.detectChanges();
  }

  selectHolding(holding: HoldingDTO): void {
    this.selectedHolding = holding;
    this.tt = this.overviewData?.totalValue
    ? (holding.price * holding.quantity) / this.overviewData.totalValue
    : 0;
    this.assetService.getAssetMetrics(holding.assetSymbol).subscribe(
      (response) => {
        if (response?.metrics) {
          this.selectedHoldingMetrics = response.metrics;
          this.cdr.detectChanges();
          // Check if ScatterData exists and is valid before rendering
          if (this.selectedHoldingMetrics.ScatterData) {
            this.renderScatterChart(this.selectedHoldingMetrics.ScatterData);
          } else {
            console.error('ScatterData is missing or undefined.');
          }
  
          // Render Gaps Chart
          if (this.selectedHoldingMetrics.Gaps) {
            this.renderGapsChart(this.selectedHoldingMetrics.Gaps);
          } else {
            console.error('Gaps data is missing or undefined.');
          }
        }
      },
      (error) => {
        console.error('Error fetching holding metrics:', error);
      }
    );
  }

  clearSelectedHolding(): void {
    this.selectedHolding = null;
    this.selectedHoldingMetrics = null;
  
    // Clear charts
    const scatterCtx = document.getElementById('scatterChart') as HTMLCanvasElement;
    const gapsCtx = document.getElementById('gapsChart') as HTMLCanvasElement;
    if (scatterCtx) scatterCtx.getContext('2d')?.clearRect(0, 0, scatterCtx.width, scatterCtx.height);
    if (gapsCtx) gapsCtx.getContext('2d')?.clearRect(0, 0, gapsCtx.width, gapsCtx.height);
  
    this.cdr.detectChanges();
  }
  
  private renderScatterChart(data: any[]): void {
    if (!data || data.length === 0) {
      console.error('ScatterData is empty or undefined. Chart will not render.');
      return;
    }
  
    const ctx = document.getElementById('scatterChart') as HTMLCanvasElement;
  
    // Calculate trendline (linear regression)
    const regression = this.calculateLinearRegression(
      data.map(item => item.volume),
      data.map(item => item.close)
    );
  
    if (ctx) {
      new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            // Scatter points
            {
              label: 'Price vs. Volume',
              data: data.map(item => ({ x: item.volume, y: item.close })),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            // Trendline
            {
              label: `Trendline: y = ${regression.slope.toFixed(4)}x + ${regression.intercept.toFixed(4)}`,
              data: regression.linePoints,
              type: 'line',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              fill: false,
              pointRadius: 0, // Hide trendline points
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: { display: true, text: 'Volume' },
              type: 'linear',
            },
            y: {
              title: { display: true, text: 'Close Price' },
              type: 'linear',
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const rawData = context.raw as { x: number; y: number };
                  const date = new Date(data[context.dataIndex].date);
                  return `Date: ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} | Close: ${rawData.y} | Volume: ${rawData.x}`;
                },
              },
            },
          },
        },
      });
    }
  }
  
  // Helper function to calculate linear regression
  private calculateLinearRegression(xValues: number[], yValues: number[]) {
    const n = xValues.length;
    const xSum = xValues.reduce((sum, x) => sum + x, 0);
    const ySum = yValues.reduce((sum, y) => sum + y, 0);
    const xySum = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const xSquaredSum = xValues.reduce((sum, x) => sum + x * x, 0);
  
    const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;
  
    // Generate points for the trendline
    const linePoints = xValues.map(x => ({
      x,
      y: slope * x + intercept,
    }));
  
    return { slope, intercept, linePoints };
  }
  
  
  
  
  
  
  
  
  
  
  private renderGapsChart(data: any[]): void {
    if (!data || data.length === 0) {
      console.error('Gaps data is empty or undefined. Chart will not render.');
      return;
    }
  
    const ctx = document.getElementById('gapsChart') as HTMLCanvasElement;
  
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => {
            const date = new Date(item.date);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
          }),
          datasets: [
            {
              label: 'Gaps',
              data: data.map(item => item.gap),
              borderColor: 'rgba(255, 99, 132, 1)',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: { display: true, text: 'Date (dd/mm/yyyy)' },
            },
            y: {
              title: { display: true, text: 'Gap Value' },
            },
          },
        },
      });
    }
  }
}

