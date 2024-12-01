import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { jwtInterceptor } from './auth/interceptors/auth.interceptor';
import { getTVChartDefaultProviders } from 'ngx-lightweight-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimationsAsync(),
    getTVChartDefaultProviders(),

  ],
};
