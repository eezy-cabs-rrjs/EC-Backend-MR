import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChatService } from './services/chat.service';
import { RidesRoutingModule } from './rides-routing.module';
import { ChatComponent } from './components/chat/chat.component';


@NgModule({
     declarations: [],
     imports: [
          CommonModule,
          RidesRoutingModule,
          HttpClientModule,
          ChatComponent
     ],
     providers: [
          ChatService,
     ],
     exports: [
          ChatComponent
     ]
})
export class RidesModule { }
