import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HoldingDto } from '../models/holdingDto.model';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
 holdings: HoldingDto[]=[];
 private authService = inject(AuthService)
  private readonly apiUrl = `${environment.apiUrl}/portf`;
  constructor(private http: HttpClient) { }
  getHolding():Observable<HoldingDto[]>{
    const username = this.authService.username();
    return this.http.get<HoldingDto[]>(`${this.apiUrl}/holding/${username}`);
  }

}
