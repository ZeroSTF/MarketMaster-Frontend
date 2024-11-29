import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../../services/transaction.service';
import { Transaction } from '../../../../models/Transaction.model';

@Component({
  selector: 'app-tradesoverview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tradesoverview.component.html',
  styleUrls: ['./tradesoverview.component.css']
})
export class TradesoverviewComponent implements OnInit {
  selectedTab: string = 'openTrades';
  transactionData: Transaction[] | null = null;
  username: string = 'zerostf';

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.selectedTab = 'openTrades';
    
    this.transactionService.getTransaction(this.username).subscribe(
      (data: Transaction[]) => {
        this.transactionData = data;
        console.log('transaction data fetched:', data);
      },
      (error) => {
        console.error('Error fetching transaction data:', error);
      }
    );
    this.getTransactionsForSelectedTab();
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  getRowBackground(index: number) {
    const baseColor = '#1E88E5'; // A fixed blue base color
    // Generate a unique shade of blue for each row by modifying the lightness using HSL
    const lightness = 95 - (index % 10) * 5;  // Vary lightness for each row
    
    return {
      'background': `hsl(210, 100%, ${lightness}%)` // Use HSL for dynamic lightness
    };
  }
  
  
  
  getTransactionsForSelectedTab(): Transaction[] {
    if (this.transactionData === null || this.transactionData.length === 0) {
      return [];
    }
  
    console.log('Selected Tab:', this.selectedTab);
    console.log('Filtered Data:', this.transactionData);
  
    switch (this.selectedTab) {
      case 'openTrades':
        const openTrades = this.transactionData.filter(transaction => transaction.type === 'BUY');
        console.log('Open Trades:', openTrades);
        return openTrades;
      case 'closedTrades':
        const closedTrades = this.transactionData.filter(transaction => transaction.type === 'SELL');
        console.log('Closed Trades:', closedTrades);
        return closedTrades;
      case 'allTrades':
        console.log('All Trades:', this.transactionData);
        return this.transactionData;
      default:
        return [];
    }
  }
}