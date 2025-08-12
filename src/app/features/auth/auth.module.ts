import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SignupService } from './services/signup.service';
import { LoginService } from './services/login.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    HttpClientModule,
  ],
  providers: [
    SignupService,
    LoginService,
  ],
  exports: []
})
export class AuthModule { }
