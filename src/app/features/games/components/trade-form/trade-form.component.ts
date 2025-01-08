import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { GameStateDto } from '../../../../models/game-state-dto';
import { selectGameData, selectSimulationTime } from '../../../../store/actions/game.selectors';
import { TransactionDto } from '../../../../services/game.service';

@Component({
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  styleUrls: ['./trade-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class TradeFormComponent implements OnInit, OnDestroy {
  @Output() transactionSubmit = new EventEmitter<TransactionDto>(); // Emit transaction to parent component
  tradeForm: FormGroup;
  currentSimulationTime: string | null = null;
  gameData: GameStateDto | null = null;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private cdRef: ChangeDetectorRef
  ) {
    this.tradeForm = this.fb.group({
      asset: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      action: ['buy', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('TradeFormComponent initialized.');

    // Fetch simulation time
    this.subscription.add(
      this.store.select(selectSimulationTime).subscribe((simulationTime) => {
        this.currentSimulationTime = simulationTime;
        this.cdRef.detectChanges();
      })
    );

    // Fetch game metadata
    this.subscription.add(
      this.store.select(selectGameData).subscribe((gameData) => {
        this.gameData = gameData;
        this.cdRef.detectChanges();
      })
    );
  }

  onSubmit(): void {
    if (this.tradeForm.valid && this.currentSimulationTime && this.gameData) {
      const tradeData = this.tradeForm.getRawValue();

      const transaction: TransactionDto = {
        gameId: this.gameData.gameMetadata.id,
        symbol: tradeData.asset,
        type: tradeData.action.toUpperCase() as 'BUY' | 'SELL',
        quantity: tradeData.quantity,
        simulationTimestamp: this.currentSimulationTime,
        username: this.gameData.gameParticipation.username,
      };

      console.log('Prepared Transaction:', transaction);
      this.transactionSubmit.emit(transaction); // Emit the transaction
      this.tradeForm.reset({
        asset: '',
        quantity: 1,
        action: 'buy',
      });
    } else {
      console.error('Form is invalid or missing required state data.');
    }
  }

  ngOnDestroy(): void {
    console.log('TradeFormComponent destroyed.');
    this.subscription.unsubscribe();
  }
}
