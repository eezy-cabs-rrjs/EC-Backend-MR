import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  host = `${environment.BACKEND}`

  constructor(private http: HttpClient) { }
  
  fetchUsers() {
    return this.http.get<any>(`${this.host}/admin/view-users`);
  }

  fetchDrivers() {
    return this.http.get<any>(`${this.host}/admin/view-drivers`);
  }

  fetchPendingKyc() {
    return this.http.get<any>(`${this.host}/admin/view-kyc`);
  }

  fetchDriverDetail(userId: string){
    return this.http.get<any>(`${this.host}/admin/view-driver?id=${userId}`);
  }

  fetchDriverKyc(userId: string){
    return this.http.get<any>(`${this.host}/admin/driver-kyc?id=${userId}`);
  }

  approveKYC(data: {userId: string, approval: boolean, reason?: string}){
    return this.http.post<any>(`${this.host}/admin/approve-kyc`, data);
  }

  userAction(data: {userId: string}){
    return this.http.post<any>(`${this.host}/admin/user-action`, data);
  }

  fetchDriverDetails(userId: string){
    return this.http.get<any>(`${this.host}/admin/driver-details?id=${userId}`)
  }

}
