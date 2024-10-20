import { Injectable, signal, effect } from '@angular/core';
import { AssetDailyDto } from '../models/assetdto.model';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Stomp.Client | null = null;
  private readonly serverUrl = 'http://localhost:8081/market';
  
  private stockDataSignal = signal<AssetDailyDto[]>([]);

  constructor() {
    this.connect();
  }

  private connect() {
    const socket = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame) => {
      this.subscribeToStockData();
      this.fetchStockData();
    }, this.onError);
  }

  private subscribeToStockData() {
    if (!this.stompClient) return;

    this.stompClient.subscribe('/topic/market', (message) => {
      const newData: AssetDailyDto[] = JSON.parse(message.body);
      this.stockDataSignal.update(currentData => {
        const updatedData = this.mergeAndUpdateStockData(currentData, newData);
        return updatedData;
      });
    });
  }

  private mergeAndUpdateStockData(currentData: AssetDailyDto[], newData: AssetDailyDto[]): AssetDailyDto[] {
    const mergedData = new Map(currentData.map(item => [item.symbol, item]));

    newData.forEach(newItem => {
      const existingItem = mergedData.get(newItem.symbol);
      if (!existingItem || !this.isEqual(existingItem, newItem)) {
        mergedData.set(newItem.symbol, newItem);
      }
    });

    return Array.from(mergedData.values());
  }


  private isEqual(a: AssetDailyDto, b: AssetDailyDto): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  getStockData() {
    return this.stockDataSignal.asReadonly();
  }

  fetchStockData() {
    if (this.stompClient?.connected) {
      this.stompClient.send('/app/fetchStockData');
    } else {
      console.error('Stomp client is not connected.');
    }
  }

  private onError(error: string | Stomp.Frame) {
    console.error('WebSocket Error:', error);
  }
}