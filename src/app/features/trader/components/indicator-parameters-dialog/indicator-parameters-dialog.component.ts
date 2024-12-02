import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-indicator-parameters-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  template: `
    <h2 mat-dialog-title>Configure {{ data.indicator.name }} Parameters</h2>
    <mat-dialog-content>
      <div class="flex flex-col space-y-4">
        @for (param of data.indicator.parameters; track param.name) {
        <mat-form-field appearance="outline">
          <mat-label>{{ param.name }}</mat-label>
          <input
            matInput
            type="number"
            [(ngModel)]="param.currentValue"
            [min]="param.min"
            [max]="param.max"
            [step]="param.step || 1"
          />
          <mat-hint> Min: {{ param.min }}, Max: {{ param.max }} </mat-hint>
        </mat-form-field>
        }
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class IndicatorParametersDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<IndicatorParametersDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      indicator: any;
      currentParameters: any[];
    }
  ) {
    // Populate current values from existing parameters or defaults
    this.data.indicator.parameters = this.data.indicator.parameters.map(
      (param: any) => ({
        ...param,
        currentValue:
          this.data.currentParameters.find((p) => p.name === param.name)
            ?.value || param.default,
      })
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Extract only the parameters with their current values
    const parameters = this.data.indicator.parameters.map((param: any) => ({
      name: param.name,
      value: param.currentValue,
    }));

    this.dialogRef.close(parameters);
  }
}
