import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { HeaderComponent } from '../partials/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableComponent, ColumnConfig } from '@shared/components/table/table.component';

interface User {
  userId: string;
  name: string;
  email: string;
}

export type UserTemplateContext = { $implicit: User };

@Component({
  selector: 'app-kyc-list',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    RouterModule,
    TableComponent,
  ],
  templateUrl: './kyc-list.component.html',
  styleUrl: './kyc-list.component.css'
})
export class KycListComponent implements OnInit {
  users: User[] = [];
  loading = true;

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<UserTemplateContext>;
  columns: ColumnConfig[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.columns = [
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
        this.loading = false;
      },
    });
  }

  onRowClick(user: User): void {
    console.log('User clicked:', user);
  }

  onSortChange(sort: { column: string, direction: 'asc' | 'desc' }) {
    console.log('Sort changed:', sort);
  }
}