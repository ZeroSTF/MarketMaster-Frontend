import { Component, inject, OnInit } from '@angular/core';
import { AssetService } from '../../../../services/asset.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../../services/transaction.service';
import { TransactionDTO, TransactionType } from '../../../../models/transaction.model';

@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './assetdetails.component.html',
  styleUrl: './assetdetails.component.css'
})
export class AssetdetailsComponent {
  showBuyForm: boolean = false;
  buyTransaction: TransactionDTO = {
    symbol: '',
    quantity: 0,
    price: 0,
    timeStamp: new Date(),
    type: TransactionType.BUY
  };

  private assetService = inject(AssetService);
  private transactionService = inject(TransactionService);
  public selectedAsset = this.assetService.selectedAsset;

  expandedNews: { [key: number]: boolean } = {};
  activeTab: 'overview' | 'financial' | 'news' = 'overview';

  newsItems = [
    {
      id: 1,
      headline: 'Breaking News: Major Market Movement',
      content: 'Detailed content about the market movement...'
    },
    {
      id: 2,
      headline: 'Quarterly Earnings Report Released',
      content: 'Details about the quarterly earnings...'
    },
    {
      id: 3,
      headline: 'New Product Launch Announced',
      content: 'Information about the new product launch...'
    }
  ];

  setActiveTab(tab: 'overview' | 'financial' | 'news') {
    this.activeTab = tab;
  }

  toggleFullText(id: number) {
    this.expandedNews[id] = !this.expandedNews[id];
  }

  openBuyForm() {
    const asset = this.selectedAsset();
    if (asset) {
      // Initialize the buyTransaction with current asset data
      this.buyTransaction = {
        symbol: asset.symbol,
        quantity: 0,
        price: asset.currentPrice,
        timeStamp: new Date(),
        type: TransactionType.BUY
      };
    }
    this.showBuyForm = !this.showBuyForm;
  }

  submitBuyTransaction() {
    // Ensure symbol and price are set
    const asset = this.selectedAsset();
    if (asset) {
      this.buyTransaction.symbol = asset.symbol;
      this.buyTransaction.price = asset.currentPrice;
      this.buyTransaction.timeStamp = new Date();

      console.log('Submitting transaction:', this.buyTransaction);
      
      this.transactionService.addTransaction(this.buyTransaction).subscribe({
        next: (response) => {
          console.log('Transaction added successfully:', response);
          this.showBuyForm = false; // Close the form
          // Reset the form
          this.buyTransaction = {
            symbol: '',
            quantity: 0,
            price: 0,
            timeStamp: new Date(),
            type: TransactionType.BUY
          };
        },
        error: (error) => {
          console.error('Error adding transaction:', error);
        }
      });
    }
  }
}