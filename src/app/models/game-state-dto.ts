export interface GameStateDto {
  gameMetadata: {
    id: number;
    title: string;
    description: string;
    creator: string;
    status: string;
    prize: number;
    simulationStartDate: string;
    lastMarketDataTimestamp: string; // Add this field
  };
  gameParticipation: {
    id: number;
    totalPlayTime: string; // Duration in ISO string format
    isActive: boolean;
    lastPauseTimestamp: string;
    lastResumeTimestamp: string;
    username: string;
  };
  gamePortfolio: {
    cash: number;
    holdings: Array<{
      symbol: string;
      quantity: number;
      averageCostBasis: number;
    }>;
    transactions: Array<{
      assetSymbol: string;
      type: string; // e.g. BUY/SELL
      quantity: number;
      price: number;
      timestamp: string; // ISO format
    }>;
  };
}