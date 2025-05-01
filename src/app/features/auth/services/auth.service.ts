import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/env';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  host = `${environment.backend}`

  constructor(private http: HttpClient) { }

  UserLogin(email: string, password: string, role: string) {
    return this.http.post<any>(`${this.host}/login`, { email, password, role });
  }

  UserLogout(){
    return this.http.get<any>(`${this.host}/logout`);
  }

  UserRegister(data: {role: string, name: string, email: string, password: string, phone: string }){
    const { email, password, name, phone, role } = data;
    return this.http.post<any>(`${this.host}/register`, { email, password, name, phone, role  });
  }

  SendOtp(email: string, name: string){
    return this.http.post<any>(`${this.host}/gen-otp`,  {email, name});
  }

  VerifyOtp(otp: string, token: string){
    console.log(otp, token);
    return this.http.post<any>(`${this.host}/verify-otp`, { otp, token });
  }

}
