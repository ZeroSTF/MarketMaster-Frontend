import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngClass

@Component({
  selector: 'app-current-holdings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-holdings.component.html',
  styleUrls: ['./current-holdings.component.css']
})
export class CurrentHoldingsComponent implements OnInit {

  holdings = [
    { name: 'AAPL', quantity: 10, price: 150, value: 1500, change: '+3%' },
    { name: 'GOOGL', quantity: 5, price: 2800, value: 14000, change: '-1%' },
    { name: 'TSLA', quantity: 3, price: 750, value: 2250, change: '+5%' },
    { name: 'BTC', quantity: 0.5, price: 40000, value: 20000, change: '+7%' }
  ];

  constructor() { }

  ngOnInit(): void { }

}
