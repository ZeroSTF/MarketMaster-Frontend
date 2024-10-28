import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameDto, NewGameDto, NewGameResponseDto, JoinGameDto, JoinGameResponseDto, LeaderboardEntryDto, PlayerPerformanceDto } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:8081/api/games'; 

  constructor(private http: HttpClient) {}

  createGame(game: NewGameDto): Observable<NewGameResponseDto> {
    return this.http.post<NewGameResponseDto>(`${this.apiUrl}/create`, game);
  }

  joinGame(gameId: number, joinGameDto: JoinGameDto): Observable<JoinGameResponseDto> {
    return this.http.post<JoinGameResponseDto>(`${this.apiUrl}/${gameId}/join`, joinGameDto);
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
}
