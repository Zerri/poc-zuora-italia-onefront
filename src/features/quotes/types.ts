// features/quotes/types.ts
// Definizione tipi per preventivi
export type QuoteStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Migration';
export type QuoteType = 'New' | 'Migration' | 'Upgrade';
export type ViewMode = 'cards' | 'grid';

export interface Customer {
  name: string;
  sector: string;
}

export interface Product {
  name: string;
  quantity: number;
  price: number;
  customerPrice?: number;
}

export interface Quote {
  _id: string;
  number: string;
  customer: Customer;
  status: QuoteStatus;
  type: QuoteType;
  createdAt: string;
  value?: number;
  products?: Product[];
  notes?: string;
}

export interface StatusTranslations {
  [key: string]: string;
}

export interface TypeTranslations {
  [key: string]: string;
}

