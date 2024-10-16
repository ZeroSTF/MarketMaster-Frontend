import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // <-- Import CommonModule

@Component({
  selector: 'app-tradesoverview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tradesoverview.component.html',
  styleUrl: './tradesoverview.component.css'
})
export class TradesoverviewComponent {
  selectedTab: string = 'openTrades';

  // Mocked trades data for demonstration
  trades = [
    { id: 1, symbol: 'AAPL', type: 'Buy', amount: 10, price: 145.67, status: 'Open' },
    { id: 2, symbol: 'GOOGL', type: 'Sell', amount: 5, price: 2734.5, status: 'Closed' },
    { id: 3, symbol: 'AMZN', type: 'Buy', amount: 8, price: 3325.0, status: 'Closed' },
    // More trades...
  ];

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  getTradesForSelectedTab() {
    switch (this.selectedTab) {
      case 'openTrades':
        return this.trades.filter(trade => trade.status === 'Open');
      case 'closedTrades':
        return this.trades.filter(trade => trade.status === 'Closed');
      case 'allTrades':
        return this.trades;
      default:
        return [];
    }
  }
}
