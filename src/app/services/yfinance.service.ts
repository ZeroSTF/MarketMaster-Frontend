import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
export interface AssetStatisticsDto {
  symbol: string;
  enterpriseValue: number;
  forwardPE: number;
  profitMargins: number;
  priceToBook: number;
  debtToEquity: number;
  returnOnEquity: number;
  revenueDivGrowth: number;
  dividendYield: number;
  marketCap: number;
}
@Injectable({
  providedIn: 'root'
})
export class YfinanceService {
 private Url = 'http://localhost:8081/yfinance/stats';
 selectedAssetSignal = signal<AssetStatisticsDto | null>(null);

  constructor(private http: HttpClient) { }
  getstats(symbol:string):Observable<AssetStatisticsDto> {
    return this.http.get<AssetStatisticsDto>(`${this.Url}?symbol=${symbol}`);
  }
  selectAsset(asset: AssetStatisticsDto) {
    this.selectedAssetSignal.set(asset);
  }
}
