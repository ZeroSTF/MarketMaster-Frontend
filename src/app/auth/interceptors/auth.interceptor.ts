import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const tokenResponse = authService.getTokenResponseSignal();
  if (tokenResponse) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/refresh-token')) {
        return authService.refreshToken().pipe(
          switchMap((newTokenResponse) => {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newTokenResponse.accessToken}`,
              },
            });
            return next(req);
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
