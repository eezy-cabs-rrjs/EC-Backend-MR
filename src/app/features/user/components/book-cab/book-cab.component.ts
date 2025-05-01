import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../../../../environments/env';
import { Loader } from '@googlemaps/js-api-loader';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import { AvailDriversComponent } from './avail-drivers/avail-drivers.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from '@shared/components/partials/footer/footer.component';
import { HeaderComponent } from '@shared/components/partials/header/header.component';

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
    private router: Router,
    private toastr: ToastrService
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
          this.toastr.error('Error loading your profile data', 'Error');
        }
      }

      if (user && user.role) {
        this.bookingService.checkRide(user.role).subscribe({
          next: (response) => {
            if (response && response.ongoing) {
              this.router.navigate(['/user/riding']);
              this.toastr.info('You already have an ongoing ride', 'Ride in Progress');
            } else {
              this.getCurrentLocation();
            }
          },
          error: (error) => {
            console.error('Error checking ride status:', error);
            this.toastr.error('Error checking your ride status', 'Error');
            this.getCurrentLocation();
          }
        });
      } else {
        console.error('User role is not available');
        this.toastr.warning('Please login to access all features', 'Notice');
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
          this.toastr.warning('Could not get your current location. Using default map view.', 'Location Service');
          this.setDefaultMap();
        }
      );
    } else {
      this.toastr.warning('Geolocation is not supported by your browser', 'Location Service');
      this.setDefaultMap();
    }
  }

  updateMapUrl(): void {
    if (!this.departure || !this.destination) {
      this.toastr.error('Please enter both Departure and Destination to show route', 'Missing Information');
      return;
    }

    const mapUrl = `${this.gmapUrl}/v1/directions?key=${this.apiKey}`
      + `&origin=${encodeURIComponent(this.departure)}`
      + `&destination=${encodeURIComponent(this.destination)}`
      + '&mode=driving';

    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
    this.toastr.success('Route displayed on map', 'Success');
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
      this.toastr.error('Please fill in all fields before booking the ride.', 'Form Incomplete');
      return;
    }

    try {
      const departureCoords = await this.fetchCoordinates(this.departure);
      const destinationCoords = await this.fetchCoordinates(this.destination);

      this.bookingService.getAvailableDrivers(departureCoords).subscribe({
        next: (drivers) => {
          this.availableDrivers = drivers;
          if (drivers.length > 0) {
            this.toastr.info(`${drivers.length} drivers available near you`, 'Drivers Found');
          } else {
            this.toastr.warning('No drivers available at the moment. Please try again later.', 'No Drivers');
          }
        },
        error: (error) => {
          console.error('Error fetching available drivers:', error);
          this.toastr.error('Error finding available drivers. Please try again.', 'Error');
          this.availableDrivers = [];
        },
        complete: () => {
          console.log('Driver fetching completed.');
        }
      });
      this.showDriversModal = true;
    } catch (error) {
      this.toastr.error('Failed to book ride. Please check your locations and try again.', 'Booking Error');
      console.error(error);
    }
  }

  onDriverSelected(driver: any) {
    this.selectedDriver = driver;
    this.toastr.success(`You have selected ${driver.name}. Your ride is being prepared!`, 'Driver Selected');
    this.showDriversModal = false;
  }

  closeModal() {
    this.showDriversModal = false;
    this.toastr.info('You can modify your booking details if needed', 'Booking Open');
  }
}
