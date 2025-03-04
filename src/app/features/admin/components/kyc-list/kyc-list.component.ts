import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { HeaderComponent } from '../partials/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-kyc-list',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    RouterModule
  ],
  templateUrl: './kyc-list.component.html',
  styleUrl: './kyc-list.component.css'
})
export class KycListComponent {
  users: any[] = [];

  constructor(private adminService: AdminService){}

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.adminService.fetchPendingKyc().subscribe({
      next: (data) => {
        if (data.success) {
          this.users = data.users;  
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
