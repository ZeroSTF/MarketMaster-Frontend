import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Action, Store } from '@ngrx/store';
import { Observable, interval, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom, takeUntil } from 'rxjs/operators';
import { 
  loadGameState, 
  loadGameStateSuccess, 
  loadGameStateFailure, 
  loadMarketData, 
  loadMarketDataSuccess, 
  loadMarketDataFailure, 
  pauseGame, 
  resumeGame, 
  updateSimulationTime, 
  streamMarketData,
  stopStreaming
} from './game.actions';
import { GameStateDto } from '../../models/game-state-dto';
import { MarketDataStreamDto } from '../../models/market-data-stream.model';
import { environment } from '../../../environments/environment';
import { selectGameData, selectSpeed } from './game.selectors';
import { persistSimulationTime } from './game.actions';
import { MarketDataResponseDto } from '../../models/market-data-response.model';


@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store
  ) {}

  // Effect to load game state
  loadGameState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadGameState),
      switchMap(({ gameId, username }) =>
        this.http.get<GameStateDto>(`${environment.apiUrl}/games/${gameId}/state?username=${username}`).pipe(
          map(gameState => loadGameStateSuccess({ gameState })),
          catchError(error => [loadGameStateFailure({ error })])
        )
      )
    )
  );

  // Effect to load market data
  loadMarketData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMarketData),
      switchMap(({ gameId, assetSymbol, lastPauseTimestamp }) =>
        this.http.post<MarketDataResponseDto>(`${environment.apiUrl}/games/${gameId}/market-data`, { assetSymbol, lastPauseTimestamp }).pipe(
          map(marketDataResponse => loadMarketDataSuccess({ marketData: marketDataResponse })),
          catchError(error => of(loadMarketDataFailure({ error }))) // Ensure the error is returned as an observable action
        )
      )
    )
  );

  // Effect to update simulation time
  updateSimulationTime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resumeGame), // Trigger when the game resumes
      switchMap(() =>
        interval(60000).pipe( // Emit every real-life minute
          withLatestFrom(this.store.select(selectGameData), this.store.select(selectSpeed)),
          map(([_, gameState, speed]) => {
            if (!gameState || !gameState.gameParticipation.lastPauseTimestamp) {
              return { type: '[Game] No Op' }; // A no-op action if there's nothing to update
            }
            const lastPauseTime = new Date(gameState.gameParticipation.lastPauseTimestamp);
            lastPauseTime.setMinutes(lastPauseTime.getMinutes() + 15 * speed); // Increment simulation time
            return updateSimulationTime({ updatedTime: lastPauseTime.toISOString() });
          }),
          takeUntil(this.actions$.pipe(ofType(pauseGame))) // Stop when the game is paused
        )
      )
    )
  );
  persistSimulationTime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(persistSimulationTime),
      switchMap(({ updatedTime, gameParticipationId }) =>
        this.http.put(`${environment.apiUrl}/games/update-timestamp`, { 
          lastPauseTimestamp: updatedTime,
          gameParticipationId: gameParticipationId // Ensure it's sent as an integer
        }).pipe(
          map(() => ({ type: '[Game] Persist Simulation Time Success' })),
          catchError((error) => [{ type: '[Game] Persist Simulation Time Failure', error }])
        )
      )
    )
  );
  streamMarketData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMarketDataSuccess), // Trigger on successful market data load
      switchMap(({ marketData }) =>
        new Observable<Action>(observer => { // Explicitly type the Observable as emitting Action
          let index = 0;

          const intervalId = setInterval(() => {
            if (index < marketData.upcomingMarketData.length) {
              // Emit an action with the next piece of market data
              observer.next(streamMarketData({ marketData: marketData.upcomingMarketData[index] }));
              index++;
            } else {
              clearInterval(intervalId);
              observer.complete();
            }
          }, 1000); // Emit data every 1 second

          // Cleanup when the observable completes or is unsubscribed
          return () => clearInterval(intervalId);
        }).pipe(
          takeUntil(this.actions$.pipe(ofType(stopStreaming))) // Stop when `stopStreaming` is dispatched
        )
      )
    )
  );
}
  

