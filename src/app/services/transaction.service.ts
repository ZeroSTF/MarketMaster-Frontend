import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TransactionDTO } from '../models/transaction.model';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly apiUrl = `${environment.apiUrl}/tran`;
  private authService = inject(AuthService)
  constructor(private http: HttpClient) { }
  addTransaction( transaction: TransactionDTO): Observable<TransactionDTO> {
    const username = this.authService.username();
    console.log('username :',username);
    const url = `${this.apiUrl}/ajout/${username}`;
    return this.http.post<TransactionDTO>(url, transaction);
  }
}
