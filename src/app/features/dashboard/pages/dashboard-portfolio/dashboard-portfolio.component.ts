import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
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
import { Chart, registerables, ScriptableContext, } from 'chart.js';
import { StockPredictionResponse } from '../../../../models/StockPredictionResponse.model';
import 'chartjs-adapter-date-fns';
import { PortfolioService } from '../../../../services/portfolio.service';
import 'chartjs-chart-matrix';
import { AuthService } from '../../../../auth/auth.service';


@Component({
  selector: 'app-dashboard-portfolio',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './dashboard-portfolio.component.html',
  styleUrl: './dashboard-portfolio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPortfolioComponent implements OnInit {
  isExpanded = true;
  activeChart: string = 'heatmap';
  selectedAsset: AssetPortfolio | null = null;
  selectedHoldingMetrics: any | null = null;
  private assetService = inject(AssetService);
  private transactionService = inject(TransactionService);
  private portfolioService = inject(PortfolioService);
  private cdr = inject(ChangeDetectorRef);
  userAssets = this.assetService.userAssets;
  firstRowAssets = this.assetService.userAssets()?.slice(0, 4);
  expandableAssets = this.assetService.userAssets()?.slice(4);
  overviewData: OverviewDTO | null = null;
  holdingData: HoldingDTO[] | null = null;
  limitOrders: LimitOrder[] = [];
  selectedOrder: LimitOrder | null = null;
  selectedHolding: HoldingDTO | null = null;
  username: string = 'Zerostf';
  tt:number | undefined;
  portfolioPerformances: any[] = [];
  heatmapChart: any;
  correlationMatrix: any = null;
  correlationChart: any;
  recommendation: any;
  isLoadingRecommendation = false;
  historicPriceData: any[] = [];
  fibonacciLevels: any = {};
  activeFibonacciChart: number = 1;
  fibonacciChartInstance: Chart | null = null;
  
  private authService=inject(AuthService);
  constructor(){
    
  }
  ngOnInit(): void {
    const currentUser=this.authService.currentUser();
   if(currentUser){
   this.username=currentUser.username;
   console.log("hhhhh",currentUser);
   }
    this.fetchLimitOrders();
    this.fetchOverviewData();
    this.fetchHoldingData();

    this.fetchPortfolioPerformances();
    this.fetchCorrelationMatrix();
    Chart.register(...registerables);
  }
  cancelLimitOrder(): void {
    if (!this.selectedOrder) return;
  
    this.transactionService.deleteLimitOrder(this.username, this.selectedOrder).subscribe({
      next: () => {
        // Remove the order from the list
        this.limitOrders = this.limitOrders.filter(order => order !== this.selectedOrder);
        this.selectedOrder = null; // Close the widget
        this.cdr.detectChanges();
        console.log('Limit order deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting limit order:', err);
      },
    });
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
  fetchCorrelationMatrix(): void {
    this.portfolioService.getCorrelationMatrix(this.username).subscribe(
      (data) => {
        this.correlationMatrix = data;
        
        // Use a small timeout to ensure the DOM is updated
        setTimeout(() => {
          this.renderCorrelationChart();
        }, 100); // Delay ensures the canvas is in the DOM
      },
      (error) => {
        console.error('Error fetching correlation matrix:', error);
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
      this.assetService.getAssetRecommendations(holding.assetSymbol).subscribe({
        next: (data) => {
          console.log('API Response:', data); 
    
          if (data?.recommendation) {
            this.recommendation = data.recommendation;
          } else {
            console.warn('No recommendation data found:', data);
            this.recommendation = null;
          }
    
          this.isLoadingRecommendation = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching recommendations:', error);
          
          this.recommendation = null;
          this.isLoadingRecommendation = false;
          this.cdr.detectChanges();
        },
      });

      this.assetService.getAssetMetrics(holding.assetSymbol).subscribe((response) => {
        if (response?.metrics) {
          this.selectedHoldingMetrics = response.metrics;
          this.cdr.detectChanges();
  
          // Fetch and render historical price data for Fibonacci Chart
          this.assetService.historicPrice(holding.assetSymbol).subscribe((data) => {
            this.historicPriceData = data.close_date_list;
  
            // Render active Fibonacci chart
            if (this.activeFibonacciChart === 1) {
              this.renderFibonacciChart(this.selectedHoldingMetrics.fibonacci);
            } else {
              this.renderFibonacciChartVersion2(this.selectedHoldingMetrics.fibonacci, this.historicPriceData);
            }
  
            // Render Gaps Chart
            if (this.selectedHoldingMetrics.gaps) {
              this.renderGapsChart(this.selectedHoldingMetrics.gaps);
            }
          });
        }
      });
  }
  toggleFibonacciChart(version: number): void {
    this.activeFibonacciChart = version;

    if (version === 1) {
      this.renderFibonacciChart(this.selectedHoldingMetrics?.fibonacci);
    } else if (version === 2 && this.historicPriceData.length > 0) {
      this.renderFibonacciChartVersion2(this.selectedHoldingMetrics?.fibonacci, this.historicPriceData);
    }
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

  private renderFibonacciChart(levels: any): void {
    const ctx = document.getElementById('fibonacciChart') as HTMLCanvasElement;

    // Détruire l'instance existante avant de créer un nouveau graphique
    if (this.fibonacciChartInstance) {
      this.fibonacciChartInstance.destroy();
    }

    if (!ctx || !levels) return;

    const labels = ['0%', '23.6%', '38.2%', '50%', '61.8%', '100%'];
    const dataPoints = [levels['0%'], levels['23.6%'], levels['38.2%'], levels['50%'], levels['61.8%'], levels['100%']];

    this.fibonacciChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Fibonacci Levels',
            data: dataPoints,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { title: { display: true, text: 'Price' } } },
      },
    });
  }
 
  private renderFibonacciChartVersion2(levels: any, data: any[]): void {
    const ctx = document.getElementById('fibonacciChart') as HTMLCanvasElement;

    // Détruire l'instance existante avant de créer un nouveau graphique
    if (this.fibonacciChartInstance) {
      this.fibonacciChartInstance.destroy();
    }

    if (!ctx || !data || !levels) return;

    const labels = data.map((item: any) => new Date(item.date).toLocaleDateString());
    const prices = data.map((item: any) => item.close);

    const fibonacciLevels = [
      { level: '0%', value: levels['0%'], color: '#FFEBEE' },
      { level: '23.6%', value: levels['23.6%'], color: '#FFCDD2' },
      { level: '38.2%', value: levels['38.2%'], color: '#F8BBD0' },
      { level: '50%', value: levels['50%'], color: '#E1BEE7' },
      { level: '61.8%', value: levels['61.8%'], color: '#D1C4E9' },
      { level: '100%', value: levels['100%'], color: '#BBDEFB' },
    ];

    this.fibonacciChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Price History',
            data: prices,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
          ...fibonacciLevels.map((fib) => ({
            label: `Fibonacci ${fib.level}`,
            data: Array(data.length).fill(fib.value),
            borderColor: fib.color,
            borderWidth: 1.5,
            fill: false,
          })),
        ],
      },
      options: {
        responsive: true,
        scales: { x: { title: { display: true, text: 'Date' } }, y: { title: { display: true, text: 'Price' } } },
      },
    });
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

  fetchPortfolioPerformances(): void {
   
    this.portfolioService.getPortfolioPerformances(this.username).subscribe(
      (data) => {
        this.portfolioPerformances = data;
        this.renderHeatmap();
      },
      (error) => {
        console.error('Error fetching portfolio performances:', error);
      }
    );
  }

  renderHeatmap(): void {
    const ctx = document.getElementById('heatmapChart') as HTMLCanvasElement;

    if (this.heatmapChart) {
      this.heatmapChart.destroy(); // Destroy existing chart before rendering a new one
    }

    const labels = this.portfolioPerformances.map((item) => item.symbol);
    const performances = this.portfolioPerformances.map((item) => item.performance);

    this.heatmapChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Performance (%)',
            data: performances,
            backgroundColor: performances.map((p) =>
              p > 0 ? 'rgba(75, 192, 192, 0.7)' : 'rgba(255, 99, 132, 0.7)'
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel: (context) => {
                const currentPrice = this.portfolioPerformances[context.dataIndex].currentPrice;
                return `Current Price: $${currentPrice.toFixed(2)}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Performance (%)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Assets',
            },
          },
        },
      },
    });
  }

  renderCorrelationChart(): void {
    const chartContainer = document.getElementById('correlationChart') as HTMLCanvasElement;
  
    if (!chartContainer) {
      console.error('Correlation Chart container not found.');
      console.log('Active chart:', this.activeChart);
      return;
    }
  
    // Proceed with rendering logic if the element exists
    if (this.correlationChart) {
      this.correlationChart.destroy(); // Destroy the previous chart instance
    }
  
    const labels: string[] = Object.keys(this.correlationMatrix);
    const dataPoints: { x: number; y: number; v: number }[] = [];
  
    labels.forEach((rowLabel, rowIndex) => {
      labels.forEach((colLabel, colIndex) => {
        dataPoints.push({
          x: rowIndex,
          y: colIndex,
          v: this.correlationMatrix[rowLabel][colLabel],
        });
      });
    });
  
    this.correlationChart = new Chart(chartContainer.getContext('2d')!, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Correlation Matrix',
            data: dataPoints.map((point) => ({
              x: point.x,
              y: point.y,
              v: point.v,
            })),
            pointBackgroundColor: dataPoints.map((point) =>
              point.v > 0.7
                ? 'rgba(75, 192, 192, 0.7)'
                : point.v > 0.3
                ? 'rgba(255, 206, 86, 0.7)'
                : 'rgba(255, 99, 132, 0.7)'
            ),
            pointRadius: dataPoints.map((point) => Math.abs(point.v) * 10), // Scale radius
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Assets',
            },
            ticks: {
              callback: (value) => labels[value as number],
            },
          },
          y: {
            title: {
              display: true,
              text: 'Assets',
            },
            ticks: {
              callback: (value) => labels[value as number],
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const rawData = tooltipItem.raw as { x: number; y: number; v: number };
                const { x, y, v } = rawData;
                return `${labels[x]} ↔ ${labels[y]}: ${v.toFixed(2)}`;
              },
            },
          },
        },
      },
    });
  }
  



  
  
  
  
  
  
  
  
  
  
  
  
  
}

