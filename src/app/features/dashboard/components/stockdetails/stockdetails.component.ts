import { Component, inject} from '@angular/core';
import { StockService } from '../../../../services/stock.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './stockdetails.component.html',
  styleUrl: './stockdetails.component.css'
})
export class StockdetailsComponent {
  private stockService = inject(StockService);

  // Signal to track the selected stock
  selectedStock = this.stockService.selectedStockSignal;
  
}