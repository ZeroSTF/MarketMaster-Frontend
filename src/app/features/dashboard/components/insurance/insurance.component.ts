import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { InsuranceService } from '../../../../services/insurance.service';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [],
  templateUrl: './insurance.component.html',
  styleUrl: './insurance.component.css'
})
export class InsuranceComponent implements OnInit {

private insuranceService = inject(InsuranceService);
private cd= inject( ChangeDetectorRef)
totalprime: number = 0; // Set an appropriate initial value

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.primes();
  }

  primes() {
    this.insuranceService.prime().subscribe({
      next: (value) => {
        this.totalprime = value; // Assign the received number to totalprime
        this.cd.detectChanges(); 
        console.log('total primes :',this.totalprime)
      },
      error: (err) => {
        alert('Error fetching total premiums');
        console.error('Error assurance:', err);
      },
    });
  }
}
