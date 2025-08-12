import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export enum KYCStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  INCOMPLETE = 'INCOMPLETE'
}

@Injectable({
  providedIn: 'root'
})
export class KycService {
  host = `${environment.BACKEND}`;

  constructor(private http: HttpClient) { }

  submitKyc(data: {
    userId: string,
    driverLicense: string,
    experience: string
  }): Observable<any> {
    return this.http.post<any>(`${this.host}/driver/submit-kyc`, data);
  }

  checkKyc(userId: string): Observable<any> {
    return this.http.post<any>(`${this.host}/driver/get-kyc`, { userId });
  }

  saveKycFormData(userId: string, formData: any, currentStep: string): Observable<any> {
    return this.http.post<any>(`${this.host}/driver/save-kyc-form`, { userId, formData, currentStep });
  }

  getIncompleteKycFormData(userId: string): Observable<any> {
    return this.http.post<any>(`${this.host}/driver/get-incomplete-kyc`, { userId });
  }

  clearKycProcessData(userId: string): Observable<any> {
    return this.http.post<any>(`${this.host}/driver/clear-kyc-process`, { userId });
  }

  getKYCStatusLabel(status: string): string {
    return KYCStatus[status as keyof typeof KYCStatus] || 'INCOMPLETE';
  }
}