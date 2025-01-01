import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { GameStateDto } from '../../../../models/game-state-dto';
import { GameService, TransactionDto } from '../../../../services/game.service';
import { selectGameData, selectSimulationTime } from '../../../../store/actions/game.selectors';

@Component({
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  styleUrls: ['./trade-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class TradeFormComponent implements OnInit, OnDestroy {
  tradeForm: FormGroup;
  currentSimulationTime: string | null = null;
  gameData: GameStateDto | null = null;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private gameService: GameService,
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
        console.log('Simulation Time Updated:', simulationTime);
        this.currentSimulationTime = simulationTime;
        this.cdRef.detectChanges();
      })
    );

    // Fetch game metadata
    this.subscription.add(
      this.store.select(selectGameData).subscribe((gameData) => {
        console.log('Game Data Updated:', gameData);
        this.gameData = gameData;
        this.cdRef.detectChanges();
      })
    );

    // Simulated price for now
    this.fetchCurrentPrice();
  }

  fetchCurrentPrice(): void {
    const simulatedPrice = 150.5; // Replace with actual price fetching logic if needed
    console.log('Setting simulated price:', simulatedPrice);
    this.tradeForm.patchValue({ price: simulatedPrice });
  }

  onSubmit(): void {
    console.log('Submit button clicked.');
    console.log('Form Value:', this.tradeForm.getRawValue());
    console.log('Current Simulation Time:', this.currentSimulationTime);
    console.log('Game Data:', this.gameData);

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

      this.gameService.processTransaction(transaction).subscribe({
        next: (response) => {
          console.log('Transaction successful:', response);
          this.tradeForm.reset({
            asset: '',
            quantity: 1,
            action: 'buy',
            price: tradeData.price,
          });
        },
        error: (error) => console.error('Transaction failed:', error),
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
