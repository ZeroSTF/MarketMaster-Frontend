import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../../services/transaction.service';
import { Transaction } from '../../../../models/Transaction.model';
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'app-tradesoverview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tradesoverview.component.html',
  styleUrls: ['./tradesoverview.component.css'],
})
export class TradesoverviewComponent implements OnInit {
  selectedTab: string = 'openTrades'; // Default selected tab
  transactionData: Transaction[] | null = null; // Raw transaction data
  filteredTransactions: Transaction[] = []; // Filtered transactions based on the tab
  username: string = 'zerostf';
  private authService = inject(AuthService);

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    // Get the current user
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.username = currentUser.username;
    }

    // Fetch transaction data
    this.transactionService.getTransaction(this.username).subscribe(
      (data: Transaction[]) => {
        this.transactionData = data;
        console.log('Transaction data fetched:', data);

        // Filter data based on the default selected tab
        this.filterTransactions();
      },
      (error) => {
        console.error('Error fetching transaction data:', error);
      }
    );
  }

  // Tab selection
  selectTab(tab: string) {
    this.selectedTab = tab;

    // Re-filter transactions when the tab changes
    this.filterTransactions();
  }

  // Get row background color dynamically
  getRowBackground(index: number) {
    const baseColor = '#1E88E5'; // Fixed blue base color
    const lightness = 95 - (index % 10) * 5; // Dynamic lightness per row
    return {
      background: `hsl(210, 100%, ${lightness}%)`, // HSL for dynamic lightness
    };
  }

  // Filter transactions based on the selected tab
  filterTransactions() {
    if (!this.transactionData || this.transactionData.length === 0) {
      this.filteredTransactions = [];
      return;
    }

    switch (this.selectedTab) {
      case 'openTrades':
        this.filteredTransactions = this.transactionData.filter(
          (transaction) => transaction.type === 'BUY'
        );
        break;
      case 'closedTrades':
        this.filteredTransactions = this.transactionData.filter(
          (transaction) => transaction.type === 'SELL'
        );
        break;
      case 'allTrades':
        this.filteredTransactions = this.transactionData;
        break;
      default:
        this.filteredTransactions = [];
    }

    console.log('Filtered Transactions:', this.filteredTransactions);
  }
}
