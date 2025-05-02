import { Component } from '@angular/core';
import { HeaderComponent } from '../partials/header/header.component';
import { FooterComponent } from '@shared/components/partials/footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
