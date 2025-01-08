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
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  // Import MatProgressSpinnerModule

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
    MatIconModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class CreateMatchDialogComponent {
  private fb = inject(FormBuilder);
  private gameService = inject(GameService);
  private dialogRef = inject(MatDialogRef<CreateMatchDialogComponent>);

  loading = false;

  createMatchForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    startDate: ['', Validators.required],
    startTime: ['', Validators.required],
    endDate: ['', Validators.required],
    endTime: ['', Validators.required],
    maxPlayTime: [null, [Validators.required, Validators.min(1)]],
  });

  onSubmit(): void {
    if (this.createMatchForm.valid) {
      this.loading = true;

      // Fetch the username from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const username = user?.username; // Extract the username from the user object

      if (!username) {
        console.error('Username not found in localStorage');
        this.loading = false;
        return;
      }

      const { startDate, startTime, endDate, endTime, ...rest } = this.createMatchForm.value;

      try {
        // Combine and validate timestamps
        const startTimestamp = this.combineDateAndTime(startDate, startTime);
        const endTimestamp = this.combineDateAndTime(endDate, endTime);

        if (startTimestamp >= endTimestamp) {
          throw new Error('End time must be after start time.');
        }

        const newGame: NewGameDto = {
          ...rest,
          startTimestamp: startTimestamp.toISOString(),
          endTimestamp: endTimestamp.toISOString(),
          username: username, // Use the dynamically fetched username
        };

        this.gameService.createGame(newGame).pipe(
          finalize(() => (this.loading = false)),
          catchError((error: any) => {  // Use any to handle the error
            if (error instanceof Error) {  // Check if error has message property
              console.error(error.message);
            } else {
              console.error('An unknown error occurred', error);
            }
            this.loading = false;
            return of(null); // Return null or handle error accordingly
          })
        ).subscribe((response) => {
          if (response) {
            console.log('Game created:', response);
            this.dialogRef.close(true); // Close modal on success
          }
        });

      } catch (error) {
        // Handle synchronous errors (e.g., invalid date/time format)
        console.error(error instanceof Error ? error.message : 'Unknown error');
        this.loading = false;
      }
    } else {
      console.error('Form is invalid:', this.createMatchForm.errors);
    }
  }

  combineDateAndTime(date: any, time: string): Date {
    if (!date || !time) {
      throw new Error('Invalid date or time values.');
    }
    const dateStr = date.toISOString().split('T')[0];
    const timestamp = new Date(`${dateStr}T${time}`);
    if (isNaN(timestamp.getTime())) {
      throw new Error('Invalid combined timestamp.');
    }
    return timestamp;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}