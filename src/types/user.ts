// src/types/user.ts
import type { BaseEntity, BaseFilters } from './generic';

/**
 * Interfaccia User che estende BaseEntity
 */
export interface User extends BaseEntity {
  // _id è già incluso da BaseEntity
  fullName: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  registrationDate: string;
  lastAccess: string | null;
  avatar?: string | null;
}

/**
 * Filtri specifici per gli utenti
 */
export interface UserFilters extends BaseFilters {
  status?: string;
  role?: string;
  searchTerm: string;
  page?: number;
  limit?: number;
  sortBy?: string;        // 🆕 Opzionale - può non esserci
  sortOrder?: 'asc' | 'desc'; // 🆕 Opzionale
}

/**
 * Dati per la mutazione (creazione/aggiornamento) degli utenti
 */
export interface UserMutationData {
  id?: string | number; // Opzionale per creazione, richiesto per aggiornamento
  fullName: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  registrationDate?: string;
  lastAccess?: string | null;
}