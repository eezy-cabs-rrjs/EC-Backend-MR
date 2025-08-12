import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseResponse, LoginRequest, LoginResponse, LogoutRequest } from './interfaces/login.interface';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private readonly _host = `${environment.BACKEND}/auth`;

  constructor(private http: HttpClient) { }

  UserLogin(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this._host}/login`, data)
    // .pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     throwError(() => )
    //   })
    // );
  }

  UserLogout(data: LogoutRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this._host}/logout`, data);
  }

}