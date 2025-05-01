import { Injectable, inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket = inject(Socket);

  joinChat(rideId: string, userId: string, userType: 'user' | 'driver') {
    this.socket.emit('joinChat', { rideId, userId, userType });
  }

  sendMessage(rideId: string, senderId: string, message: string) {
    this.socket.emit('sendMessage', { rideId, senderId, message });
  }

  getMessages(): Observable<any> {
    return this.socket.fromEvent('newMessage');
  }

  getChatHistory(): Observable<any> {
    return this.socket.fromEvent('chatHistory');
  }

  leaveChat(rideId: string) {
    this.socket.emit('leaveChat', { rideId });
  }
}