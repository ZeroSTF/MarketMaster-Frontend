import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarketDataRequestDto } from '../models/market-data-request.model';
import { MarketDataResponseDto } from '../models/market-data-response.model';

@Injectable({
  providedIn: 'root',
})
export class MarketDataService {
  private apiBaseUrl = '/api/games'; // Replace with the base URL of your backend API

  constructor(private http: HttpClient) {}

  /**
   * Fetches market data for the specified game and asset.
   * @param request - The request payload containing gameId, assetSymbol, and lastPauseTimestamp.
   * @returns Observable containing market data response.
   */
  getMarketData(request: MarketDataRequestDto): Observable<MarketDataResponseDto> {
    const url = `${this.apiBaseUrl}/${request.gameId}/market-data`;
    return this.http.post<MarketDataResponseDto>(url, request);
  }
}
