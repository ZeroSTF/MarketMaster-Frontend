import { Component, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OptionslistComponent } from "../../components/optionslist/optionslist.component";
import { DashboardExploreComponent } from "../../../dashboard/pages/dashboard-explore/dashboard-explore.component";
import { AssetService } from '../../../../services/asset.service';
import { Asset } from '../../../../models/asset.model';
import { CommonModule } from '@angular/common';
import { OptionSidebarComponent } from "../../components/option-sidebar/option-sidebar.component";
import { OptionService } from '../../../../services/option.service'; // Import OptionService
import { Option } from '../../../../models/option.model';
import { InsuranceComponent } from "../../../dashboard/components/insurance/insurance.component"; // Import Option model
import { OptionformComponent } from '../../../dashboard/components/optionform/optionform.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [RouterModule, OptionslistComponent, CommonModule, OptionSidebarComponent, InsuranceComponent],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {
  private assetService = inject(AssetService);
  private optionService = inject(OptionService); // Inject OptionService
  public assets = signal<Asset[]>([]);
  public optionList = signal<Option[]>([]); // Use a signal for optionList
  selectedStatus: string = 'ALL'; // Default status
  private dialog = inject(MatDialog);
  
  constructor() {
    // Subscribe to the assets signal from the service
    effect(
      () => {
        const assets = this.assetService.assets();
        if (assets.length === 0) {
          // Initial load of assets if empty
          this.assetService.getAllAssets();
        }
        this.assets.set(assets);
      },
      { allowSignalWrites: true }
    );

    // Fetch options data
    this.getOptions();
  }

  // Fetch options data
  getOptions(): void {
    this.optionService.getOptions().subscribe({
      next: (data: Option[]) => {
        this.optionList.set(data); // Update the signal with fetched data
        console.log('Options data fetched:', data);
      },
      error: (error: any) => {
        console.error('Error fetching options data:', error);
      }
    });
  }

  // Get the count of options by status (reactive)
  getOptionCount(status: string): number {
    return this.optionList().filter(option => option.status === status).length;
  }

  // Filter options by status
  filterOptions(status: string): void {
    console.log('Status selected:', status);
    this.selectedStatus = status;
  }
   openOptionForm(asset:Asset): void {
      // Open the OptionForm component in a dialog
      this.dialog.open(OptionformComponent, {
        width: '400px', // Optional: You can define the width of the dialog
        data: { asset: asset }
      });
    }
}