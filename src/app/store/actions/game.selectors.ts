import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from './game.reducer';
import { GameStateDto } from '../../models/game-state-dto';

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

export const selectCash = createSelector(
  selectGameData,
  (gameState: GameStateDto | null) => {
    console.log('Game State in Selector:', gameState); // Log the game state
    return gameState?.gamePortfolio?.cash || 0;
  }
);

export const selectHoldings = createSelector(
  selectGameData,
  (gameState: GameStateDto | null) => gameState?.gamePortfolio?.holdings || []
);

export const selectLastMarketDataTimestamp = createSelector(
  selectGameState,
  (state: GameState) => state.gameState?.gameMetadata.lastMarketDataTimestamp || null
);