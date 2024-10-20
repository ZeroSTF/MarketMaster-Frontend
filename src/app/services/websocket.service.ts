import { Injectable } from '@angular/core';
import { AssetDailyDto } from '../models/assetdto.model';
import { Subject } from 'rxjs';
import * as Stomp from 'stompjs';
import  SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: any;
  private stockDataSubject = new Subject<AssetDailyDto[]>();
  private serverUrl = 'http://localhost:8081/market';
  constructor() {
    this.connect();
  }

  private connect() {
    const socket = new SockJS(this.serverUrl); // Adjust the URL as needed
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe('/topic/market', (message: any) => {
        const data: AssetDailyDto[] = JSON.parse(message.body);
        console.log("Received stock data: ", data);
        this.stockDataSubject.next(data);
      });
      this.fetchStockData();
    });
  }

  getStockData() {
    return this.stockDataSubject.asObservable();
  }
  fetchStockData() {
    // Send the symbol to the WebSocket endpoint
    if (this.stompClient) {
    return  this.stompClient.send('/app/fetchStockData');
    } else {
      console.error('Stomp client is not connected.');
    }
  }
}
