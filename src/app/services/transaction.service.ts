import { Injectable, Signal, computed, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model'; 
import { LimitOrder } from '../models/limitOrder.model';
import { environment } from '../../environments/environment';
import { HoldingDTO } from '../models/holding.model';
import { OverviewDTO } from '../models/overview.model';
import { WatchListDTO } from '../models/watchlist.model';
import { BehaviorSubject} from 'rxjs';
import { Asset, PageResponse } from '../models/asset.model';
import { BestWinner } from '../models/BestWinner.model';
import { Option } from '../models/option.model';
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly API_URL = `${environment.apiUrl}`;
  private readonly apiUrl = `${environment.apiUrl}/watchlist`
  private watchlistSubject = new BehaviorSubject<Asset[]>([]); // Holds current list of assets
  public watchlist$ = this.watchlistSubject.asObservable();
  private readonly recentTransactionSignal = signal<Transaction | null>(null);
  private readonly recentOrderSignal = signal<LimitOrder | null>(null);
  private readonly recentWatchListSignal = signal<WatchListDTO | null>(null);

  public readonly recentWatchList: Signal<WatchListDTO | null> = computed(() => this.recentWatchListSignal?.());
  public readonly recentTransaction: Signal<Transaction | null> = computed(() => this.recentTransactionSignal?.());
  public readonly recentOrder: Signal<LimitOrder | null> = computed(() => this.recentOrderSignal?.());

  constructor(private http: HttpClient) {}

  addTransaction(username: string, transaction: Transaction): Observable<Transaction> {
    const url = `${this.API_URL}/tran/ajout/${username}`;
    
    return this.http.post<Transaction>(url, transaction).pipe(
      tap((transaction) => this.recentTransactionSignal.set(transaction)),
      catchError(this.handleError)
    );
  }

  addOrder(username: string, limitOrder: LimitOrder): Observable<LimitOrder> {
    const url = `${this.API_URL}/order/add/${username}`;
    return this.http.post<LimitOrder>(url, limitOrder).pipe(
      tap((order) => this.recentOrderSignal.set(order)), 
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server error (Code: ${error.status}): ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  getHolding(username: string): Observable<HoldingDTO[]> {
    const url = `${this.API_URL}/portf/holding/${username}`;
    return this.http.get<HoldingDTO[]>(url).pipe(
      tap((holdings) => console.log('Fetched holdings:', holdings)), 
      catchError(this.handleError)
    );
  }

  getTransaction(username: string): Observable<Transaction[]> {
    const url = `${this.API_URL}/portf/transaction/${username}`;
    return this.http.get<Transaction[]>(url).pipe(
      tap((transaction) => console.log('Fetched holdings:', transaction)), 
      catchError(this.handleError)
    );
  }

  getOverviewData(username: string): Observable<OverviewDTO> {
    const url = `${this.API_URL}/portf/overview/${username}`;
    return this.http.get<OverviewDTO>(url).pipe(
      tap((overview) => {
        console.log('Fetched overview data:', overview);
      }),
      catchError(this.handleError)
    );
  }
  getWatchList(username: string): Observable<WatchListDTO[]> {
    const url = `${this.API_URL}/portf/watchlist/${username}`;
    return this.http.get<WatchListDTO[]>(url).pipe(
      tap((watchlist) => console.log('Fetched whatchlist:', watchlist)), 
      catchError(this.handleError)
    );
  } 

  getUserWatchlist(userId: string): Observable<PageResponse<Asset>> {
    return this.http.get<PageResponse<Asset>>(`${this.apiUrl}/${userId}`);
  }
  // Add asset to the watchlist
  addAssetToWatchlist(asset: Asset): void {
    const currentWatchlist = this.watchlistSubject.value;
    if (!currentWatchlist.find(item => item.symbol === asset.symbol)) {
      this.watchlistSubject.next([...currentWatchlist, asset]);
    }
  }

  // Remove asset from the watchlist
  removeAssetFromWatchlist(symbol: string): void {
    const updatedWatchlist = this.watchlistSubject.value.filter(item => item.symbol !== symbol);
    this.watchlistSubject.next(updatedWatchlist);
  }

  // Get the assets in the watchlist
  getWatchlist(): Asset[] {
    return this.watchlistSubject.value;
  }

  // Set the watchlist (e.g., after fetching from the backend)
  setWatchlist(assets: Asset[]): void {
    this.watchlistSubject.next(assets);
  }

  addWatchList(username: string, symbol: string): Observable<WatchListDTO> {
    const url = `${this.API_URL}/portf/addwatchlist/${username}/${symbol}`;
    return this.http.post<WatchListDTO>(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  getBestWinners(): Observable<BestWinner[]> {
    return this.http.get<BestWinner[]>(`${this.API_URL}/portf/bestWinner`);
  }
  getLimitOrders(username: string): Observable<LimitOrder[]> {
    return this.http.get<LimitOrder[]>(`${this.API_URL}/portf/LimitOrder/${username}`);
  }
  
}