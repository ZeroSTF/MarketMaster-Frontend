import { Injectable, signal } from '@angular/core';
import { Stock } from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {

// Defining the stock data and the search term as signals
stocksSignal =signal<Stock[]> ([
  { symbol: 'AAPL', price: 145.00, volume: 1000000, marketCap: 2400000000000, peRatio: 28.00, dividendYield: 0.58, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo1.png' },
  { symbol: 'MSFT', price: 300.00, volume: 800000, marketCap: 2250000000000, peRatio: 35.00, dividendYield: 0.82, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
  { symbol: 'GOOGL', price: 2800.00, volume: 500000, marketCap: 1900000000000, peRatio: 29.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo3.png' },
  { symbol: 'AMZN', price: 3400.00, volume: 400000, marketCap: 1700000000000, peRatio: 60.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
  { symbol: 'JNJ', price: 160.00, volume: 700000, marketCap: 420000000000, peRatio: 20.00, dividendYield: 2.50, sector: 'health', trendDirection: 'up', logoUrl: 'images/logo3.png' },
  { symbol: 'TSLA', price: 700.00, volume: 600000, marketCap: 700000000000, peRatio: 200.00, dividendYield: 0.00, sector: 'auto', trendDirection: 'down', logoUrl: 'images/logo1.png' }
  ,{ symbol: 'AAPL', price: 145.00, volume: 1000000, marketCap: 2400000000000, peRatio: 28.00, dividendYield: 0.58, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo1.png' },
  { symbol: 'MSFT', price: 300.00, volume: 800000, marketCap: 2250000000000, peRatio: 35.00, dividendYield: 0.82, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
  { symbol: 'GOOGL', price: 2800.00, volume: 500000, marketCap: 1900000000000, peRatio: 29.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo3.png' },
  { symbol: 'AMZN', price: 3400.00, volume: 400000, marketCap: 1700000000000, peRatio: 60.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
  { symbol: 'JNJ', price: 160.00, volume: 700000, marketCap: 420000000000, peRatio: 20.00, dividendYield: 2.50, sector: 'health', trendDirection: 'up', logoUrl: 'images/logo3.png' },
  { symbol: 'TSLA', price: 700.00, volume: 600000, marketCap: 700000000000, peRatio: 200.00, dividendYield: 0.00, sector: 'auto', trendDirection: 'down', logoUrl: 'images/logo1.png' }
  ,{ symbol: 'AAPL', price: 145.00, volume: 1000000, marketCap: 2400000000000, peRatio: 28.00, dividendYield: 0.58, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo1.png' },
  { symbol: 'MSFT', price: 300.00, volume: 800000, marketCap: 2250000000000, peRatio: 35.00, dividendYield: 0.82, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
  { symbol: 'GOOGL', price: 2800.00, volume: 500000, marketCap: 1900000000000, peRatio: 29.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'up', logoUrl: 'images/logo3.png' },
  { symbol: 'AMZN', price: 3400.00, volume: 400000, marketCap: 1700000000000, peRatio: 60.00, dividendYield: 0.00, sector: 'tech', trendDirection: 'down', logoUrl: 'images/logo2.png' },
  { symbol: 'JNJ', price: 160.00, volume: 700000, marketCap: 420000000000, peRatio: 20.00, dividendYield: 2.50, sector: 'health', trendDirection: 'up', logoUrl: 'images/logo3.png' },
  { symbol: 'TSLA', price: 700.00, volume: 600000, marketCap: 700000000000, peRatio: 200.00, dividendYield: 0.00, sector: 'auto', trendDirection: 'down', logoUrl: 'images/logo1.png' }

]);

// Signal for the search term
private searchTermSignal = signal('');

constructor() {}

// Expose signals for components to access
getStocks() {
  return this.stocksSignal();
}

getSearchTerm() {
  return this.searchTermSignal();
}

setSearchTerm(term: string) {
  this.searchTermSignal.set(term);
}

// Filter stocks based on the current search term
getFilteredStocks() {
  const searchTerm = this.searchTermSignal().toLowerCase();
  return this.stocksSignal().filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm)
  );
}}
