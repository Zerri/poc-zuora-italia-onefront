// src/hooks/useAdminQuotesCRUD.ts
import { useGenericCRUD } from './useGenericCRUD';
import type { AdminQuote, AdminQuoteFilters } from '../types/adminQuote';
import type { CRUDConfig } from './useGenericCRUD';

/**
 * Configurazione specifica per l'entità AdminQuote con supporto sorting
 */
const ADMIN_QUOTE_CONFIG: CRUDConfig = {
  name: 'admin-quotes',
  displayName: 'Preventivi Amministrativi',
  endpoints: {
    list: `${import.meta.env.VITE_APP_BE}/quotes`, // Stesso endpoint, ma con filtri/permessi diversi
    create: `${import.meta.env.VITE_APP_BE}/quotes`,
    update: (id: string) => `${import.meta.env.VITE_APP_BE}/quotes/${id}`,
    delete: (id: string) => `${import.meta.env.VITE_APP_BE}/quotes/${id}`,
  },
  permissions: ['admin'],
  searchFields: ['number', 'customer.name'],
  
  // ✅ CONFIGURAZIONE SORTING
  defaultSort: {
    field: 'createdAt',
    direction: 'desc'
  }
};

/**
 * Hook per la gestione amministrativa dei preventivi con supporto sorting
 */
export function useAdminQuotesCRUD(filters: AdminQuoteFilters) {
  return useGenericCRUD<AdminQuote>('admin-quotes', ADMIN_QUOTE_CONFIG, filters);
}

export { ADMIN_QUOTE_CONFIG };