
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../shared/components/table/table.component';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: Date;
}

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <h2>User Management</h2>
    <app-table 
      [columns]="columns" 
      [data]="users" 
      [totalItems]="users.length"
      (rowClick)="onRowClick($event)"
      (sortChange)="onSortChange($event)"
    ></app-table>

    <!-- Define template for date cells -->
    <ng-template #dateCell let-user>
      {{ user.joinDate.toLocaleDateString() }}
    </ng-template>
  `,
  styles: []
})

export class ParentComponent {
  @ViewChild('dateCell', { static: true }) dateCellTemplate!: TemplateRef<any>;

  
  columns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role' },
    {
      key: 'joinDate',
      header: 'Join Date',
      sortable: true,
      cellTemplate: this.dateCellTemplate
    }
  ];

  
  users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', joinDate: new Date('2023-01-15') },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', joinDate: new Date('2023-02-20') },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', joinDate: new Date('2023-03-10') },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', joinDate: new Date('2023-04-05') },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', joinDate: new Date('2023-05-12') }
  ];

  
  onRowClick(user: User) {
    console.log('Row clicked:', user);
    
  }

  
  onSortChange(event: { column: string, direction: 'asc' | 'desc' }) {
    console.log('Sort changed:', event);
    
    this.users = [...this.users.sort((a, b) => {
      const aValue = a[event.column as keyof User];
      const bValue = b[event.column as keyof User];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return event.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return event.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      return event.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    })];
  }
}
