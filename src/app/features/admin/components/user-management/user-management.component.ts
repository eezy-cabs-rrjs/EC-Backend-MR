import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../partials/header/header.component';
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { ColumnConfig, TableComponent } from '@shared/components/table/table.component';

interface User {
  userId: string;
  name: string;
  email: string;
  status: boolean;
}

export type UserTemplateContext = { $implicit: User };

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    TableComponent,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  columns: ColumnConfig[] = [];
  loading = false;

  @ViewChild('statusActionsTemplate', { static: true })
  statusActionsTemplate!: TemplateRef<UserTemplateContext>;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.columns = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'email', header: 'Email', sortable: true },
      {
        key: 'actions',
        header: 'Actions',
        cellTemplate: this.statusActionsTemplate
      }
    ];

    this.fetchDrivers();
  }

  fetchDrivers() {
    this.loading = true;
    this.adminService.fetchUsers().subscribe({
      next: (data) => {
        if (data.success) {
          this.users = data.users;
        }
      },
      error: (error) => {
        console.error('Error fetching users', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  toggleStatus(user: User) {
    const actionData = { userId: user.userId };
    this.adminService.userAction(actionData).subscribe({
      next: (response) => {
        if (response.success) {
          user.status = !user.status;
          this.toastr.success(response.message, 'Success');
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        console.error('Error toggling user status', error);
      }
    });
  }

  onRowClick(user: User): void {
    console.log('Clicked:', user);
  }
}