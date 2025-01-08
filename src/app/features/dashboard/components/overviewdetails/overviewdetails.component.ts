import { Component, inject, OnInit } from '@angular/core';
import { OverviewDTO } from '../../../../models/overview.model';
import { TransactionService } from '../../../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../../auth/auth.service';
@Component({
  selector: 'app-overviewdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overviewdetails.component.html',
  styleUrl: './overviewdetails.component.css'
})
export class OverviewdetailsComponent implements OnInit {
  overviewData: OverviewDTO | null = null; 
  username: string = 'zerostf'; 
  private authService=inject(AuthService)
  constructor(private transactionService: TransactionService,private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    const currentUser=this.authService.currentUser();
   if(currentUser){
   this.username=currentUser.username;
   console.log("hhhhh",currentUser);
   }
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
