import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OptionService } from '../../../../services/option.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionformComponent } from '../../../dashboard/components/optionform/optionform.component';

@Component({
  selector: 'app-option-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './option-sidebar.component.html',
  styleUrl: './option-sidebar.component.css'
})
export class OptionSidebarComponent {
  searchQuery: string = '';
  isLoading: boolean = false;
  prediction: any = null;
  optionService = inject(OptionService);
  private dialog = inject(MatDialog);

  constructor(private http: HttpClient) {}
  getPrediction(){
    if (!this.searchQuery) return;

    this.isLoading = true;
    this.prediction = null;
    const uppercaseQuery = this.searchQuery.toUpperCase();
    this.optionService.optionPrediction(uppercaseQuery).subscribe({
      next: (response) => {
        this.prediction = response;
        
        this.isLoading = false;
      },
      error: () => {
        alert('Failed to fetch prediction. Please try again later.');
        this.isLoading = false;
      }
    });
  }
  openOptionForm(){
    if (!this.prediction && !this.prediction.prediction.strike_price) {
      alert('Prediction data is not available.');
      return;  // Exit if prediction is not available
    }
  
    const expirationDate = this.prediction.recommendation.expiration;
    
    // Ensure the date is formatted correctly for the input field
    const formattedDate = new Date(expirationDate).toISOString().slice(0, 16);
  
    const optionData = {
      symbol: this.prediction.symbol,
      currentPrice: this.prediction.current_price,
      date: formattedDate,  // Format date to match datetime-local input format
      strikePrice: this.prediction.prediction.strike_price,
      type: this.prediction.recommendation.action // Replace with OptionType.CALL if you use enums
    };
  
    this.dialog.open(OptionformComponent, {
      width: '400px',
      data: { option: optionData }
    });
  }
  
  
}
