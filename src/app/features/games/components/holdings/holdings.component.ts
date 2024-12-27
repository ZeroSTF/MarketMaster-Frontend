import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
interface Holding {
  name: string;
  quantity: number;
  currentPrice: number;
}

@Component({
  selector: 'app-holdings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.css']
})
export class HoldingsComponent implements OnInit {
  holdings: Holding[] = [
    { name: 'Apple', quantity: 50, currentPrice: 150 },
    { name: 'Google', quantity: 30, currentPrice: 2800 },
    { name: 'Microsoft', quantity: 20, currentPrice: 300 },
  ];

  constructor() {}

  ngOnInit(): void {}

  // Calculate total value of each holding
  getTotalValue(holding: Holding): number {
    return holding.quantity * holding.currentPrice;
  }

  // Calculate total portfolio value
  getPortfolioValue(): number {
    return this.holdings.reduce((acc, holding) => acc + this.getTotalValue(holding), 0);
  }
}
