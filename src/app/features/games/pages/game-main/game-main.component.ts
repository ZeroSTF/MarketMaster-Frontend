import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { loadGameState, makeTransaction } from '../../../../store/actions/game.actions';
import { GameState } from '../../../../store/actions/game.reducer';
import { GameDashboardComponent } from '../../components/game-dashboard/game-dashboard.component';
import { ChandelierGraphComponent } from '../../components/chandelier-graph/chandelier-graph.component';
import { LeaderboardComponent } from '../../components/leaderboard/leaderboard.component';
import { HoldingsComponent } from '../../components/holdings/holdings.component';
import { TradeFormComponent } from '../../components/trade-form/trade-form.component';
import { GameNewsComponent } from '../../components/game-news/game-news.component';
import { GameHoldingsComponent } from '../../components/game-holdings/game-holdings.component';
import { selectGameData, selectIsPaused, selectSpeed } from '../../../../store/actions/game.selectors';
import { GameStateDto } from '../../../../models/game-state-dto';
import { TransactionDto } from '../../../../services/game.service';

@Component({
  selector: 'app-game-main',
  standalone: true,
  imports: [
    CommonModule,
    GameDashboardComponent,
    ChandelierGraphComponent,
    LeaderboardComponent,
    HoldingsComponent,
    TradeFormComponent,
    GameNewsComponent,
    GameHoldingsComponent,
  ],
  templateUrl: './game-main.component.html',
  styleUrls: ['./game-main.component.css'],
})
export class GameMainComponent implements OnInit {
  gameState$!: Observable<GameStateDto | null>;
  isPaused$!: Observable<boolean>;
  speed$!: Observable<number>;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the gameId from the route
    const gameId = +this.route.snapshot.paramMap.get('gameId')!;
    const username = 'koussaykoukii'; // Replace with dynamic username if needed

    // Dispatch action to load the game state
    this.store.dispatch(loadGameState({ gameId, username }));

    // Select the game state and other observables from the store
    this.gameState$ = this.store.select(selectGameData);
    this.isPaused$ = this.store.select(selectIsPaused);
    this.speed$ = this.store.select(selectSpeed);

    // Debugging: Log the game state to the console
    this.gameState$.subscribe((state) => {
      console.log('Game State:', state);
    });
  }

  processTransaction(transaction: TransactionDto): void {
    console.log('Processing Transaction:', transaction);
    this.store.dispatch(makeTransaction({ transaction }));
  }
}
