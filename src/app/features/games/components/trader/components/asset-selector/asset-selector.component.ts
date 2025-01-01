import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { AssetService } from '../../../../../../services/asset.service';
import { ChartService } from '../../../../../../services/chart.service';
import { Asset } from '../../../../../../models/asset.model';

@Component({
  selector: 'app-asset-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './asset-selector.component.html',
  styleUrls: ['./asset-selector.component.scss']
})
export class AssetSelectorComponent implements OnInit {
  private assetService = inject(AssetService);
  private chartService = inject(ChartService);
  
  searchControl = new FormControl('');
  assets = computed(() => this.assetService.assets());
  selectedAsset = computed(() => this.chartService.selectedAsset());
  
  filteredAssets = computed(() => {
    const allAssets = this.assets();
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    
    if (!searchTerm) return allAssets;
    
    return allAssets.filter(asset => 
      asset.symbol.toLowerCase().includes(searchTerm) ||
      asset.name.toLowerCase().includes(searchTerm)
    );
  });

  ngOnInit() {
    this.assetService.getAllAssets();
    
    // Setup search with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      // Trigger filtered assets update
      this.filteredAssets();
    });

    // Initialize with first asset if none selected
    if (!this.selectedAsset()) {
      const firstAsset = this.assets()[0];
      if (firstAsset) {
        this.chartService.setSelectedAsset(firstAsset);
      }
    }
  }

  onAssetSelected(event: MatSelectChange) {
    const selectedAsset = event.value as Asset;
    this.chartService.setSelectedAsset(selectedAsset);
  }

  displayFn(asset: Asset): string {
    return asset ? `${asset.symbol} - ${asset.name}` : '';
  }
}