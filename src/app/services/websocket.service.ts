import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private wsUrl = 'http://localhost:8081/api/ws-market-data';
  private socket$: WebSocketSubject<any> | undefined;

  connect(): WebSocketSubject<any> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({
        url: `${this.wsUrl}/websocket`,
        openObserver: {
          next: () => console.log('WebSocket connection opened.')
        },
        closeObserver: {
          next: () => console.log('WebSocket connection closed.')
        }
      });
    }
    return this.socket$;
  }

  sendMessage(message: any): void {
    if (!this.socket$) {
      this.connect(); // Ensure the connection is made before sending a message
    }
    this.socket$?.next(message);
  }

  getMessages(): Observable<any> {
    if (!this.socket$) {
      this.connect(); // Initialize the connection if not already done
    }
    return this.socket$?.asObservable().pipe(
      retry(3),
      catchError(err => {
        console.error('WebSocket error:', err);
        return throwError(err);
      })
    ) as Observable<any>;
  }

  disconnect(): void {
    this.socket$?.complete();
    console.log('WebSocket disconnected.');
  }
}
