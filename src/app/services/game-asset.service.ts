import { Injectable, signal, computed } from '@angular/core';
import { Asset } from '../models/asset.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameAssetService {
  private selectedAssetSignal = signal<Asset | null>(null);
  private assetsSignal = signal<Asset[]>([]);

  readonly selectedAsset = computed(() => this.selectedAssetSignal());
  readonly assets = computed(() => this.assetsSignal());

  private readonly apiUrl = `${environment.apiUrl}/asset`;

  constructor(private http: HttpClient) {}

  getAllAssets(page: number = 0, size: number = 20): void {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    this.http
      .get<{ content: Asset[] }>(`${this.apiUrl}/getAll`, { params })
      .subscribe((response) => {
        this.assetsSignal.set(response.content);
      });
  }

  setSelectedAsset(asset: Asset): void {
    this.selectedAssetSignal.set(asset);
  }
}
