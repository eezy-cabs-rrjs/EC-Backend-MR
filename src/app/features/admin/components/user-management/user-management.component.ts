import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../partials/header/header.component';
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  users: any[] = [];

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.adminService.fetchUsers().subscribe({
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

  toggleStatus(user: any) {
    console.log(user);
    const actionData = { userId: user.userId }; 
    this.adminService.userAction(actionData).subscribe({
      next: (response) => {
        if (response.success) {
          user.status = !user.status;
          this.toastr.success(response.message, 'Success') 
        } else {
          this.toastr.error(response.message, 'Error') 
          console.error(response.message); 
        }
      },
      error: (error) => {
        console.error('Error toggling user status', error);
      }
    });
  }

}
