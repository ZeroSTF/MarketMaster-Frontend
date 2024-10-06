import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio-holdings',
  templateUrl: './portfolio-holdings.component.html',
  styleUrls: ['./portfolio-holdings.component.css']
})
export class PortfolioHoldingsComponent {
  holdings = [
    {
      stock: 'Apple (AAPL)',
      quantity: 10,
      price: 150,
      change: 0.02, // Change percentage as a decimal
      totalValue: 1500,
      purchaseDate: '01/02/2024',
      dividendYield: '0.5%',
      weekHigh: 180,
      showDetails: false
    },
    {
      stock: 'Tesla (TSLA)',
      quantity: 5,
      price: 700,
      change: -0.01,
      totalValue: 3500,
      purchaseDate: '01/01/2024',
      dividendYield: 'N/A',
      weekHigh: 800,
      showDetails: false
    },
    // Add more holdings here...
  ];

  toggleDetails(holding: { showDetails: boolean; }) {
    holding.showDetails = !holding.showDetails;
  }
}
