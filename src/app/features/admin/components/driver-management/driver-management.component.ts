import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../partials/header/header.component';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-driver-management',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterModule
  ],
  templateUrl: './driver-management.component.html',
  styleUrl: './driver-management.component.css'
})
export class DriverManagementComponent implements OnInit {

  users: any[] = [];

  constructor(private adminService: AdminService){}

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.adminService.fetchDrivers().subscribe({
      next: (data) => {
        if (data.success) {
          this.users = data.users;  // Populate the 'users' array with the driver data
        }
      },
      error: (error) => {
        console.error('Error fetching drivers', error);
      },
      complete: () => {
        console.log('Driver fetch operation completed');
      },
    });
  }
}
