import { Component, computed, effect, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { StockdetailsComponent } from '../stockdetails/stockdetails.component';
import { Stock } from '../../../../models/stock.model';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    StockdetailsComponent
  ],
  templateUrl: './discover.component.html',
})
export class DiscoverComponent {
  // Column definitions for the stock table
  columns = [
    { field: 'logoUrl', label: 'Logo' },
    { field: 'symbol', label: 'Symbol' },
    { field: 'price', label: 'Price' },
    { field: 'volume', label: 'Volume' },
    { field: 'marketCap', label: 'Market Cap' },
    { field: 'peRatio', label: 'P/E Ratio' },
    { field: 'dividendYield', label: 'Dividend Yield' },
    { field: 'trend', label: 'Trend' },
    { field: 'actions', label: 'Actions' }
  ];

  // Stock data fetched from APIs
  stocks =signal<Stock[]> ([
    { symbol: 'AAPL', price: 145.00, volume: 1000000, marketCap: 2400000000000, peRatio: 28.00, dividendYield: 0.58, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo1.png' },
    { symbol: 'MSFT', price: 300.00, volume: 800000, marketCap: 2250000000000, peRatio: 35.00, dividendYield: 0.82, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
    { symbol: 'GOOGL', price: 2800.00, volume: 500000, marketCap: 1900000000000, peRatio: 29.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo3.png' },
    { symbol: 'AMZN', price: 3400.00, volume: 400000, marketCap: 1700000000000, peRatio: 60.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
    { symbol: 'JNJ', price: 160.00, volume: 700000, marketCap: 420000000000, peRatio: 20.00, dividendYield: 2.50, sector: 'health', trendDirection: 'up', logoUrl: 'images/logo3.png' },
    { symbol: 'TSLA', price: 700.00, volume: 600000, marketCap: 700000000000, peRatio: 200.00, dividendYield: 0.00, sector: 'auto', trendDirection: 'down', logoUrl: 'images/logo1.png' }
    ,{ symbol: 'AAPL', price: 145.00, volume: 1000000, marketCap: 2400000000000, peRatio: 28.00, dividendYield: 0.58, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo1.png' },
    { symbol: 'MSFT', price: 300.00, volume: 800000, marketCap: 2250000000000, peRatio: 35.00, dividendYield: 0.82, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
    { symbol: 'GOOGL', price: 2800.00, volume: 500000, marketCap: 1900000000000, peRatio: 29.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo3.png' },
    { symbol: 'AMZN', price: 3400.00, volume: 400000, marketCap: 1700000000000, peRatio: 60.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
    { symbol: 'JNJ', price: 160.00, volume: 700000, marketCap: 420000000000, peRatio: 20.00, dividendYield: 2.50, sector: 'health', trendDirection: 'up', logoUrl: 'images/logo3.png' },
    { symbol: 'TSLA', price: 700.00, volume: 600000, marketCap: 700000000000, peRatio: 200.00, dividendYield: 0.00, sector: 'auto', trendDirection: 'down', logoUrl: 'images/logo1.png' }
    ,{ symbol: 'AAPL', price: 145.00, volume: 1000000, marketCap: 2400000000000, peRatio: 28.00, dividendYield: 0.58, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo1.png' },
    { symbol: 'MSFT', price: 300.00, volume: 800000, marketCap: 2250000000000, peRatio: 35.00, dividendYield: 0.82, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
    { symbol: 'GOOGL', price: 2800.00, volume: 500000, marketCap: 1900000000000, peRatio: 29.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo3.png' },
    { symbol: 'AMZN', price: 3400.00, volume: 400000, marketCap: 1700000000000, peRatio: 60.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
    { symbol: 'JNJ', price: 160.00, volume: 700000, marketCap: 420000000000, peRatio: 20.00, dividendYield: 2.50, sector: 'health', trendDirection: 'up', logoUrl: 'images/logo3.png' },
    { symbol: 'TSLA', price: 700.00, volume: 600000, marketCap: 700000000000, peRatio: 200.00, dividendYield: 0.00, sector: 'auto', trendDirection: 'down', logoUrl: 'images/logo1.png' }
  
  ]);

  stockDetailsVisible: { [symbol: string]: boolean } = {};
  selectedStock: Stock | null = null;
  displayedColumns = this.columns.map(col => col.field);
  dataSource = new MatTableDataSource<Stock>();
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchControl = signal('');
  sectorControl = signal('all');
  trendControl = signal('all');
  

  filteredStocks = computed(() => {
    const searchTerm = this.searchControl().toLowerCase();
    const sector = this.sectorControl();
    const trend = this.trendControl();

    return this.stocks().filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm) &&
      (sector === 'all' || stock.sector === sector) &&
      (trend === 'all' || stock.trendDirection === trend)
    );
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.filteredStocks();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onSearchChange(event: Event) {
    this.searchControl.set((event.target as HTMLInputElement).value);
  }

  onSectorChange(event: Event) {
    this.sectorControl.set((event.target as HTMLSelectElement).value);
  }

  onTrendChange(event: Event) {
    this.trendControl.set((event.target as HTMLSelectElement).value);
  }


  

  // Open stock details
  viewStockDetails(stock: Stock) {
    this.selectedStock = this.selectedStock === stock ? null : stock;
    this.stockDetailsVisible[stock.symbol] = !this.stockDetailsVisible[stock.symbol];
  }

  

  // Format number for display
  formatNumber(num: number): string {
    return num.toLocaleString();
  }
}
