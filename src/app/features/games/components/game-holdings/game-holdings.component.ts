import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Holding {
  symbol: string;
  quantity: number;
  currentPrice: number; // Current price of the stock
}

@Component({
  selector: 'app-game-holdings',
  templateUrl: './game-holdings.component.html',
  styleUrls: ['./game-holdings.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GameHoldingsComponent {
  holdings: Holding[] = [
    { symbol: 'AAPL', quantity: 50, currentPrice: 175.32 },
    { symbol: 'TSLA', quantity: 10, currentPrice: 695.22 },
    { symbol: 'AMZN', quantity: 5, currentPrice: 3204.56 },
    { symbol: 'GOOGL', quantity: 8, currentPrice: 2784.12 },
  ];
}
