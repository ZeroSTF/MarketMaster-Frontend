import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameDto, NewGameDto, NewGameResponseDto, JoinGameDto, JoinGameResponseDto, LeaderboardEntryDto, PlayerPerformanceDto } from '../models/game.model';
export interface NewsArticle {
  id: number;
  category: string;
  headline: string;
  source: string;
  related: string;
  url: string;
  image: string;
  publishedDate: string;
  gameId: number;
}

export interface TransactionDto {
  gameId: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  simulationTimestamp: string; // ISO string format
  username: string;
}

export interface GameResultsDto {
  finalCash: number; // Final cash balance
  holdings: GameHoldingDto[]; // List of holdings
  totalHoldingsValue: number; // Total value of all holdings
  profitPercentage: number; // Overall profit percentage
}

// If GameHoldingDto is not already defined, add it here
export interface GameHoldingDto {
  symbol: string; // Asset symbol
  quantity: number; // Number of shares held
  averageCostBasis: number; // Average cost basis of the holding
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:8081/api/games'; 

  constructor(private http: HttpClient) {}

  createGame(game: NewGameDto): Observable<NewGameResponseDto> {
    return this.http.post<NewGameResponseDto>(`${this.apiUrl}/create`, game);
  }

  joinGame(gameId: number, username: string): Observable<JoinGameResponseDto> {
    return this.http.post<JoinGameResponseDto>(`${this.apiUrl}/${gameId}/join/${username}`, {});
}

  getCurrentGames(): Observable<GameDto[]> {
    return this.http.get<GameDto[]>(`${this.apiUrl}/active`);
  }

  getUpcomingGames(): Observable<GameDto[]> {
    return this.http.get<GameDto[]>(`${this.apiUrl}/upcoming`);
  }

  getUserGames(username: string): Observable<GameDto[]> {
    return this.http.get<GameDto[]>(`${this.apiUrl}/user/${username}`);
  }

  getGameLeaderboard(gameId: number): Observable<LeaderboardEntryDto[]> {
    return this.http.get<LeaderboardEntryDto[]>(`${this.apiUrl}/leaderboard/${gameId}`);
  }

  getGlobalLeaderboard(): Observable<LeaderboardEntryDto[]> {
    return this.http.get<LeaderboardEntryDto[]>(`${this.apiUrl}/globalleaderboard`);
  }

  getPlayerPerformance(username: string): Observable<PlayerPerformanceDto> {
    return this.http.get<PlayerPerformanceDto>(`${this.apiUrl}/globalperformance/${username}`);
  }
  getNewsByGame(gameId: number): Observable<NewsArticle[]> {
    return this.http.get<NewsArticle[]>(`${this.apiUrl}/news/${gameId}`);
  }

  processTransaction(transaction: TransactionDto): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/transaction`, transaction);
  }

  
  getGameResults(gameId: number, username: string): Observable<GameResultsDto> {
    return this.http.get<GameResultsDto>(`${this.apiUrl}/${gameId}/results`, {
      params: { username }, // Pass username as a query parameter
    });
  }
}
