import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [],
  templateUrl: './stockdetails.component.html',
  styleUrl: './stockdetails.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class StockdetailsComponent implements OnInit {
  stockInfo = signal({
    symbol: '',
    name: '',
    price: 0,
    change: 0,
    marketCap: 0,
    volume: 0,
    peRatio: 0,
    high52w: 0
  });

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      
      this.stockInfo.set({
        symbol: params['symbol'],
        name: 'Sample Stock Inc',
        price: 406.32,
        change: 2.24,
        marketCap: 2800,
        volume: 45.2,
        peRatio: 28.5,
        high52w: 425.32
      });
    });
  }
}