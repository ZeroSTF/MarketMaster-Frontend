import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  firstValueFrom,
  tap,
  throwError,
} from 'rxjs';
import {
  SignupRequest,
  LoginRequest,
  TokenResponse,
} from '../models/auth.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly tokenResponseSignal = signal<TokenResponse | null>(null);

  public readonly currentUser: Signal<User | null> = computed(() =>
    this.currentUserSignal()
  );
  public readonly isAuthenticated: Signal<boolean> = computed(
    () => !!this.currentUserSignal()
  );
  public getTokenResponseSignal() {
    return this.tokenResponseSignal();
  }

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  signup(signupRequest: SignupRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/signup`, signupRequest).pipe(
      tap((user) => this.currentUserSignal.set(user)),
      catchError(this.handleError)
    );
  }

  login(loginRequest: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.API_URL}/login`, loginRequest)
      .pipe(
        tap((tokenResponse) => this.setTokenResponse(tokenResponse)),
        catchError(this.handleError)
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/logout`, {}).pipe(
      tap(() => this.clearAuth()),
      catchError(this.handleError)
    );
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.tokenResponseSignal()?.refreshToken;
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http
      .post<TokenResponse>(`${this.API_URL}/refresh-token`, { refreshToken })
      .pipe(
        tap((tokenResponse) => this.setTokenResponse(tokenResponse)),
        catchError(this.handleError)
      );
  }

  private setTokenResponse(tokenResponse: TokenResponse): void {
    this.tokenResponseSignal.set(tokenResponse);
    localStorage.setItem('tokenResponse', JSON.stringify(tokenResponse));
  }

  private clearAuth(): void {
    this.currentUserSignal.set(null);
    this.tokenResponseSignal.set(null);
    localStorage.removeItem('tokenResponse');
  }

  private loadUserFromStorage(): void {
    const storedToken = localStorage.getItem('tokenResponse');
    if (storedToken) {
      this.tokenResponseSignal.set(JSON.parse(storedToken));
      // You might want to validate the token here or fetch user details
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
