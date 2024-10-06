import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio-transactions',
  standalone: true,
  imports: [],
  templateUrl: './portfolio-transactions.component.html',
  styleUrl: './portfolio-transactions.component.css'
})
export class PortfolioTransactionsComponent {
  transactions = [
    { action: 'Bought', quantity: 5, stock: 'Tesla (TSLA)', price: 700, timestamp: '2 days ago' },
    { action: 'Sold', quantity: 3, stock: 'Microsoft (MSFT)', price: 300, timestamp: '1 week ago' }
  ];

  filterTransactions(timeframe: string) {
    // Implement filtering logic based on timeframe
  }
}