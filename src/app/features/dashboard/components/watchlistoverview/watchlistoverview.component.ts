import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-watchListoverview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watchlistoverview.component.html',
  styleUrls: ['./watchlistoverview.component.css']
})
export class WatchlistoverviewComponent {
  watchList = [
    {  symbol: 'CMPA', performance: 15.2, category: 'Tech' },
    {  symbol: 'CMPB', performance: 8.5, category: 'Finance' },
    {  symbol: 'CMPC', performance: 12.0, category: 'Healthcare' },
    {  symbol: 'CMPD', performance: 7.3, category: 'Energy' }
  ];

  bestWinners = [
    {  symbol: 'WNRA', performance: 18.7, category: 'Tech' },
    {  symbol: 'WNRB', performance: 14.3, category: 'Healthcare' },
    {  symbol: 'WNRC', performance: 16.9, category: 'Finance' },
    {  symbol: 'WNRD', performance: 11.2, category: 'Energy' }
  ];
}
