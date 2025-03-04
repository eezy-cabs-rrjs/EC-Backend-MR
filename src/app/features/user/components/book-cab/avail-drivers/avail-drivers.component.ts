import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-avail-drivers',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './avail-drivers.component.html',
  styleUrl: './avail-drivers.component.css'
})
export class AvailDriversComponent {
  @Input() drivers: any[] = [];
  @Output() driverSelected = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();

  selectDriver(driver: any) {
    this.driverSelected.emit(driver);
    this.closeModal.emit(); // Close the modal after selecting a driver
  }

}
