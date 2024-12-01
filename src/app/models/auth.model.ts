export interface SignupRequest {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  issuedAt: string;
}
