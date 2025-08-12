import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse, LoginResponse, ProcessCheckResponse, RegistrationFormData, RegistrationProgressResponse, VerifyReg } from './interfaces/signup.interface';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SignupService {
  host = `${environment.BACKEND}/auth`;

  constructor(private http: HttpClient) { }

  verifyRegistration(data: VerifyReg): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.host}/verify-reg`, data);
  }

  checkProcess(data: { email: string }): Observable<ProcessCheckResponse> {
    return this.http.post<ProcessCheckResponse>(`${this.host}/check-process`, data);
  }

  saveRegistrationProgress(
    formData: RegistrationFormData
  ): Observable<RegistrationProgressResponse> {
    return this.http.post<RegistrationProgressResponse>(`${this.host}/start-reg`, formData);
  }

  resendOtp(processId: string): Observable<RegistrationProgressResponse> {
    return this.http.post<RegistrationProgressResponse>(`${this.host}/resend-otp`, { processId });
  }

  deleteRegistrationProgress(processId: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.host}/delete-registration-progress`, { processId });
  }
}