import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameControlService {

  private apiUrl = `${environment.apiUrl}/api/game`;

  constructor(private http: HttpClient) {}

  // Pause the game
  pauseGame(gameId: number, username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${gameId}/pause`, { username });
  }

  // Resume the game
  resumeGame(gameId: number, username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${gameId}/resume`, { username });
  }

  // Adjust speed of the game
  adjustSpeed(gameId: number, username: string, speed: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${gameId}/adjust-speed`, { username, speed });
  }
}

