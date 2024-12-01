import { Injectable } from '@angular/core';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarketDataService {
  private stompClient: Client;
  private marketDataSubject = new Subject<any>();
  private isConnected = false;
  private onConnect = new Subject<void>();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws-market-data`),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      this.isConnected = true;
      this.onConnect.next(); // Notify observers that the WebSocket is connected
      this.stompClient.subscribe('/topic/market-data', (message: IMessage) => {
        const marketData = JSON.parse(message.body);
        this.marketDataSubject.next(marketData);
      });
    };

    this.stompClient.onStompError = (error) => {
      console.error('WebSocket error:', error);
    };

    this.stompClient.activate();
  }

  // Method to wait until the WebSocket is connected
  public waitForConnection(): Observable<void> {
    if (this.isConnected) {
      return new Observable(observer => observer.next()); // Immediately notify if already connected
    }
    return this.onConnect.asObservable(); // Wait for the connection to be established
  }

  public requestMarketData(gameId: number, assetSymbol: string, updateRate: number): void {
    const requestPayload = {
      gameId,
      assetSymbol,
      updateRate,
    };

    this.waitForConnection().subscribe(() => {
      this.stompClient.publish({
        destination: '/app/market-data/request',
        body: JSON.stringify(requestPayload),
      });
    });
  }

  public getMarketDataUpdates(): Observable<any> {
    return this.marketDataSubject.asObservable();
  }

  public disconnect(): void {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }
}
