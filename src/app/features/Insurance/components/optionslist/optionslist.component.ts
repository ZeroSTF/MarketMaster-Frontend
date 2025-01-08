import { Component, ChangeDetectorRef, Input, OnInit, OnChanges } from '@angular/core';
import { OptionService } from '../../../../services/option.service';
import { Option } from '../../../../models/option.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-optionslist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './optionslist.component.html',
  styleUrl: './optionslist.component.css'
})
export class OptionslistComponent implements OnInit, OnChanges {
  @Input() status: string | undefined; // Le statut peut être undefined ou 'ALL'
  optionList: Option[] = [];

  constructor(
    private optionService: OptionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getOption();
  }

  ngOnChanges(): void {
    console.log('Status input changed:', this.status);
    this.cdr.detectChanges();
  }

  getOption(): void {
    this.optionService.getOptions().subscribe({
      next: (data: Option[]) => {
        this.optionList = data;
        console.log('Option data fetched:', data);
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error fetching option data:', error);
      }
    });
  }

  get filteredOptions(): Option[] {
    if (!this.status || this.status === 'ALL') {
      console.log('Displaying all options');
      return this.optionList; // Retourne toutes les options si le statut est 'ALL' ou undefined
    }
    console.log('Filtering options with status:', this.status);
    console.log('Full option list:', this.optionList);
    const filtered = this.optionList.filter(option => option.status === this.status);
    console.log('Filtered options:', filtered);
    return filtered;
  }

  applyOption(option: Option): void {
    this.optionService.applyOption(option).subscribe({
      next: (data: any) => {
        console.log("Transaction successful", data);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        alert("Something went wrong.");
        console.error(err);
      }
    });
  }
}