import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly API_URL = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  getTotalValues(username: string): Observable<{ key: string, value: number }[]> {
    return this.http.get<{ key: string, value: number }[]>(`${this.API_URL}/portf/totalValues/${username}`);
  }

}
