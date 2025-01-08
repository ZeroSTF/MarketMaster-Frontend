import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameStateDto } from '../models/game-state-dto'; // Import DTO
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private apiUrl = `${environment.apiUrl}/api/game`;

  constructor(private http: HttpClient) {}

  // Fetch the game state by game ID and username
  getGameState(gameId: number, username: "string"): Observable<GameStateDto> {
    return this.http.get<GameStateDto>(`${this.apiUrl}/${gameId}/state?username=${username}`);
  }
}
