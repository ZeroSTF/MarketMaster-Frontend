// quick-match.component.ts
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateMatchDialogComponent } from '../create-match-dialog/create-match-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quick-match',
  standalone: true,
  templateUrl: './quick-match.component.html',
  styleUrls: ['./quick-match.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    CreateMatchDialogComponent // Ensure this is included for the dialog
  ]
})
export class QuickMatchComponent {
  private dialog = inject(MatDialog);

  openCreateMatchDialog(): void {
    const dialogRef = this.dialog.open(CreateMatchDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed with result:', result);
      }
    });
  }
}
