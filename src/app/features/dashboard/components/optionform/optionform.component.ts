import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { OptionService } from '../../../../services/option.service';
import { Option, Optionstatus, OptionType } from '../../../../models/option.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-optionform',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './optionform.component.html',
  styleUrls: ['./optionform.component.css']
})
export class OptionformComponent implements OnInit {
  OptionType = OptionType;
  option: Option = {
    id: 0,
    symbol: '',
    type: OptionType.CALL, 
    status:Optionstatus.PENDING, // Default type, can be dynamically set
    dateEcheance: '',
    premium: 0,
    strikePrice: 0,
    underlyingPrice: 0
  };
  totalprime: number = 0;
  isModalVisible: boolean = true;  // Flag to control modal visibility
  isPremiumVisible : boolean =false;
  minDate: string = new Date().toISOString().slice(0, 16);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private optionService: OptionService,private cdr: ChangeDetectorRef,private router: Router) {}

  ngOnInit(): void {
    //this.showModal();
    console.log("optionform opened");
    if (this.data) {
      console.log("data: ",this.data)
      if(this.data.asset && this.data.asset.symbol && this.data.asset.currentPrice){
        this.option.symbol = this.data.asset.symbol || '';  // Set the symbol if available
        this.option.underlyingPrice = this.data.asset.currentPrice || 0;  // Set the underlying price if available
        console.log("data symbol: ",this.option.symbol)
      }
      if(this.data.option){
        this.option.symbol=this.data.option.symbol || '';
        this.option.underlyingPrice = this.data.option.currentPrice || 0;
        this.option.dateEcheance = this.data.option.date;
        this.option.strikePrice = this.data.option.strikePrice;
        this.option.type = this.data.option.type;

      }
      
    }
  }

  // Function to show the modal
  showModal(): void {
    this.isModalVisible = true;
  }

  // Function to close the modal
  closeModal(): void {
    this.isModalVisible = false;
    this.cdr.detectChanges();
  }

  getPreview() {
    console.log("option to get prime",this.option)
    this.optionService.getPreview(this.option).subscribe({
      next: (preview) => {
        this.totalprime = preview;
        this.option.premium = preview;
        this.isPremiumVisible = true; // Display premium section
        this.cdr.detectChanges(); // Notify Angular of changes
      },
      error: (err) => {
        console.error('Error fetching preview:', err);
        alert('Failed to calculate premium. Please try again.');
      },
    });
  }
  
  buyOption() {
    if (!this.isPremiumVisible) {
      alert('Please calculate the premium before buying the option.');
      return;
    }
  
    this.optionService.buyOption(this.option).subscribe({
      next: (option) => {
        console.log('Option successfully purchased:', option);
        this.closeModal();
        
        // Close the modal after purchase
      },
      error: (err) => {
        console.error('Error buying option:', err);
        alert('Failed to complete the purchase. Please try again.');
      },
    });
  }
  
}
