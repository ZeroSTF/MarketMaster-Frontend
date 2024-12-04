import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MarketDataService } from '../../../../services/market-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chandelier-graph',
  standalone: true,
  templateUrl: './chandelier-graph.component.html',
  styleUrls: ['./chandelier-graph.component.css']
})
export class ChandelierGraphComponent implements AfterViewInit, OnDestroy {
  private subscription: Subscription | null = null;
  private tradingViewWidget: any;

  constructor(private marketDataService: MarketDataService) {}

  ngAfterViewInit(): void {
    this.tradingViewWidget = new (window as any).TradingView.widget({
      // Set up basic widget properties
      interval: '5',
      container_id: 'tradingview_chart',
      datafeed: this.createCustomDataFeed(), // Custom data feed only
      library_path: '/assets/charting_library/',
      locale: 'en',
      width: '100%',
      height: 500,
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      toolbar_bg: '#f1f3f6',
      disabled_features: ['symbol_search', 'use_localstorage_for_settings', 'header_saveload'],
      enabled_features: ['hide_left_toolbar_by_default'],
      overrides: {
        'mainSeriesProperties.candleStyle.upColor': '#00B746',
        'mainSeriesProperties.candleStyle.downColor': '#EF403C',
      }
    });
  }

  createCustomDataFeed() {
    return {
      onReady: (callback: any) => {
        callback({ supported_resolutions: ['1', '5', '15', '30', '60', 'D'] });
      },
      resolveSymbol: (symbolName: any, onSymbolResolvedCallback: any) => {
        const symbolInfo = {
          ticker: 'Custom Data',
          name: 'Custom Data',
          type: 'stock',
          session: '24x7',
          timezone: 'Etc/UTC',
          minmov: 1,
          pricescale: 100,
          has_intraday: true,
          has_no_volume: false,
          supported_resolutions: ['1', '5', '15', '30', '60', 'D'],
        };
        onSymbolResolvedCallback(symbolInfo);
      },
      getBars: (symbolInfo: any, resolution: any, from: any, to: any, onHistoryCallback: any, onErrorCallback: any) => {
        // Return no data to prevent any historical loading
        onHistoryCallback([], { noData: true });
      },
      subscribeBars: (symbolInfo: any, resolution: any, onRealtimeCallback: any) => {
        // Subscribe to the market data updates from the backend
        this.subscription = this.marketDataService.getMarketDataUpdates().subscribe(marketData => {
          onRealtimeCallback({
            time: new Date(marketData.timestamp).getTime(),
            open: marketData.open,
            high: marketData.high,
            low: marketData.low,
            close: marketData.close,
            volume: marketData.volume,
          });
        });
      },
      unsubscribeBars: () => {
        // Unsubscribe when the component is destroyed
        this.subscription?.unsubscribe();
      }
    };
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
