import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '@shared/components/partials/header/header.component';
import { FooterComponent } from '@shared/components/partials/footer/footer.component';

interface Message {
  senderId: string;
  message: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // RouterModule,
    HeaderComponent,
    FooterComponent,
    
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent
//  implements OnInit, OnDestroy
  {
  private chatService = inject(ChatService);
  private route = inject(ActivatedRoute);

  rideId: string = '';
  userId: string = '';
  userType: 'user' | 'driver' = 'user';
  messages: Message[] = [];
  newMessage = '';
  private subscriptions: Subscription[] = [];

  // ngOnInit(): void {
  //   this.rideId = this.route.snapshot.params['rideId'];
  //   // const user = this.authService.getCurrentUser();
  //   this.userId = user.id;
  //   this.userType = user.role === 'driver' ? 'driver' : 'user';

  //   this.joinChat();

  //   this.subscriptions.push(
  //     this.chatService.getMessages().subscribe((message: any) => {
  //       this.messages.push({
  //         ...message,
  //         isCurrentUser: message.senderId === this.userId,
  //         timestamp: new Date(message.timestamp)
  //       });
  //     })
  //   );

  //   this.subscriptions.push(
  //     this.chatService.getChatHistory().subscribe((history: any[]) => {
  //       this.messages = history.map(msg => ({
  //         ...msg,
  //         isCurrentUser: msg.senderId === this.userId,
  //         timestamp: new Date(msg.timestamp)
  //       }));
  //     })
  //   );
  // }

  joinChat() {
    this.chatService.joinChat(this.rideId, this.userId, this.userType);
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.rideId, this.userId, this.newMessage);
      this.newMessage = '';
    }
  }

  // ngOnDestroy(): void {
  //   this.subscriptions.forEach(sub => sub.unsubscribe());
  //   this.chatService.leaveChat(this.rideId);
  // }
}