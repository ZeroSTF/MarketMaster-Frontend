import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-indicator-parameters-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.indicator.name }} Parameters</h2>
    <mat-dialog-content>
      <form [formGroup]="parametersForm">
        <mat-form-field
          *ngFor="let param of data.currentParameters"
          class="w-full"
        >
          <mat-label>{{ param.name }}</mat-label>
          <input
            matInput
            type="number"
            [formControlName]="param.name"
            [min]="param.min"
            [max]="param.max"
          />
          <mat-error *ngIf="parametersForm.get(param.name)?.invalid">
            Value must be between {{ param.min }} and {{ param.max }}
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSave()"
        [disabled]="parametersForm.invalid"
      >
        Save
      </button>
    </mat-dialog-actions>
  `,
})
export class IndicatorParametersDialogComponent {
  parametersForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<IndicatorParametersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    // Create form controls dynamically based on current parameters
    const formControls: any = {};
    data.currentParameters.forEach((param: any) => {
      formControls[param.name] = [
        param.value,
        [
          Validators.required,
          Validators.min(param.min),
          Validators.max(param.max),
        ],
      ];
    });
    this.parametersForm = this.fb.group(formControls);
  }

  onSave() {
    if (this.parametersForm.valid) {
      // Convert form values to array of parameter objects
      const parameters = Object.keys(this.parametersForm.value).map((key) => ({
        name: key,
        value: this.parametersForm.value[key],
      }));
      this.dialogRef.close(parameters);
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
