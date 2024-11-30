import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Transaction} from '../../models/Transaction.model';
import { LimitOrder } from '../../models/limitOrder.model';
import { CurrencyPipe, DatePipe,NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TransactionService } from '../../services/transaction.service';
@Component({
  selector: 'app-preview-order',
  standalone: true,
  imports:[ CurrencyPipe, 
    DatePipe,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    NgIf],
  templateUrl: './preview-order.component.html',
  styleUrl: './preview-order.component.css'
})
export class PreviewOrderComponent implements OnInit {
  transaction: Transaction | null = null;
  limitOrder: LimitOrder | null = null;

  constructor(private router: Router,private transactionService :TransactionService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { transaction?: Transaction; limitOrder?: LimitOrder };
    this.transaction = state?.transaction || null;
    this.limitOrder = state?.limitOrder || null;
  }

  ngOnInit(): void {}

  onConfirm(): void {
    console.log('Order confirmed');
    if (this.transaction) {
        this.transactionService.addTransaction("zerostf", this.transaction).subscribe(
            (response) => console.log('Transaction confirmed in backend', response),
            (error) => console.error('Error confirming transaction', error)
        );
    } else if (this.limitOrder) {
        this.transactionService.addOrder("zerostf", this.limitOrder).subscribe(
            (response) => console.log('LimitOrder confirmed in backend', response),
            (error) => console.error('Error confirming order', error)
        );
    }
    this.router.navigate(['/dashboard/discover']);
}

  onBack(): void {
    // Navigate back to BuySellComponent
    this.router.navigate(['/buysell']);
  }
}
