import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewsArticle } from '../../../../services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-dialog.component.html',
  styleUrls: ['./news-dialog.component.css'],
})
export class NewsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NewsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewsArticle
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
