// src/hooks/useUsersCRUD.ts
import { useGenericCRUD } from './useGenericCRUD';
import type { User, UserFilters } from '../types/user';
import type { CRUDConfig } from './useGenericCRUD';

/**
 * Configurazione specifica per l'entità User con supporto sorting
 */
const USER_CONFIG: CRUDConfig = {
  name: 'users',
  displayName: 'Utenti',
  endpoints: {
    list: `${import.meta.env.VITE_APP_BE}/users`,
    create: `${import.meta.env.VITE_APP_BE}/users`,
    update: (id: string) => `${import.meta.env.VITE_APP_BE}/users/${id}`,
    delete: (id: string) => `${import.meta.env.VITE_APP_BE}/users/${id}`,
  },
  permissions: ['admin'],
  searchFields: ['name', 'email'],
  
  // Configurazione sorting
  defaultSort: {
    field: 'registrationDate',
    direction: 'desc'
  }
};

/**
 * Hook per la gestione degli utenti
 */
export function useUsersCRUD(filters: UserFilters) {
  return useGenericCRUD<User>('users', USER_CONFIG, filters);
}

export { USER_CONFIG };