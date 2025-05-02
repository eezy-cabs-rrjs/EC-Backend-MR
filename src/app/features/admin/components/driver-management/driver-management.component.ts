import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../partials/header/header.component';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ColumnConfig, TableComponent } from '@shared/components/table/table.component';

interface User {
  userId: string;
  name: string;
  email: string;
  profileImage?: string;
}

export type UserTemplateContext = { $implicit: User };

@Component({
  selector: 'app-driver-management',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterModule,
    TableComponent,
  ],
  templateUrl: './driver-management.component.html',
  styleUrl: './driver-management.component.css'
})

export class DriverManagementComponent implements OnInit {
  users: User[] = []; 
  loading = true;

  
  @ViewChild('profileImageTemplate', { static: true }) profileImageTemplate!: TemplateRef<UserTemplateContext>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<UserTemplateContext>;

  columns: ColumnConfig[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    
    this.columns = [
      {
        key: 'profileImage',
        header: 'Profile',
        cellTemplate: this.profileImageTemplate
      },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'email', header: 'Email', sortable: true },
      {
        key: 'actions',
        header: 'Actions',
        cellTemplate: this.actionsTemplate
      }
    ];

    this.fetchDrivers();
  }

  fetchDrivers() {
    this.loading = true;
    this.adminService.fetchDrivers().subscribe({
      next: (data) => {
        if (data.success) {
          this.users = data.users.map((user : User) => ({
            ...user,
            profileImage: '@assets/img/profile/user.png'
          })); 
        }
      },
      error: (error) => {
        console.error('Error fetching drivers', error);
        this.loading = false;
      },
      complete: () => {
        console.log('Driver fetch operation completed');
        this.loading = false;
      },
    });
  }

  onRowClick(user: User) { 
    console.log('User clicked:', user);
  }

  onSortChange(sort: { column: string, direction: 'asc' | 'desc' }) {
    console.log('Sort changed:', sort);
  }
}