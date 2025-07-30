// src/hooks/useUsersCRUD.ts
import { useGenericCRUD } from './useGenericCRUD';
import type { UserFilters } from '../types/user';
import type { CRUDConfig } from './useGenericCRUD';

/**
 * Configurazione specifica per l'entità User
 */
const USER_CONFIG: CRUDConfig = {
  name: 'users',
  displayName: 'Utenti',
  endpoints: {
    list: 'users',
    create: 'users',
    update: (id: string) => `users/${id}`,
    delete: (id: string) => `users/${id}`,
  },
  permissions: ['admin'],
  searchFields: ['name', 'email'],
};

/**
 * Hook per la gestione degli utenti
 */
export function useUsersCRUD(filters: UserFilters) {
  return useGenericCRUD('users', USER_CONFIG, filters);
}

export { USER_CONFIG };