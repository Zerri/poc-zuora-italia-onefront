// src/types/adminQuote.ts
import type { BaseEntity, BaseFilters } from './generic';

/**
 * Interfaccia AdminQuote per la vista amministrativa dei preventivi
 */
export interface AdminQuote extends BaseEntity {
  // Campi base del preventivo
  number: string;
  customer: {
    name: string;
    sector: string;
  };
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Migration';
  type: 'New' | 'Migration' | 'Upgrade';
  value: number;
  createdAt: string;
  notes?: string;
  
  // Campi specifici vista admin
  salesAgent: string;
  validUntil?: string;
  lastActivity: string;
}

/**
 * Filtri per AdminQuotes
 */
export interface AdminQuoteFilters extends BaseFilters {
  status: string;       // 'All' | 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Migration'
  salesAgent: string;   // 'All' | nome agente
  period: string;       // 'All' | 'thisMonth' | 'lastMonth' | 'thisYear'
}

/**
 * Dati per mutazioni AdminQuotes
 */
export interface AdminQuoteMutationData {
  id?: string | number;
  status?: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Migration';
  salesAgent?: string;
  notes?: string;
  lastActivity?: string;
}