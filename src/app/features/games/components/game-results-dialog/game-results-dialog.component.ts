import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule
import { GameResultsDto } from '../../../../services/game.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule for buttons

@Component({
  selector: 'app-game-results-dialog',
  templateUrl: './game-results-dialog.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule], // Add MatDialogModule and MatButtonModule
  styleUrls: ['./game-results-dialog.component.css'],
})
export class GameResultsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: GameResultsDto) {}
}