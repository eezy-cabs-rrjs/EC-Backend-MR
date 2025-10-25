import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Loader } from '@googlemaps/js-api-loader';
import { HeaderComponent } from '@shared/components/partials/header/header.component';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-book-cab',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './book-cab.component.html',
  styleUrl: './book-cab.component.css',
})
export class BookCabComponent implements OnInit {
  departure = '';
  destination = '';
  mapCenter: google.maps.LatLngLiteral = { lat: 28.6139, lng: 77.209 };
  zoom = 14;

  map!: google.maps.Map;
  pickupMarker: google.maps.Marker | null = null;
  destinationMarker: google.maps.Marker | null = null;
  taxiMarker: google.maps.Marker | null = null;
  routePath: google.maps.DirectionsRenderer | null = null;

  rideInProgress = false;
  rideStarted = false;
  taxiPositionIndex = 0;
  routeCoordinates: google.maps.LatLngLiteral[] = [];

  directionsService!: google.maps.DirectionsService;
  geocoder!: google.maps.Geocoder;

  async ngOnInit(): Promise<void> {
    const loader = new Loader({
      apiKey: environment.GMAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });

    await loader.importLibrary('maps');

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: this.mapCenter,
      zoom: this.zoom,
      mapTypeId: 'roadmap',
      tilt: 0,
      streetViewControl: false,
      gestureHandling: 'greedy',
    });

    this.directionsService = new google.maps.DirectionsService();
    this.geocoder = new google.maps.Geocoder();

    this.map.addListener('click', (e: google.maps.MapMouseEvent) => this.handleMapClick(e));

    this.restoreRideState();
  }

  private handleMapClick(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) return;

    if (!this.pickupMarker) {
      this.pickupMarker = new google.maps.Marker({
        position: event.latLng,
        map: this.map,
        label: 'P',
      });
      this.reverseGeocode(event.latLng, (addr) => (this.departure = addr));
    } else if (!this.destinationMarker) {
      this.destinationMarker = new google.maps.Marker({
        position: event.latLng,
        map: this.map,
        label: 'D',
      });
      this.reverseGeocode(event.latLng, (addr) => (this.destination = addr));
      this.showRoute();
    }
  }

  private reverseGeocode(latLng: google.maps.LatLng, callback: (address: string) => void): void {
    this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        callback(results[0].formatted_address);
      }
    });
  }

  async showRoute(): Promise<void> {
    if (!this.departure || !this.destination) return;

    this.directionsService.route(
      {
        origin: this.departure,
        destination: this.destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          if (this.routePath) this.routePath.setMap(null);

          this.routePath = new google.maps.DirectionsRenderer({
            map: this.map,
            directions: result,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#4285F4',
              strokeOpacity: 0.8,
              strokeWeight: 5,
            },
          });

          this.routeCoordinates = result.routes[0].overview_path.map((p) => p.toJSON());
          const leg = result.routes[0].legs[0];
          console.log('Distance:', leg.distance?.text);
          console.log('Duration:', leg.duration?.text);
        }
      }
    );
  }

  bookRide(): void {
    if (!this.departure || !this.destination) return;
    this.rideInProgress = true;
    this.saveRideState();
  }

  startRide(): void {
    if (!this.routeCoordinates.length || this.rideStarted) return;

    this.taxiMarker = new google.maps.Marker({
      position: this.routeCoordinates[this.taxiPositionIndex],
      label: '🚕',
      map: this.map,
    });

    this.rideStarted = true;
    this.animateTaxi();
  }

  cancelRide(): void {
    this.rideInProgress = false;
    this.rideStarted = false;
    this.taxiPositionIndex = 0;

    if (this.taxiMarker) {
      this.taxiMarker.setMap(null);
      this.taxiMarker = null;
    }

    this.saveRideState();
  }

  resetMarkers(): void {
    if (this.pickupMarker) {
      this.pickupMarker.setMap(null);
      this.pickupMarker = null;
    }
    if (this.destinationMarker) {
      this.destinationMarker.setMap(null);
      this.destinationMarker = null;
    }
    if (this.routePath) {
      this.routePath.setMap(null);
      this.routePath = null;
    }

    this.departure = '';
    this.destination = '';
    this.routeCoordinates = [];
    this.saveRideState();
  }

  private animateTaxi(): void {
    if (!this.taxiMarker || this.taxiPositionIndex >= this.routeCoordinates.length) return;

    setTimeout(() => {
      this.taxiMarker!.setPosition(this.routeCoordinates[this.taxiPositionIndex]);
      this.taxiPositionIndex++;
      this.saveRideState();
      this.animateTaxi();
    }, 1000);
  }

  private saveRideState(): void {
    localStorage.setItem(
      'rideState',
      JSON.stringify({
        departure: this.departure,
        destination: this.destination,
        rideInProgress: this.rideInProgress,
        rideStarted: this.rideStarted,
        taxiPositionIndex: this.taxiPositionIndex,
      })
    );
  }

  private restoreRideState(): void {
    const saved = localStorage.getItem('rideState');
    if (saved) {
      const state = JSON.parse(saved);
      this.departure = state.departure;
      this.destination = state.destination;
      this.rideInProgress = state.rideInProgress;
      this.rideStarted = state.rideStarted;
      this.taxiPositionIndex = state.taxiPositionIndex;

      if (this.rideInProgress) {
        this.showRoute();
      }

      if (this.rideStarted && this.routeCoordinates.length) {
        this.startRide();
      }
    }
  }
}
