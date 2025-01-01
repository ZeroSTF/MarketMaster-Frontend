import { MarketDataStreamDto } from "./market-data-stream.model";

export interface MarketDataResponseDto {
  pastMarketData: MarketDataStreamDto[];
  upcomingMarketData: MarketDataStreamDto[];
}
