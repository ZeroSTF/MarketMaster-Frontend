export interface GameStateDto {
    gameMetadata: {
      id: number;
      title: string;
      description: string;
      creator: string;
      status: string;
      prize: number;
      simulationStartDate: string;
    };
    gameParticipation: {
      id:number;
      totalPlayTime: string; // Duration in ISO string format
      isActive: boolean;
      lastPauseTimestamp: string;
      lastResumeTimestamp: string;
      username:string; 
    };
    portfolio: {
      cash: number;
      holdings: Array<{
        assetSymbol: string;
        quantity: number;
        averageCostBasis: number;
      }>;
    };
    transactions: Array<{
      assetSymbol: string;
      type: string; // e.g. BUY/SELL
      quantity: number;
      price: number;
      timestamp: string; // ISO format
    }>;
  }
  