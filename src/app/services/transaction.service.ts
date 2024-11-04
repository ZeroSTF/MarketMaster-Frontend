import { Injectable, Signal, computed, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction } from '../models/Transaction.model'; 
import { LimitOrder } from '../models/limitOrder.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly API_URL = `${environment.apiUrl}`;

  private readonly recentTransactionSignal = signal<Transaction | null>(null);
  private readonly recentOrderSignal = signal<LimitOrder | null>(null);

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
}

