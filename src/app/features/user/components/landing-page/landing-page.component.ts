import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@shared/components/partials/footer/footer.component';
import { HeaderComponent } from '@shared/components/partials/header/header.component';

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