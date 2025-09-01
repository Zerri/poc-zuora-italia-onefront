// src/hooks/useCustomersAdminCRUD.ts
import { useGenericCRUD } from './useGenericCRUD';
import type { Customer, CustomerFilters } from '../types/customers';
import type { CRUDConfig } from './useGenericCRUD';

/**
 * Configurazione CRUD per i Customers
 * Definisce endpoints, permessi e comportamenti specifici
 */
const CUSTOMERS_CONFIG: CRUDConfig = {
  endpoints: {
    list: `${import.meta.env.VITE_APP_BE}/customers`,
    create: `${import.meta.env.VITE_APP_BE}/customers`,
    update: (id: string) => `${import.meta.env.VITE_APP_BE}/customers/${id}`,
    delete: (id: string) => `${import.meta.env.VITE_APP_BE}/customers/${id}`,
  },
  permissions: ['admin'], // Solo admin possono gestire customers
  searchFields: ['nome', 'settore', 'email'],
  
  // Configurazione ordinamento
  defaultSort: {
    field: 'ultimoContatto',
    direction: 'desc'
  }
};

/**
 * Hook CRUD specializzato per la gestione amministrativa dei Customers
 * 
 * Fornisce tutte le operazioni CRUD con:
 * - Paginazione automatica
 * - Filtri avanzati (tipo, settore, valore, date)
 * - Ordinamento multi-campo
 * - Gestione errori integrata
 * - Cache automatica con React Query
 * 
 * @param filters - Filtri da applicare alla ricerca
 * @returns Hook con dati, loading states e funzioni CRUD
 */
export function useCustomersAdminCRUD(filters: CustomerFilters) {
  // Utilizza il sistema CRUD generico con la configurazione specifica
  const crudResult = useGenericCRUD<Customer>('customers-admin', CUSTOMERS_CONFIG, filters);
  
  return {
    // Dati e stato
    ...crudResult,
    
    // Funzioni specializzate per customers (se necessarie in futuro)
    // Ad esempio: convertToClient, startMigration, etc.
  };
}

/**
 * Export della configurazione per uso in altri contesti
 * (es. per testing o configurazioni avanzate)
 */
export { CUSTOMERS_CONFIG };