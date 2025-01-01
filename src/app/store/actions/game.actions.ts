import { createAction, props } from '@ngrx/store';
import { GameStateDto } from '../../models/game-state-dto';
import { MarketDataStreamDto } from '../../models/market-data-stream.model';
import { MarketDataResponseDto } from '../../models/market-data-response.model';

export const loadGameState = createAction(
  '[Game] Load Game State',
  props<{ gameId: number, username: string }>()
);

export const loadGameStateSuccess = createAction(
  '[Game] Load Game State Success',
  props<{ gameState: GameStateDto }>()
);

export const loadGameStateFailure = createAction(
  '[Game] Load Game State Failure',
  props<{ error: any }>()
);

export const loadMarketData = createAction(
  '[Market] Load Market Data',
  props<{ gameId: number, assetSymbol: string, lastPauseTimestamp: string }>()
);

export const loadMarketDataSuccess = createAction(
  '[Market] Load Market Data Success',
  props<{ marketData: MarketDataResponseDto }>()
);

export const loadMarketDataFailure = createAction(
  '[Market] Load Market Data Failure',
  props<{ error: any }>()
);

export const streamMarketData = createAction(
  '[Market] Stream Market Data',
  props<{ marketData: MarketDataStreamDto }>()
);

export const stopStreaming = createAction('[Market] Stop Streaming');

export const pauseGame = createAction('[Game] Pause Game');

export const resumeGame = createAction('[Game] Resume Game');

export const adjustSpeed = createAction(
  '[Game] Adjust Speed',
  props<{ speed: number }>()
);

export const updateSimulationTime = createAction(
  '[Game] Update Simulation Time',
  props<{ updatedTime: string }>()
);

export const persistSimulationTime = createAction(
  '[Game] Persist Simulation Time',
  props<{ updatedTime: string; gameParticipationId: number }>()
);


