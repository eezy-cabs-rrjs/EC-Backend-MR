import { Component } from '@angular/core';
import { FooterComponent } from '../partials/footer/footer.component';
import { HeaderComponent } from '../partials/header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    RouterModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent  {}