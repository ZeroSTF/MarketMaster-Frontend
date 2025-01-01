// game-dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, interval } from 'rxjs';
import { selectGameData, selectIsPaused } from '../../../../store/actions/game.selectors'; 
import { updateSimulationTime, persistSimulationTime } from '../../../../store/actions/game.actions'; 
import { GameStateDto } from '../../../../models/game-state-dto'; 

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

  private subscription!: Subscription;
  private simulationInterval$!: Subscription;
  private speedMultiplier = 1; // Default speed (1x)

  constructor(private store: Store, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.gameState$ = this.store.select(selectGameData);
    this.isPaused$ = this.store.select(selectIsPaused);

    // Subscribe to the game state and update simulation time
    this.subscription = this.gameState$.subscribe((gameState) => {
      if (gameState?.gameParticipation?.lastPauseTimestamp) {
        this.currentSimulationTime = gameState.gameParticipation.lastPauseTimestamp;
        this.gameParticipationId = gameState.gameParticipation.id; // Get the gameParticipationId as a number
        this.cdRef.detectChanges();
      }
    });

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
      if (this.currentSimulationTime) {
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

        this.cdRef.detectChanges();
      }
    });
  }

  private restartSimulationTime(): void {
    if (this.simulationInterval$) this.simulationInterval$.unsubscribe();
    this.startSimulationTime();
  }

  increaseSpeed(): void {
    if (this.speedMultiplier < 128) {
      this.speedMultiplier *= 2;
      this.restartSimulationTime();
    }
  }

  decreaseSpeed(): void {
    if (this.speedMultiplier > 0.125) {
      this.speedMultiplier /= 2;
      this.restartSimulationTime();
    }
  }

  togglePause(): void {
    this.isPaused$.subscribe((isPaused) => {
      if (isPaused) {
        if (this.simulationInterval$) this.simulationInterval$.unsubscribe();
      } else {
        this.restartSimulationTime();
      }
      this.store.dispatch({ type: isPaused ? '[Game] Resume Game' : '[Game] Pause Game' });
    });
  }
}
