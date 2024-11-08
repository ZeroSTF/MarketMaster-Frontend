import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { AssetService } from '../../../../services/asset.service';
import { ChartService } from '../../../../services/chart.service';

@Component({
  selector: 'app-asset-selector',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './asset-selector.component.html',
})
export class AssetSelectorComponent {
  private assetService = inject(AssetService);
  private chartService = inject(ChartService);

  assets = computed(() => this.assetService.assets());
  selectedAsset = computed(() => this.chartService.selectedAsset());

  ngOnInit() {
    this.assetService.getAllAssets();
  }

  onAssetSelected(event: MatSelectChange) {
    this.chartService.setSelectedAsset(event.value);
  }
}
