// src/types/grid.ts
import { ReactNode } from 'react';
import type { SortInfo } from './generic';

/**
 * Configurazione di una colonna del DataGrid
 */
export interface ColumnConfig<T = any> {
  flex?: number;                                       // Flex colonna
  field: keyof T;                                     // Campo dell'entità
  headerName: string;                                 // Titolo colonna
  width?: number;                                     // Larghezza colonna
  sortable?: boolean;                                 // Ordinabile (default: true)
  filterable?: boolean;                               // Filtrabile (default: true)
  renderCell?: (value: any, row: T) => ReactNode;     // Rendering custom della cella
  type?: 'string' | 'number' | 'date' | 'boolean' | 'actions';
}

/**
 * Configurazione di un filtro
 */
export interface FilterConfig {
  field: string;                                     // Campo da filtrare
  label: string;                                     // Label del filtro
  type: 'select' | 'search' | 'date' | 'number';     // Tipo di filtro
  options?: { value: string; label: string }[];      // Opzioni per select
  defaultValue?: any;                                // Valore di default
  placeholder?: string;                              // Placeholder per input
}

/**
 * Configurazione di un'azione su una riga singola
 */
export interface ActionConfig<T = any> {
  key: string;                                       // Chiave univoca azione
  label: string;                                     // Label dell'azione
  icon?: any;                                        // Icona FontAwesome
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
  onClick: (item: T) => void;                        // Funzione da eseguire
  visible?: (item: T) => boolean;                    // Mostra/nascondi azione
  disabled?: (item: T) => boolean;                   // Abilita/disabilita azione
}

/**
 * Configurazione di un'azione bulk (su più elementi)
 */
export interface BulkActionConfig<T = any> {
  key: string;                                       // Chiave univoca azione
  label: string;                                     // Label dell'azione
  icon?: any;                                        // Icona FontAwesome
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
  onClick: (items: T[]) => void;                     // Funzione da eseguire con array di items
  requiresSelection: boolean;                        // Se true, necessita almeno 1 item selezionato
  disabled?: (selectedItems: T[]) => boolean;        // Abilita/disabilita in base a selezione
  confirmMessage?: string;                           // Messaggio di conferma opzionale
}

/**
 * Configurazione completa del DataGrid con supporto sorting e bulk actions
 */
export interface DataGridConfig<T = any> {
  getRowId?: (row: T) => string | number;
  columns: ColumnConfig<T>[];
  filters: FilterConfig[];
  actions: ActionConfig<T>[];
  
  // ✨ NUOVO: Supporto azioni bulk
  bulkActions?: BulkActionConfig<T>[];               // Azioni bulk disponibili
  enableMultiSelect?: boolean;                       // Abilita selezione multipla (default: false)
  
  title: string;
  description: string;
  addButtonLabel?: string;
  emptyMessage?: string;
  pageSize?: number;
  
  // Opzioni header e paginazione
  showHeader?: boolean;                              // Se mostrare l'header del DataGrid
  paginationMode?: 'server' | 'client';            // Modalità paginazione (default: 'client')
  pageSizeOptions?: number[];                       // Opzioni per page size (default: [10, 25, 50, 100])
  
  // Configurazione sorting
  sortingMode?: 'server' | 'client';               // Modalità sorting (default: 'client')
  defaultSort?: SortInfo;                           // Ordinamento di default
}