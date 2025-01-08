import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, interval } from 'rxjs';
import { selectCash, selectGameData, selectIsPaused, selectLastMarketDataTimestamp } from '../../../../store/actions/game.selectors'; 
import { updateSimulationTime, persistSimulationTime, pauseGame, resumeGame } from '../../../../store/actions/game.actions'; 
import { GameStateDto } from '../../../../models/game-state-dto'; 
import { Router } from '@angular/router'; // Import Router for navigation
import { GameService } from '../../../../services/game.service'; // Import GameService
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog for the popup
import { GameResultsDialogComponent } from '../game-results-dialog/game-results-dialog.component';

@Component({
  selector: 'app-game-dashboard',
  templateUrl: './game-dashboard.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./game-dashboard.component.css'],
})
export class GameDashboardComponent implements OnInit, OnDestroy {
  gameState$!: Observable<GameStateDto | null>;
  isPaused$!: Observable<boolean>;
  currentSimulationTime: string | null = null;
  gameParticipationId: number | null = null; // Store the gameParticipationId as a number
  cash$!: Observable<number>;
  lastMarketDataTimestamp$!: Observable<string | null>; // Add this observable
  isGameFinished = false; // Track if the game is finished

  private subscription!: Subscription;
  private simulationInterval$!: Subscription;
  private speedMultiplier = 1; // Default speed (1x)

  constructor(
    private store: Store, 
    private cdRef: ChangeDetectorRef,
    private router: Router, // Inject Router for navigation
    private gameService: GameService, // Inject GameService
    private dialog: MatDialog // Inject MatDialog for the popup
  ) {}

  ngOnInit(): void {
    this.gameState$ = this.store.select(selectGameData);
    this.isPaused$ = this.store.select(selectIsPaused);
    this.cash$ = this.store.select(selectCash);
    this.lastMarketDataTimestamp$ = this.store.select(selectLastMarketDataTimestamp); 

    // Subscribe to the game state and update simulation time
    this.subscription = this.gameState$.subscribe((gameState) => {
      if (gameState?.gameParticipation?.lastPauseTimestamp) {
        this.currentSimulationTime = gameState.gameParticipation.lastPauseTimestamp;
        this.gameParticipationId = gameState.gameParticipation.id; 
        this.cdRef.detectChanges();
      }
    });

    // Check if the game is finished
    this.subscription.add(
      this.lastMarketDataTimestamp$.subscribe((lastMarketDataTimestamp) => {
        if (this.currentSimulationTime && lastMarketDataTimestamp) {
          const currentTime = new Date(this.currentSimulationTime).getTime();
          const lastMarketTime = new Date(lastMarketDataTimestamp).getTime();

          if (currentTime >= lastMarketTime) {
            this.isGameFinished = true;
            this.store.dispatch(pauseGame()); // Pause the game when it finishes
            this.showGameOverMessage(); // Show a "Game Over" message or redirect
          }
        }
      })
    );

    // Start simulation time increment
    this.startSimulationTime();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.simulationInterval$) this.simulationInterval$.unsubscribe();
  }

  private startSimulationTime(): void {
    // Update the simulation time based on the speed multiplier
    this.simulationInterval$ = interval(60000 / this.speedMultiplier).subscribe(() => {
      if (this.currentSimulationTime && !this.isGameFinished) { // Only update if the game is not finished
        const newTime = new Date(this.currentSimulationTime);
        newTime.setMinutes(newTime.getMinutes() + 15);

        this.currentSimulationTime = newTime.toISOString();
        this.store.dispatch(updateSimulationTime({ updatedTime: this.currentSimulationTime }));

        // Persist the updated time in the database, including the gameParticipationId as a number
        if (this.gameParticipationId) {
          this.store.dispatch(persistSimulationTime({ 
            updatedTime: this.currentSimulationTime, 
            gameParticipationId: this.gameParticipationId // Pass as a number
          }));
        }

        // Check if the game is over after updating the time
        this.checkIfGameIsOver();

        this.cdRef.detectChanges();
      }
    });
  }

  // Reusable method to check if the game is over
  private checkIfGameIsOver(): void {
    if (this.currentSimulationTime && this.lastMarketDataTimestamp$) {
      this.lastMarketDataTimestamp$.subscribe((lastMarketDataTimestamp) => {
        if (lastMarketDataTimestamp) {
          const currentTime = new Date(this.currentSimulationTime!).getTime();
          const lastMarketTime = new Date(lastMarketDataTimestamp).getTime();

          if (currentTime >= lastMarketTime) {
            this.isGameFinished = true;
            this.store.dispatch(pauseGame()); // Pause the game when it finishes
            this.showGameOverMessage(); // Show a "Game Over" message or redirect
          }
        }
      });
    }
  }

  private restartSimulationTime(): void {
    if (this.simulationInterval$) this.simulationInterval$.unsubscribe();
    this.startSimulationTime();
  }

  increaseSpeed(): void {
    if (this.speedMultiplier < 128 && !this.isGameFinished) { // Disable if the game is finished
      this.speedMultiplier *= 2;
      this.restartSimulationTime();
    }
  }

  decreaseSpeed(): void {
    if (this.speedMultiplier > 0.125 && !this.isGameFinished) { // Disable if the game is finished
      this.speedMultiplier /= 2;
      this.restartSimulationTime();
    }
  }

  togglePause(): void {
    if (this.isGameFinished) return;

    this.isPaused$.subscribe((isPaused) => {
      if (isPaused) {
        if (this.simulationInterval$) this.simulationInterval$.unsubscribe();
      } else {
        this.restartSimulationTime();
      }
      this.store.dispatch(isPaused ? resumeGame() : pauseGame());
    });
  }

  private showGameOverMessage(): void {
    // Display a "Game Over" message or redirect to a results page
  }

  // Method to fetch game results and open the popup
  openResultsPopup(): void {
    this.gameState$.subscribe((gameState) => {
      if (gameState) {
        const gameId = gameState.gameMetadata.id;
        const username = gameState.gameParticipation.username;

        this.gameService.getGameResults(gameId, username).subscribe(
          (results) => {
            this.dialog.open(GameResultsDialogComponent, {
              data: results,
              width: '500px',
            });
          },
          (error) => {
            console.error('Failed to fetch game results:', error);
          }
        );
      }
    });
  }
}