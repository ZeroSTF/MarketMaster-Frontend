export interface PredictedPrice {
  date: string;
  price: number;
}

export interface StockPredictionResponse {
  current_price: number;
  predicted_prices: PredictedPrice[];
  predicted_change: number;
}