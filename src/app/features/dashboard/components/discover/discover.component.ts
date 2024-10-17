import { StockService } from './../../../../services/stock.service';
import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
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
  //stock table
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

  private stockservice = inject(StockService);
  stockDetailsVisible: { [symbol: string]: boolean } = {};
  selectedStock: Stock | null = null;
  displayedColumns = this.columns.map(col => col.field);
  dataSource = new MatTableDataSource<Stock>();
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchControl = signal('');
  sectorControl = signal('all');
  trendControl = signal('all');
  stocks = this.stockservice.stocksSignal;


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
