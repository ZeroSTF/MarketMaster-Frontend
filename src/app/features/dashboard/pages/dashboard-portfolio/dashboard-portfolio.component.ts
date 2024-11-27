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

@Component({
  selector: 'app-dashboard-portfolio',
  standalone: true,
  imports: [CommonModule, ChartComponent, DragDropModule, WatchlistComponent ],
  templateUrl: './dashboard-portfolio.component.html',
  styleUrl: './dashboard-portfolio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class DashboardPortfolioComponent implements OnInit  {
  isExpanded = true;
  selectedAsset: AssetPortfolio | null = null;
  private assetService = inject(AssetService);
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);
  userAssets = this.assetService.userAssets;
  firstRowAssets = this.assetService.userAssets()?.slice(0, 4);
  expandableAssets = this.assetService.userAssets()?.slice(4);
  overviewData: OverviewDTO | null = null; 
  holdingData : HoldingDTO[] | null =null;
  limitOrders: LimitOrder[] = [];
  selectedOrder: LimitOrder | null = null;
  username: string = 'zerostf'; 
  ngOnInit(): void {
    this.fetchLimitOrders();
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
    this.transactionService.getHolding(this.username).subscribe(
      (data: HoldingDTO[])=>{
        this.holdingData =data;
        this.cdr.detectChanges();
        console.log('Overview data fetched:', data); 
      },
      (error) => {
        console.error('Error fetching overview data:', error); 
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
  }

  selectAsset(asset: AssetPortfolio) {
    this.selectedAsset = asset;
  }

  clearSelectedAsset() {
    this.selectedAsset = null;
  }
  fetchLimitOrders(): void {
    this.transactionService.getLimitOrders(this.username).subscribe(
      (data: LimitOrder[]) => {
        this.limitOrders = data;
      },
      (error) => {
        console.error('Error fetching limit orders:', error);
      }
    );
  }
  showOrderDetails(order: LimitOrder): void {
    this.selectedOrder = order;
  }


  closeOrderDetails(): void {
    this.selectedOrder = null;
  }
}

 
