import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketDataService } from '../../../../services/market-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-market-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-data.component.html',
  styleUrls: ['./market-data.component.css'] // Optional: for styles
})
export class MarketDataComponent implements OnInit, OnDestroy {
  marketData: any; // Variable to hold the market data updates
  private subscription: Subscription | null = null;

  constructor(private marketDataService: MarketDataService) {}

  ngOnInit(): void {
    // Start receiving market data updates
    this.subscription = this.marketDataService.getMarketDataUpdates().subscribe(data => {
      console.log('Received market data:', data); // Log the data here
      this.marketData = data;
    });

    // Optionally, initiate a request for market data
    // This can be triggered by user input instead if needed
    this.marketDataService.requestMarketData(13, 'AAPL', 5); // Example gameId, assetSymbol, updateRate
  }

  ngOnDestroy(): void {
    // Clean up subscription when the component is destroyed
    this.subscription?.unsubscribe();
  }
}
