import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/env';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  host = `${environment.backend}`

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
    return this.http.post<any>(`${this.host}/api/book-cab`, {
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
    return this.http.post<any>(`${this.host}/api/avail-drivers`, depCoords );
  }

  checkRide(userId: string){
    return this.http.get<any>(`${this.host}/api/check-ride?id=${userId}`);
  }
}
