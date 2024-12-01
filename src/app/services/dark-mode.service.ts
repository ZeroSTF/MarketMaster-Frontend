import { Injectable, signal } from '@angular/core';

export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
}
const CLIENT_RENDER = typeof localStorage !== 'undefined';
const LS_THEME = 'theme';
let selectedTheme: AppTheme | undefined = undefined;
if (CLIENT_RENDER) {
  selectedTheme = (localStorage.getItem(LS_THEME) as AppTheme) || undefined;
}

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  currentTheme = signal<AppTheme | undefined>(selectedTheme);
  setLightTheme() {
    this.currentTheme.set(AppTheme.LIGHT);
    this.setToLocalStorage(AppTheme.LIGHT);
    this.removeClassFromHtml('dark');
  }
  setDarkTheme() {
    this.currentTheme.set(AppTheme.DARK);
    this.setToLocalStorage(AppTheme.DARK);
    this.addClassToHtml('dark');
  }
  setSystemTheme() {
    this.currentTheme.set(undefined);
    this.removeFromLocalStorage();
    if (isSystemDark()) {
      this.addClassToHtml('dark');
    } else {
      this.removeClassFromHtml('dark');
    }
  }
  private addClassToHtml(className: string) {
    if (CLIENT_RENDER) {
      this.removeClassFromHtml(className);
      document.documentElement.classList.add(className);
    }
  }
  private removeClassFromHtml(className: string) {
    if (CLIENT_RENDER) {
      document.documentElement.classList.remove(className);
    }
  }
  private setToLocalStorage(theme: AppTheme) {
    if (CLIENT_RENDER) {
      localStorage.setItem(LS_THEME, theme);
    }
  }
  private removeFromLocalStorage() {
    if (CLIENT_RENDER) {
      localStorage.removeItem(LS_THEME);
    }
  }
}
function isSystemDark() {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    return false;
  }
}
