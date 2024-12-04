import { Component, OnInit } from '@angular/core';
import { OverviewDTO } from '../../../../models/overview.model';
import { TransactionService } from '../../../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-overviewdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overviewdetails.component.html',
  styleUrl: './overviewdetails.component.css'
})
export class OverviewdetailsComponent implements OnInit {
  overviewData: OverviewDTO | null = null; 
  username: string = 'gaddour77'; 
  constructor(private transactionService: TransactionService,private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.transactionService.getOverviewData(this.username).subscribe(
      (data: OverviewDTO) => {
        this.overviewData = data; 
        this.cdr.detectChanges();
        console.log('Overview data fetched:', data); 
      },
      (error) => {
        console.error('Error fetching overview data:', error); 
      }
    );
  }
    
}
