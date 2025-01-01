import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from './game.reducer';

export const selectGameState = createFeatureSelector<GameState>('game');

export const selectGameData = createSelector(
  selectGameState,
  (state: GameState) => state.gameState
);

export const selectIsPaused = createSelector(
  selectGameState,
  (state: GameState) => state.isPaused
);

export const selectSpeed = createSelector(
  selectGameState,
  (state: GameState) => state.speed
);

export const selectSimulationTime = createSelector(
  selectGameState,
  (state: GameState) => state.currentSimulationTime
);

export const selectMarketDataStream = createSelector(
  selectGameState,
  (state: GameState) => state.marketDataStream
);
