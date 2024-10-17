import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  SignupRequest,
  LoginRequest,
  TokenResponse,
} from '../models/auth.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);
  isLoggedIn = signal<boolean>(false);

  constructor() {
    this.checkInitialAuthState();
  }

  private async checkInitialAuthState(): Promise<void> {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await this.fetchUserData();
        this.isLoggedIn.set(true);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        this.clearAuthState();
      }
    }
  }

  async signup(signupRequest: SignupRequest): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<TokenResponse>(
          `${this.apiUrl}/auth/signup`,
          signupRequest
        )
      );
      await this.handleAuthResponse(response);
    } catch (error) {
      console.error('Signup failed', error);
      throw error;
    }
  }

  async login(loginRequest: LoginRequest): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<TokenResponse>(`${this.apiUrl}/auth/login`, loginRequest)
      );
      await this.handleAuthResponse(response);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<void>(`${this.apiUrl}/auth/logout`, {})
      );
    } finally {
      this.clearAuthState();
    }
  }

  async refreshToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await firstValueFrom(
        this.http.post<TokenResponse>(`${this.apiUrl}/auth/refresh-token`, {
          refreshToken,
        })
      );
      await this.handleAuthResponse(response);
    } catch (error) {
      console.error('Token refresh failed', error);
      this.clearAuthState();
      throw error;
    }
  }

  private async handleAuthResponse(response: TokenResponse): Promise<void> {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    await this.fetchUserData();
    this.isLoggedIn.set(true);
  }

  private async fetchUserData(): Promise<void> {
    try {
      const userData = await firstValueFrom(
        this.http.get<User>(`${this.apiUrl}/user/me`)
      );
      this.currentUser.set(userData);
    } catch (error) {
      console.error('Failed to fetch user data', error);
      throw error;
    }
  }

  private clearAuthState(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }
}
