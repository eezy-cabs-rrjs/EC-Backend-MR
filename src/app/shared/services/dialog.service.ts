import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DialogService {
     constructor(private dialog: MatDialog) { }

     confirm(message: string): Observable<boolean> {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
               width: '400px',
               data: { message }
          });
          return dialogRef.afterClosed();
     }
}