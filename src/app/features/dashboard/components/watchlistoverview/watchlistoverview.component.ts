import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../../../services/asset.service';
import { WatchlistItem } from '../../../../models/asset.model';
@Component({
  selector: 'app-watchListoverview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watchlistoverview.component.html',
  styleUrls: ['./watchlistoverview.component.css']
})
export class WatchlistoverviewComponent {
  private assetService = inject(AssetService);

  watchList = this.assetService.watchlist;
  bestWinners = this.assetService.bestWinners;

  
}
