import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})  

export class TableComponent<T extends Record<string, any>> {
  @Input() columns: ColumnConfig[] = [];
  @Input() data: T[] = [];
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() loading: boolean = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() rowClick = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onRowClick(item: T): void {
    this.rowClick.emit(item);
  }

  onSort(column: string): void {
    const columnConfig = this.columns.find(c => c.key === column);
    if (columnConfig?.sortable) {
      const direction = columnConfig.direction === 'asc' ? 'desc' : 'asc';
      this.sortChange.emit({ column, direction });
    }
  }

  trackByFn(index: number, item: T): any {
    return item['id'] || index; 
  }
}

export interface ColumnConfig {
  key: string;
  header: string;
  sortable?: boolean;
  direction?: 'asc' | 'desc';
  cellTemplate?: TemplateRef<any> | null; 
}