import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {

  private authService = inject(AuthService)
  private readonly apiUrl = `${environment.apiUrl}/insurance`;
  constructor(private http: HttpClient) { }
  prime(): Observable<number> { // Adjust type to match the backend response
    const username = this.authService.username();
    return this.http.get<number>(`${this.apiUrl}/primes/${username}`);
  }
}
