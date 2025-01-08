import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { LimitOrder, OrderStatus } from '../../models/limitOrder.model';
import { TransactionService } from '../../services/transaction.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Transaction } from '../../models/Transaction.model';

@Component({
  selector: 'app-buy-sell',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    NgIf
  ],
  templateUrl: './buy-sell.component.html',
  styleUrls: ['./buy-sell.component.css'],
})
export class BuySellComponent implements OnInit {
  tradeForm: FormGroup;
  isLoading = false;
  username: string = 'zerostf';
  symbol: string = '';
  price: number | null = null;
  transaction:Transaction|null=null;
  actionMessage: string = '';
  prix:number=0;
  private authService=inject(AuthService)
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {
    this.tradeForm = this.fb.group({
      action: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],  // Ensures quantity is not empty and positive
      isScheduled: [false],
      price: ['']
    });
  }

  ngOnInit() {
    const currentUser=this.authService.currentUser();
   if(currentUser){
   this.username=currentUser.username;
   
   }
    // Fetch query parameters
    this.route.queryParams.subscribe(params => {
      this.symbol = params['symbol'] || '';
      this.price = params['price'] || 0;
    });
    this.transactionService.findMaxQuantity(this.username, this.symbol).subscribe({
      next: (data) => {
        this.transaction = data;
        
        console.log('Max Quantity:', data);
      },
      error: (err) => {
        console.error('Error fetching max Quantity:', err);
      },
    });
  
    // Set conditional validation on price when scheduling is checked
    this.tradeForm.get('isScheduled')?.valueChanges.subscribe((isScheduled) => {
      const priceControl = this.tradeForm.get('price');
      if (isScheduled) {
        priceControl?.setValidators([Validators.required, Validators.min(0.01)]); // Price should be positive if scheduled
      } else {
        priceControl?.clearValidators();
      }
      priceControl?.updateValueAndValidity();
    });
    this.tradeForm.get('action')?.valueChanges.subscribe((action) => {
      this.actionMessage = action === 'buy' 
  ? this.transaction?.price && this.price 
    ? `You can Buy ${this.transaction.price / this.price}` 
    : 'Price or transaction data is not available' 
  : action === 'sell' 
    ? `You can sell ${this.transaction?.quantity}` 
    : '';
    });
  }

  onSubmit() {
    if (this.tradeForm.valid) {
      this.isLoading = true;
      const now = new Date();
  
      if (!this.tradeForm.get('isScheduled')?.value) {
        const transaction: Transaction = {
          type: this.tradeForm.get('action')?.value.toUpperCase(),
          quantity: this.tradeForm.get('quantity')?.value,
          symbol: this.symbol ?? '',  
          price: this.price ?? 0,      
          timeStamp: now
        };
        console.log("Transaction:", transaction);
        this.router.navigate(['/preview-order'], { state: { transaction } });
      } else {
        const limitOrder: LimitOrder = {
          type: this.tradeForm.get('action')?.value.toUpperCase(),
          quantity: this.tradeForm.get('quantity')?.value,
          symbol: this.symbol ?? '',       
          limitPrice: this.tradeForm.get('price')?.value,
          status: OrderStatus.PENDING
        };
        console.log("Limit Order:", limitOrder);
        this.router.navigate(['/preview-order'], { state: { limitOrder } });
      }
  
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }
  }
  gotoexplore():void{
    this.router.navigate(['/dashboard/discover']);
  }
}
