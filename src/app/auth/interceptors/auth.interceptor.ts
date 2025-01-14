import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // List of URLs to exclude from token injection
  const excludedUrls = ['/login', '/signup', '/refresh-token'];
  const isExcluded = excludedUrls.some((url) => req.url.includes(url));

  if (!isExcluded) {
    const accessToken = authService.accessToken();
    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  }

  return next(req).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized errors and refresh the token if necessary
      if (error.status === 401 && !req.url.includes('/refresh-token')) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newAccessToken = authService.accessToken();
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            return next(req);
          }),
          catchError((refreshError) => {
            authService.logout().subscribe({
              next: () => {
                console.log('Logged out successfully');
              },
              error: (err) => {
                console.error('Logout failed', err);
              },
            });
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
