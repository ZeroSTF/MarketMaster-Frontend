import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../../../services/asset.service';
@Component({
  selector: 'app-watchListoverview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent {
  private assetService = inject(AssetService);

  watchList = this.assetService.watchlist;
  bestWinners = this.assetService.bestWinners;
  

  
}
