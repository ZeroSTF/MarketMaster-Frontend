import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio-watchlist',
  standalone: true,
  imports: [],
  templateUrl: './portfolio-watchlist.component.html',
  styleUrl: './portfolio-watchlist.component.css'
})
export class PortfolioWatchlistComponent {
  watchlist = [
    { stock: 'Google (GOOGL)', price: 2800, change: '+1.5%' },
    { stock: 'Amazon (AMZN)', price: 3300, change: '-0.7%' }
  ];
}