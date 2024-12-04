import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Option } from '../models/option.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OptionService {
  private readonly API_URL = `${environment.apiUrl}`;
  private authService = inject(AuthService)
  constructor(private http: HttpClient) { }
  buyOption(option:Option): Observable<Option> {
    const username = this.authService.username();
    return this.http.post<Option>(`${this.API_URL}/option/buyoption/${username}`, option);
  }
}
