// src/types/generic.ts

/**
 * Interfaccia base per tutte le entità del sistema CRUD
 * Ogni entità deve avere almeno un ID univoco
 */
export interface BaseEntity {
  id: string | number;
  [key: string]: any;
}

/**
 * Interfaccia base per i filtri di ricerca
 * Ogni sistema di filtri deve includere almeno un campo di ricerca
 */
export interface BaseFilters {
  searchTerm: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

/**
 * Informazioni di paginazione dal server
 */
export interface PaginationInfo {
  total: number;     // Numero totale di record
  page: number;      // Pagina corrente (1-based)
  limit: number;     // Numero di elementi per pagina
  pages: number;     // Numero totale di pagine
  hasNext: boolean;  // Ha una pagina successiva
  hasPrev: boolean;  // Ha una pagina precedente
}

/**
 * Risposta paginata dal server
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination?: PaginationInfo;
}

/**
 * Configurazione degli endpoint API per un'entità
 */
export interface CRUDEndpoints {
  list: string;
  create: string;
  update: (id: string) => string;
  delete: (id: string) => string;
}

/**
 * Configurazione completa di un'entità per il sistema CRUD generico
 */
export interface EntityConfig<T extends BaseEntity> {
  name: string;
  displayName: string;
  endpoints: CRUDEndpoints;
  permissions: string[];
  searchFields: (keyof T)[];
}

/**
 * Stato di risposta per le operazioni CRUD
 */
export interface CRUDResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

/**
 * Parametri per le operazioni di mutazione
 */
export interface MutationParams<T> {
  data: Partial<T>;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
}