// src/types/user.ts
import type { BaseEntity, BaseFilters } from './generic';

/**
 * Interfaccia User che estende BaseEntity
 */
export interface User extends BaseEntity {
  // _id è già incluso da BaseEntity
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  registrationDate: string;
  lastAccess: string | null;
}

/**
 * Filtri specifici per gli utenti
 */
export interface UserFilters extends BaseFilters {
  // searchTerm è già incluso da BaseFilters
  status: string;  // 'All' | 'active' | 'inactive' | 'pending'
  role: string;    // 'All' | 'admin' | 'user' | 'moderator'
}

/**
 * Dati per la mutazione (creazione/aggiornamento) degli utenti
 */
export interface UserMutationData {
  id?: string | number; // Opzionale per creazione, richiesto per aggiornamento
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  registrationDate?: string;
  lastAccess?: string | null;
}