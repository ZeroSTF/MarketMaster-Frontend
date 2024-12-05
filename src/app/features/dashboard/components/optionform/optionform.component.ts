import { Component, Inject, OnInit } from '@angular/core';
import { OptionService } from '../../../../services/option.service';
import { Option, OptionType } from '../../../../models/option.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    type: OptionType.CALL,  // Default type, can be dynamically set
    dateEcheance: '',
    premium: 0,
    strikePrice: 0,
    underlyingPrice: 0
  };
  totalprime: number = 0;
  isModalVisible: boolean = true;  // Flag to control modal visibility

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private optionService: OptionService) {}

  ngOnInit(): void {
    //this.showModal();
    console.log("optionform opened");
    if (this.data) {
      console.log("data: ",this.data)
      this.option.symbol = this.data.asset.symbol || '';  // Set the symbol if available
      this.option.underlyingPrice = this.data.asset.currentPrice || 0;  // Set the underlying price if available
      console.log("data symbol: ",this.option.symbol)
    }
  }

  // Function to show the modal
  showModal(): void {
    this.isModalVisible = true;
  }

  // Function to close the modal
  closeModal(): void {
    this.isModalVisible = false;
  }

  buyOption() {
    console.log("trying to add ", this.option);
    this.optionService.buyOption(this.option).subscribe({
      next: (option) => {
        console.log('Option created:', option);
        this.totalprime = option.premium;  // Update the total prime after creation
        this.closeModal();  // Close the modal after successful submission
      },
      error: (err) => {
        alert('Error occurred while creating the option. Please try again later.');
        console.error('Error buying option:', err);
      }
    });
  }
}
