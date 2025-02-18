export interface PlaidAccount {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
    balances: {
      available: number;
      current: number;
      iso_currency_code: string;
    };
  }
  
  export interface PlaidInstitution {
    name: string;
    institution_id: string;
  }
  
  export interface ConnectionStatus {
    connected: boolean;
    institution?: PlaidInstitution;
    accounts?: PlaidAccount[];
  }