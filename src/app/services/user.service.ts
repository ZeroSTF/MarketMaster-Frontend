import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';
import { UpdateUserDTO, UpdatePasswordDTO } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  apiUrl = environment.apiUrl;

  constructor() {}

  updateUser(updateData: UpdateUserDTO): Promise<void> {
    return this.http
      .put<void>(`${this.apiUrl}/user/update`, updateData)
      .pipe(
        tap((response) => {
          // Update the current user signal with new data
          this.authService.userSignal.update((user) => ({
            ...user!,
            ...updateData,
          }));
        })
      )
      .toPromise();
  }

  updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const updatePasswordDTO: UpdatePasswordDTO = {
      currentPassword,
      newPassword,
    };
    return this.http
      .put<void>(`${this.apiUrl}/user/update-password`, updatePasswordDTO)
      .toPromise();
  }
}
