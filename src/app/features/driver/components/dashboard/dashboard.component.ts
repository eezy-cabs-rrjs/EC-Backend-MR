import { Component } from '@angular/core';
import { HeaderComponent } from '../partials/header/header.component';
import { FooterComponent } from '@shared/components/partials/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
