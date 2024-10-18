import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetPortfolio } from '../../../../models/asset.model';
import { ChartComponent } from '../../components/chart/chart.component';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, ChartComponent, DragDropModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent  {
  isExpanded = false;

  //
  userAssets: AssetPortfolio[] = [
    { name: 'Apple Inc', symbol: 'AAPL', percentChange: 0.66, portfolioValue: 15215.70, trendImageUrl: 'images/upTrend.png' },
    { name: 'Microsoft Corp', symbol: 'MSFT', percentChange: -0.32, portfolioValue: 12500.50, trendImageUrl: 'images/downTrend.png' },
    { name: 'Amazon.com Inc', symbol: 'AMZN', percentChange: 1.25, portfolioValue: 9800.30, trendImageUrl: 'images/upTrend.png' },
    { name: 'Alphabet Inc', symbol: 'GOOGL', percentChange: 0.88, portfolioValue: 11300.20, trendImageUrl: 'images/upTrend.png' },
    { name: 'Meta Platforms Inc', symbol: 'META', percentChange: -0.75, portfolioValue: 8700.60, trendImageUrl: 'images/downTrend.png' },
    { name: 'Tesla Inc', symbol: 'TSLA', percentChange: 2.10, portfolioValue: 7500.40, trendImageUrl: 'images/upTrend.png' },
    { name: 'NVIDIA Corp', symbol: 'NVDA', percentChange: 1.50, portfolioValue: 10200.80, trendImageUrl: 'images/upTrend.png' },
    { name: 'JPMorgan Chase & Co', symbol: 'JPM', percentChange: -0.20, portfolioValue: 6800.90, trendImageUrl: 'images/downTrend.png' }
  ];
  // First row for the "Holdings" (first four by default)
  firstRowAssets = this.userAssets.slice(0, 4);
  
  // Remaining assets for expandable section
  expandableAssets = this.userAssets.slice(4);

  drop(event: CdkDragDrop<any[]>) {
    console.log('Drop event triggered:', event);  // Console log to check the event object
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
  
}

 
