import { createReducer, on } from '@ngrx/store';
import { loadGameStateSuccess, updateSimulationTime, streamMarketData, stopStreaming, loadGameStateFailure, pauseGame, resumeGame, adjustSpeed } from './game.actions';
import { GameStateDto } from '../../models/game-state-dto';
import { MarketDataStreamDto } from '../../models/market-data-stream.model';

export interface GameState {
  gameState: GameStateDto | null;
  isPaused: boolean;
  speed: number;
  error: string | null;
  currentSimulationTime: string | null;
  marketDataStream: MarketDataStreamDto[]; 
}

export const initialState: GameState = {
  gameState: null,
  isPaused: false,
  speed: 1,
  error: null,
  currentSimulationTime: null,
  marketDataStream: [],
};

export const gameReducer = createReducer(
  initialState,
  on(loadGameStateSuccess, (state, { gameState }) => ({
    ...state,
    gameState,
    currentSimulationTime: gameState.gameParticipation.lastPauseTimestamp,
    error: null,
  })),
  on(updateSimulationTime, (state, { updatedTime }) => ({
    ...state,
    currentSimulationTime: updatedTime,
  })),
  on(streamMarketData, (state, { marketData }) => ({
    ...state,
    marketDataStream: [...state.marketDataStream, marketData],
  })),
  on(stopStreaming, (state) => ({ ...state, marketDataStream: [] })),
  on(loadGameStateFailure, (state, { error }) => ({ ...state, error })),
  on(pauseGame, (state) => ({ ...state, isPaused: true })),
  on(resumeGame, (state) => ({ ...state, isPaused: false })),
  on(adjustSpeed, (state, { speed }) => ({ ...state, speed })),
);
