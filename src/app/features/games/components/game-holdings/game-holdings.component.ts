import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectHoldings } from '../../../../store/actions/game.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-holdings',
  templateUrl: './game-holdings.component.html',
  styleUrls: ['./game-holdings.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GameHoldingsComponent implements OnInit {
  holdings$!: Observable<{ symbol: string; quantity: number; averageCostBasis: number }[]>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.holdings$ = this.store.select(selectHoldings);
  }
}