import { Component } from '@angular/core';
import { HeaderComponent } from '../partials/header/header.component';
import { FooterComponent } from '@shared/components/partials/footer/footer.component';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent {

}
