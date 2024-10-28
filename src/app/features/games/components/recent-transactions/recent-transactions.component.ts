import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
interface Transaction {
  symbol: string;
  quantity: number;
  price: number;
  value: number;
  change: string;
}

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-transactions.component.html',
  styleUrls: ['./recent-transactions.component.css']
})
export class RecentTransactionsComponent implements OnInit {

  transactions: Transaction[] = [];  // Array to hold recent transactions

  ngOnInit(): void {
    this.fetchRecentTransactions();  // Fetch the transactions on component load
  }

  // Simulated function to fetch recent transactions (replace with actual API call)
  fetchRecentTransactions(): void {
    this.transactions = [
      { symbol: 'AAPL', quantity: 10, price: 150, value: 1500, change: '+2%' },
      { symbol: 'TSLA', quantity: 5, price: 700, value: 3500, change: '-1%' },
      { symbol: 'AMZN', quantity: 2, price: 3000, value: 6000, change: '+3%' },
      { symbol: 'GOOGL', quantity: 4, price: 2800, value: 11200, change: '+1.5%' },
      { symbol: 'MSFT', quantity: 8, price: 290, value: 2320, change: '-0.5%' },
      // Add more transactions as needed
    ];
  }
}
