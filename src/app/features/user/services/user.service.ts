import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  host = `${environment.BACKEND}`


  getUDataFLS(key: string) {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const data = sessionStorage.getItem('user');
      if (data) {
        try {
          return JSON.parse(data);
        } catch (error) {
          console.error('Error parsing data from sessionStorage:', error);
        }
      }
    }
    return null;
  }

  updateImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.host}/user/update-image`, formData);
  }

  getProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.host}/user/fetch-details?id=${userId}`);
  }

  upsertProfile(data: {userId: string, name: string, phone: string}){
    return this.http.post<Response>(`${this.host}/user/upsert-details`, data);
  }

}

export interface Response {
  success: boolean;
  message: string;
}
