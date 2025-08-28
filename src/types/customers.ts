// src/types/customers.ts
import type { BaseEntity, BaseFilters } from './generic';

/**
 * Interfaccia Customer che estende BaseEntity
 * Rappresenta un cliente nel sistema
 */
export interface Customer extends BaseEntity {
  _id: string;
  nome: string;
  settore: string;
  tipo: 'Cliente' | 'Prospect' | 'Lead';
  email: string;
  ultimoContatto: string;
  valore: number;
  valoreAnnuo: string;
  migrabile?: boolean;
  subscriptionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Filtri specifici per la ricerca e filtramento customers
 * Estende BaseFilters con campi specifici
 */
export interface CustomerFilters extends BaseFilters {
  tipo: string;           // 'All' | 'Cliente' | 'Prospect' | 'Lead'
  settore?: string;       // Filtro per settore
  migrabile?: string;     // 'All' | 'true' | 'false'
  minValue?: number;      // Valore minimo
  maxValue?: number;      // Valore massimo
  dateFrom?: string;      // Data inizio per ultimoContatto
  dateTo?: string;        // Data fine per ultimoContatto
}

/**
 * Dati per le mutazioni (create/update)
 */
export interface CustomerMutationData {
  id?: string;
  nome?: string;
  settore?: string;
  tipo?: 'Cliente' | 'Prospect' | 'Lead';
  email?: string;
  ultimoContatto?: string;
  valore?: number;
  valoreAnnuo?: string;
  migrabile?: boolean;
  subscriptionId?: string;
}

/**
 * Statistiche sui customers (per dashboard/reports futuri)
 */
export interface CustomerStats {
  overview: {
    totalCustomers: number;
    totalValue: number;
    avgValue: number;
    clientiCount: number;
    prospectCount: number;
    leadCount: number;
    migrabiliCount: number;
  };
  tipoBreakdown: Array<{
    _id: string;
    count: number;
    totalValue: number;
    avgValue: number;
  }>;
  settoreBreakdown: Array<{
    _id: string;
    count: number;
    totalValue: number;
    avgValue: number;
  }>;
  timestamp: string;
}

/**
 * Opzioni per i select/dropdown
 */
export const CUSTOMER_TYPES = [
  { value: 'All', label: 'Tutti i tipi' },
  { value: 'Cliente', label: 'Cliente' },
  { value: 'Prospect', label: 'Prospect' },
  { value: 'Lead', label: 'Lead' }
] as const;

export const MIGRABILE_OPTIONS = [
  { value: 'All', label: 'Tutti' },
  { value: 'true', label: 'Migrabile' },
  { value: 'false', label: 'Non migrabile' }
] as const;