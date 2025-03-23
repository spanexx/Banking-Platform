import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([401, 403].includes(error.status)) {
        // Auto logout if 401 or 403 response
        localStorage.removeItem('token');
        router.navigate(['/sign-in']);
      }
      
      const errorMessage = error.error?.message || 'An error occurred';
      return throwError(() => new Error(errorMessage));
    })
  );
};
