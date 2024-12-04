
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  styleUrls: ['./trade-form.component.css'],
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
})
export class TradeFormComponent implements OnInit {
  tradeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.tradeForm = this.fb.group({
      asset: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      action: ['buy', Validators.required],
      price: [{ value: 0, disabled: true }] // Défini comme désactivé au moment de la création
    });
  }

  ngOnInit(): void {
    this.fetchCurrentPrice();
  }

  fetchCurrentPrice(): void {
    const simulatedPrice = 150.5;
    this.tradeForm.patchValue({ price: simulatedPrice });
  }

  onSubmit(): void {
    if (this.tradeForm.valid) {
      const tradeData = this.tradeForm.getRawValue();
      console.log('Trade submitted:', tradeData);
      this.tradeForm.reset({ asset: '', quantity: 1, action: 'buy', price: tradeData.price });
    }
  }
}