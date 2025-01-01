import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { loadMarketData } from '../store/actions/game.actions';
import { selectMarketDataStream } from '../store/actions/game.selectors';

import { Asset } from '../models/asset.model';


@Injectable({
  providedIn: 'root',
})
export class ChandelierGraphService {
  private selectedAssetSubject = new BehaviorSubject<Asset | null>(null);
  selectedAsset$ = this.selectedAssetSubject.asObservable();

  constructor(private store: Store) {}

  setSelectedAsset(asset: Asset) {
    this.selectedAssetSubject.next(asset);

    // Dispatch action to fetch market data for the selected asset
    if (asset) {
      this.store.dispatch(
        loadMarketData({
          gameId: 1, // Replace with actual gameId
          assetSymbol: asset.symbol,
          lastPauseTimestamp: '', // Update as needed
        })
      );
    }
  }

  getMarketData() {
    return this.store.select(selectMarketDataStream);
  }
}
