   export interface GameDto {
    id: number;
    title: string;
    description: string;
    creationTimestamp: string; 
    simulationStartDate: string; 
    simulationEndDate: string;
    status: GameStatus;
    creatorUsername: string;
  }
  
  export interface GamePerformanceDto {
    username: string;
    profit: number; 
    holdingsValue: number;
    cash: number;
    totalValue: number; 
    rank: number;
  }
  
  export interface LeaderboardEntryDto {
    username: string;
    profit: number; 
  }
  
  export interface PlayerPerformanceDto {
    username: string;
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
    totalProfit: number; 
    averageProfit: number; 
  }
  
  export interface JoinGameDto {
    username: string;
  }
  
  export interface JoinGameResponseDto {
    message: string;
    gameId: number;
    username: string;
  }
  
  export interface NewGameDto {
    title: string;
    description: string;
    startTimestamp: string; 
    endTimestamp: string; 
    maxPlayTime: string; 
    username: string;
  }
  
  export interface NewGameResponseDto {
    id: number;
    description: string;
    startTimestamp: string;
    endTimestamp: string; 
    maxPlayTime: string; 
    creatorUsername: string;
    simulationStartDate: string;
    simulationEndDate: string;
  }
  
  export enum GameStatus {
    ACTIVE = 'ACTIVE',
    UPCOMING = 'UPCOMING',
    FINISHED = 'FINISHED',
  }
  