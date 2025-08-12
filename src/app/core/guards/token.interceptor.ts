import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  backend = `localhost:${environment.BACKEND}`;

  constructor(private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authToken = undefined;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      authToken = sessionStorage.getItem('authToken');
    }  
  
    const clonedRequest = authToken
      ? req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } })
      : req;

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && authToken) {
          return this.refreshToken().pipe(
            switchMap((newToken: string) => {
              sessionStorage.setItem('authToken', newToken);

              const retryRequest = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });

              return next.handle(retryRequest);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }

  private refreshToken(): Observable<string> {
    const refreshEndpoint = `http://${this.backend}/refresh-token`;
    return this.http.get<string>(`${refreshEndpoint}`);
  }
}
