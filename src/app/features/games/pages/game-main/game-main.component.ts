import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChandelierGraphComponent } from '../../components/chandelier-graph/chandelier-graph.component';
import { LeaderboardComponent } from '../../components/leaderboard/leaderboard.component';
import { HoldingsComponent } from '../../components/holdings/holdings.component';
import { TradeFormComponent } from '../../components/trade-form/trade-form.component';
import { LiveEventsComponent } from '../../components/live-events/live-events.component';
import { MarketDataComponent } from '../../components/market-data/market-data.component';
import { GameNewsComponent } from '../../components/game-news/game-news.component';

@Component({
  selector: 'app-game-main',
  standalone: true,
  imports: [
    CommonModule,
    ChandelierGraphComponent,
    LeaderboardComponent,
    HoldingsComponent,
    TradeFormComponent,
    LiveEventsComponent,
    MarketDataComponent,
    GameNewsComponent
  ],
  templateUrl: './game-main.component.html',
  styleUrls: ['./game-main.component.css'],
})
export class GameMainComponent {}
