import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  host = `${environment.BACKEND}`

  constructor(private http: HttpClient) { }

  BookCab(
    userId: string,
    driverId: string,
    riderName: string,
    contact: string,
    rideMode: string,
    departure: string,
    destination: string,
  ) {
    return this.http.post<any>(`${this.host}/book-cab`, {
      userId,
      driverId,
      riderName,
      contact,
      rideMode,
      departure,
      destination
    });
  }

  getAvailableDrivers(depCoords: {
    lat: number;
    lng: number;
  } ){
    return this.http.post<any>(`${this.host}/avail-drivers`, depCoords );
  }

  checkRide(userId: string){
    return this.http.get<any>(`${this.host}/check-ride?id=${userId}`);
  }
}
