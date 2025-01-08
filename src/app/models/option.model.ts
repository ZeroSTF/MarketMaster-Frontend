export interface Option {
    id: number;             // Correspond au Long id en Java
    symbol: string;         // Symbole de l'option (par exemple, 'AAPL')
    type: OptionType;       // Type de l'option (call ou put)
    dateEcheance: string;   // Date d'échéance au format ISO 8601 (par exemple, '2025-12-31T00:00:00')
    premium: number;        // Prime de l'option
    strikePrice: number;    // Prix d'exercice
    status:Optionstatus;
    underlyingPrice: number; // Prix du sous-jacent
  }
  export enum OptionType {
    CALL = 'CALL',
    PUT = 'PUT'
  }
  export enum Optionstatus{
    PENDING = 'PENDING',
    EXPIRED = 'EXPIRED',
    USED = 'USED'
  }