import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkMode = signal(false);

  isDarkMode() {
    return this.darkMode.asReadonly();
  }

  toggleDarkMode() {
    this.darkMode.set(!this.darkMode());
  }
}
