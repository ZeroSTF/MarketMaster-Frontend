import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
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
  private readonly optionsignal = signal<Option | null> (null);
  private readonly options : Signal<Option | null> = computed(() => this.optionsignal?.());
  constructor(private http: HttpClient) { }
  buyOption(option:Option): Observable<Option> {
    const username = this.authService.username();
    return this.http.post<Option>(`${this.API_URL}/option/buyoption/${username}`, option);
  }
  getOptions(): Observable<Option[]>{
    const username = this.authService.username();
    return this.http.get<Option[]>(`${this.API_URL}/portf/myoptions/${username}`);
  }
}
