import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetPortfolio } from '../../../../models/asset.model';
import { ChartComponent } from '../../components/chart/chart.component';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { WatchlistComponent } from '../../components/watchlist/watchlist.component';
import { AssetService } from '../../../../services/asset.service';

@Component({
  selector: 'app-dashboard-portfolio',
  standalone: true,
  imports: [CommonModule, ChartComponent, DragDropModule, WatchlistComponent ],
  templateUrl: './dashboard-portfolio.component.html',
  styleUrl: './dashboard-portfolio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DashboardPortfolioComponent  {
  isExpanded = true;
  selectedAsset: AssetPortfolio | null = null;
  private assetService = inject(AssetService);
  userAssets = this.assetService.userAssets;
  firstRowAssets = this.assetService.userAssets()?.slice(0, 4);
  expandableAssets = this.assetService.userAssets()?.slice(4);

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
  
}

 
