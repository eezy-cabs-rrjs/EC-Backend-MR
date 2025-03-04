import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../../core/guards/token.interceptor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserRoutingModule,
    HttpClientModule,
  ],
  providers: []
})
export class UserModule { }
