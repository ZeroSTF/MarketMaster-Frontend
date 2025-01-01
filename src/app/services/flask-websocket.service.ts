import { Injectable, OnDestroy, signal, computed } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable, Subject, filter, map, share } from 'rxjs';
import { Asset } from '../models/asset.model';
import { ChartDataPoint } from '../models/chart.model';

interface AssetUpdate {
  type: 'asset_update';
  data: Asset;
}

interface ChartUpdate {
  type: 'price_update';
  data: ChartDataPoint;
  symbol: string;
}

type WebSocketMessage = AssetUpdate | ChartUpdate;

@Injectable({
  providedIn: 'root',
})
export class FlaskWebSocketService implements OnDestroy {
  private socket: Socket;
  private messageSubject = new Subject<WebSocketMessage>();
  private connectionStatusSignal = signal<
    'connected' | 'disconnected' | 'error'
  >('disconnected');

  readonly connectionStatus = computed(() => this.connectionStatusSignal());
  readonly messages$ = this.messageSubject.asObservable().pipe(share());

  constructor() {
    this.socket = io(environment.flaskUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connectionStatusSignal.set('connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.connectionStatusSignal.set('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.connectionStatusSignal.set('error');
    });

    // Listen for all message types
    this.socket.on('asset_update', (data: Asset) => {
      this.messageSubject.next({ type: 'asset_update', data });
    });

    this.socket.on(
      'price_update',
      (data: { data: ChartDataPoint; symbol: string }) => {
        this.messageSubject.next({ type: 'price_update', ...data });
      }
    );
  }

  // Helper methods to get typed message streams
  getAssetUpdates(): Observable<Asset> {
    return this.messages$.pipe(
      filter(
        (message): message is AssetUpdate => message.type === 'asset_update'
      ),
      map((message) => message.data)
    );
  }

  getChartUpdates(symbol: string): Observable<ChartDataPoint> {
    return this.messages$.pipe(
      filter(
        (message): message is ChartUpdate =>
          message.type === 'price_update' && message.symbol === symbol
      ),
      map((message) => message.data)
    );
  }

  // Subscribe to specific asset updates
  subscribeToAsset(symbol: string): void {
    this.socket.emit('subscribe_asset', { symbol });
  }

  // Unsubscribe from specific asset updates
  unsubscribeFromAsset(symbol: string): void {
    this.socket.emit('unsubscribe_asset', { symbol });
  }

  connect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.messageSubject.complete();
  }
}
