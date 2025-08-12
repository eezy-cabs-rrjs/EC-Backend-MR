import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule,
    MatDialogModule,
  ],
  template: `
  <h2 mat-dialog-title>Confirm Action</h2>
  <mat-dialog-content>{{ data.message }}</mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button color="primary" (click)="onConfirm()">Confirm</button>
    <button mat-button color="warn" (click)="onCancel()">Cancel</button>
  </mat-dialog-actions>
`,
  styles: [
    `
    mat-dialog-content {
      padding: 20px;
      text-align: center;
    }
    mat-dialog-actions {
      justify-content: center;
      gap: 10px;
    }
  `,
  ],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
