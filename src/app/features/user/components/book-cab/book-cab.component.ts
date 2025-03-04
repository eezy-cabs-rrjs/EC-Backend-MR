import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../../../../environments/env';
import { Loader } from '@googlemaps/js-api-loader';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import { FooterComponent } from '../partials/footer/footer.component';
import { HeaderComponent } from '../partials/header/header.component';
import { AvailDriversComponent } from './avail-drivers/avail-drivers.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-cab',
  standalone: true,
  imports: [
    FormsModule,
    GoogleMapsModule,
    FooterComponent,
    HeaderComponent,
    AvailDriversComponent,
    CommonModule
  ],
  templateUrl: './book-cab.component.html',
  styleUrl: './book-cab.component.css'
})


export class BookCabComponent implements OnInit {
  departure: string = '';
  destination: string = '';
  riderName: string = '';
  contact: string = '';
  mapUrl!: SafeResourceUrl;
  availableDrivers: any[] = [];
  selectedDriver: any;
  showDriversModal: boolean = false;

  private apiKey = environment.apiKey;
  private gmapUrl = environment.gmapUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private bookingService: BookingService,
    private userService: UserService,
    private router: Router
  ) {
    this.setDefaultMap();
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'geolocation' in window.navigator) {
      const userString = localStorage.getItem('user'); 
      let user: { role?: string } | null = null; 

      if (userString) {
        try {
          user = JSON.parse(userString); 
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      }

      if (user && user.role) { 
        this.bookingService.checkRide(user.role).subscribe({
          next: (response) => {
            if (response && response.ongoing) { 
              this.router.navigate(['/user/riding']);
            } else {
              this.getCurrentLocation(); 
            }
          },
          error: (error) => {
            console.error('Error checking ride status:', error);
            this.getCurrentLocation();
          }
        });
      } else {
        console.error('User  role is not available');
        this.getCurrentLocation();
      }
    }

  }

  private setDefaultMap(): void {
    const defaultUrl = `${this.gmapUrl}/v1/place?key=${this.apiKey}&q=Your+Location`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(defaultUrl);
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const mapUrl = `${this.gmapUrl}/v1/view?key=${this.apiKey}&center=${lat},${lng}&zoom=15`;
          this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
        },
        (error) => {
          console.error('Error getting location', error);
          this.setDefaultMap();
        }
      );
    } else {
      this.setDefaultMap();
    }
  }

  updateMapUrl(): void {
    if (!this.departure || !this.destination) {
      alert('Please enter both Departure and Destination');
      return;
    }

    const mapUrl = `${this.gmapUrl}/v1/directions?key=${this.apiKey}`
      + `&origin=${encodeURIComponent(this.departure)}`
      + `&destination=${encodeURIComponent(this.destination)}`
      + '&mode=driving';

    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
  }

  async fetchCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    const loader = new Loader({
      apiKey: this.apiKey,
      version: 'weekly',
    });

    const google = await loader.load();

    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          reject(`Geocoding failed: ${status}`);
        }
      });
    });
  }

  async bookRide(): Promise<void> {
    if (!this.departure || !this.destination || !this.riderName || !this.contact) {
      alert('Please fill in all fields before booking the ride.');
      return;
    }

    try {
      const departureCoords = await this.fetchCoordinates(this.departure);
      const destinationCoords = await this.fetchCoordinates(this.destination);

      this.bookingService.getAvailableDrivers(departureCoords).subscribe({
        next: (drivers) => {
          this.availableDrivers = drivers;
          console.log('Available Drivers:', this.availableDrivers);
        },
        error: (error) => {
          console.error('Error fetching available drivers:', error);
          this.availableDrivers = [];
        },
        complete: () => {
          console.log('Driver fetching completed.');
        }
      });
      this.showDriversModal = true;

      console.log('Available Drivers:', this.availableDrivers);
    } catch (error) {
      alert('Failed to book ride. Please try again.');
      console.error(error);
    }
  }

  onDriverSelected(driver: any) {
    this.selectedDriver = driver;
    alert(`You have selected ${driver.name}.`);
    this.showDriversModal = false; // Close the modal after selection
  }

  closeModal() {
    this.showDriversModal = false; // Close the modal
  }
}
