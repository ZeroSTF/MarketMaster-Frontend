import { Injectable, signal } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { Asset } from '../models/asset.model';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Stomp.Client | null = null;
  private readonly serverUrl = 'http://localhost:8081/market';
  private stockDataSignal = signal<Asset[]>([]);

  constructor() {
    this.connect();
  }

  private connect(): void {
    const socket = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(socket);
   this.stompClient.connect({}, 
      () => this.onConnect(),
      (error) => this.onError(error)
    );
  }

  private onConnect(): void {
    this.subscribeToStockData();
  }

  private subscribeToStockData(): void {
    if (!this.stompClient) {
      console.error('STOMP client not initialized.');
      return;
    }

    this.stompClient.subscribe('/topic/market', (message) => {
      this.handleMessage(message);
    });
  }

  private handleMessage(message: Stomp.Message): void {
    try {
      const newData: Asset[] = JSON.parse(message.body);
      this.stockDataSignal.set(newData);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  getStockData() {
    return this.stockDataSignal.asReadonly();
  }

  private onError(error: string | Stomp.Frame): void {
    console.error('WebSocket Error:', error);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
      });
    }
  }
}