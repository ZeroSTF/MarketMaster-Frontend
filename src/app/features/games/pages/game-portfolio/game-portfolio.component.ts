
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrentGamesComponent } from '../../components/current-games/current-games.component';
import { LiveEventsComponent } from '../../components/live-events/live-events.component';
import { YourGamesComponent } from '../../components/your-games/your-games.component';
import { PortfolioSummaryComponent } from '../../components/portfolio-summary/portfolio-summary.component';
import { PortfolioPerformanceComponent } from '../../components/portfolio-performance/portfolio-performance.component';
import { CurrentHoldingsComponent } from '../../components/current-holdings/current-holdings.component';
import { RecentTransactionsComponent } from '../../components/recent-transactions/recent-transactions.component';
@Component({
  selector: 'app-game-portfolio',
  standalone: true,
  imports: [CommonModule,CurrentGamesComponent,LiveEventsComponent,YourGamesComponent,PortfolioSummaryComponent,PortfolioPerformanceComponent,CurrentHoldingsComponent,RecentTransactionsComponent],
  templateUrl: './game-portfolio.component.html',
  styleUrl: './game-portfolio.component.css'
})
export class GamePortfolioComponent {

}
