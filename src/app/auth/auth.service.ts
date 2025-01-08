import {
  Injectable,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  catchError,
  map,
  of,
  switchMap,
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
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}`;
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  // Core signals
  public readonly userSignal = signal<User | null>(null);
  private readonly tokenSignal = signal<TokenResponse | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  // Computed signals
  public readonly currentUser: Signal<User | null> = computed(() =>
    this.userSignal()
  );
  public readonly isAuthenticated: Signal<boolean> = computed(
    () => !!this.userSignal()
  );
  public readonly isLoading: Signal<boolean> = computed(() =>
    this.loadingSignal()
  );
  public readonly error: Signal<string | null> = computed(() =>
    this.errorSignal()
  );
  public readonly accessToken: Signal<string | null> = computed(
    () => this.tokenSignal()?.accessToken ?? null
  );

  constructor() {
    // Persist authentication state
    effect(() => {
      const token = this.tokenSignal();
      if (token) {
        localStorage.setItem('tokenResponse', JSON.stringify(token));
      } else {
        localStorage.removeItem('tokenResponse');
      }
    });

    // Persist user state
    effect(() => {
      const user = this.userSignal();
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });

    // Setup auto token refresh
    effect(() => {
      const token = this.tokenSignal();
      if (token) {
        this.setupAutoRefresh(token);
      }
    });

    this.initializeFromStorage();
  }

  signup(request: SignupRequest): Observable<User> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<User>(`${this.API_URL}/auth/signup`, request).pipe(
      tap((user) => {
        this.userSignal.set(user);
        this.loadingSignal.set(false);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  login(request: LoginRequest): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .post<TokenResponse>(`${this.API_URL}/auth/login`, request)
      .pipe(
        switchMap((tokenResponse) => {
          this.tokenSignal.set(tokenResponse);
          return this.fetchCurrentUser();
        }),
        tap(() => this.loadingSignal.set(false)),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): Observable<void> {
    const token = this.tokenSignal();
    if (!token) {
      return of(void 0);
    }

    this.loadingSignal.set(true);
    return this.http.post<void>(`${this.API_URL}/auth/logout`, {}).pipe(
      tap(() => this.clearAuth()),
      catchError(this.handleError.bind(this))
    );
  }

  refreshToken(): Observable<void> {
    const token = this.tokenSignal();
    if (!token?.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<TokenResponse>(`${this.API_URL}/auth/refresh-token`, {
        refreshToken: token.refreshToken,
      })
      .pipe(
        tap((tokenResponse) => this.tokenSignal.set(tokenResponse)),
        switchMap(() => this.fetchCurrentUser()),
        catchError(this.handleError.bind(this))
      );
  }

  private fetchCurrentUser(): Observable<void> {
    return this.http.get<User>(`${this.API_URL}/user/me`).pipe(
      tap((user) => this.userSignal.set(user)),
      map(() => void 0),
      catchError(this.handleError.bind(this))
    );
  }

  private setupAutoRefresh(tokenResponse: TokenResponse): void {
    if (!tokenResponse.expiresIn) return;

    const expiresIn = tokenResponse.expiresIn;
    const refreshBuffer = 60000; // 1 minute buffer
    const refreshTime = expiresIn - refreshBuffer;

    setTimeout(() => {
      this.refreshToken().subscribe();
    }, refreshTime);
  }

  private initializeFromStorage(): void {
    try {
      const storedToken = localStorage.getItem('tokenResponse');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        const tokenResponse: TokenResponse = JSON.parse(storedToken);
        const user: User = JSON.parse(storedUser);

        if (this.isTokenValid(tokenResponse)) {
          this.tokenSignal.set(tokenResponse);
          this.userSignal.set(user);

          Promise.resolve().then(() => {
            this.fetchCurrentUser().subscribe({
              error: () => this.clearAuth(),
            });
          });
        } else {
          this.clearAuth();
        }
      }
    } catch (error) {
      console.error('Error initializing from storage:', error);
      this.clearAuth();
    }
  }

  private isTokenValid(tokenResponse: TokenResponse): boolean {
    if (!tokenResponse?.expiresIn || !tokenResponse?.issuedAt) {
      return false;
    }

    const expirationTime =
      new Date(tokenResponse.issuedAt).getTime() + tokenResponse.expiresIn;
    return Date.now() < expirationTime;
  }

  private clearAuth(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    this.loadingSignal.set(false);
    this.errorSignal.set(null);
    this.router.navigate(['/login']);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.loadingSignal.set(false);

    if (error.status === 401) {
      this.clearAuth();
    }

    const errorMessage =
      error.error instanceof ErrorEvent
        ? `Error: ${error.error.message}`
        : `Error Code: ${error.status}\nMessage: ${error.message}`;

    this.errorSignal.set(errorMessage);
    console.error('Auth error:', errorMessage);

    return throwError(() => new Error(errorMessage));
  }
}
