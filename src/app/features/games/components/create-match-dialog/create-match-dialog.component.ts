// create-match-dialog.component.ts
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { GameService } from '../../../../services/game.service';
import { NewGameDto } from '../../../../models/game.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-create-match-dialog',
  standalone: true,
  templateUrl: './create-match-dialog.component.html',
  styleUrls: ['./create-match-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatStepperModule,
    MatDialogModule,
    MatIconModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class CreateMatchDialogComponent {
  private fb = inject(FormBuilder);
  private gameService = inject(GameService);
  private dialogRef = inject(MatDialogRef<CreateMatchDialogComponent>);

  createMatchForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    startDate: ['', Validators.required],
    startTime: ['', Validators.required],
    endDate: ['', Validators.required],
    endTime: ['', Validators.required],
    maxPlayTime: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.createMatchForm.valid) {
      const startDate = this.createMatchForm.value.startDate; // Expecting Moment object
      const startTime = this.createMatchForm.value.startTime; // Format: HH:mm
      const endDate = this.createMatchForm.value.endDate;     // Expecting Moment object
      const endTime = this.createMatchForm.value.endTime;     // Format: HH:mm
  
      // Log the date and time values for debugging
      console.log('Start Date:', startDate);
      console.log('Start Time:', startTime);
      console.log('End Date:', endDate);
      console.log('End Time:', endTime);
  
      // Check if the date and time are valid
      if (!startDate || !startTime || !endDate || !endTime) {
        console.error('Invalid date or time values.');
        return; // Exit if any field is invalid
      }
  
      // Convert Moment objects to ISO string format
      const startDateStr = startDate.toISOString().split('T')[0]; // Get the date part
      const endDateStr = endDate.toISOString().split('T')[0];     // Get the date part
  
      // Concatenate date and time strings to create valid ISO strings
      const startTimestampString = `${startDateStr}T${startTime}`;
      const endTimestampString = `${endDateStr}T${endTime}`;
  
      // Create Date objects
      const startTimestamp = new Date(startTimestampString);
      const endTimestamp = new Date(endTimestampString);
  
      // Check if the created date objects are valid
      if (isNaN(startTimestamp.getTime()) || isNaN(endTimestamp.getTime())) {
        console.error('Invalid timestamp values:', startTimestamp, endTimestamp);
        return; // Exit if timestamps are invalid
      }
  
      const newGame: NewGameDto = {
        ...this.createMatchForm.value,
        startTimestamp: startTimestamp.toISOString(),
        endTimestamp: endTimestamp.toISOString(),
        username : 'koussaykoukii'
      };
  
      this.gameService.createGame(newGame).subscribe({
        next: (response) => {
          console.log('Game created:', response);
          this.dialogRef.close(true); // Close modal on success
        },
        error: (err) => console.error('Failed to create game:', err),
      });
    } else {
      console.error('Form is invalid:', this.createMatchForm.errors);
    }
  }
  
  
  

  onCancel(): void {
    this.dialogRef.close();
  }
}
