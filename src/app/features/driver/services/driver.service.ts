import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/env';
import { HttpClient } from '@angular/common/http';

export enum KYCStatus {
  PENDING = 1,
  SUBMITTED = 2,
  REJECTED = 3,
  APPROVED = 4,
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  host = `${environment.backend}`

  constructor(private http: HttpClient) { }
  
  submitKyc(data: {
    userId: string,
    driverLicense: string,
    experience: string,
    vehicleNumber: string,
    chassisNumber: string,
    insuranceNumber: string,
    insuranceExpiry: string,
    registrationDate: string,
    vehicleMake: string,
    vehicleModel: string,
    yearOfManufacture: number,
}){
    return this.http.post<any>(`${this.host}/driver/upsert-kyc`, data);
  }

  checkKyc(userId: string){
    return this.http.post<any>(`${this.host}/driver/check-kyc`, {userId});
  }

 getKYCStatusLabel(status: number): string {
  const statusLabels: { [key: number]: string } = {
    [KYCStatus.PENDING]: 'PENDING',
    [KYCStatus.SUBMITTED]: 'SUBMITTED',
    [KYCStatus.REJECTED]: 'REJECTED',
    [KYCStatus.APPROVED]: 'APPROVED',
  };

  return statusLabels[status] || 'Invalid Status';
}

}
