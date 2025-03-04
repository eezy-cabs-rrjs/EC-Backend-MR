import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})

export class LocationService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  sendLocation(location: { latitude: number; longitude: number }) {
    this.socket.emit('locationUpdate', location);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
