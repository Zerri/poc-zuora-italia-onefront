// src/types/grid.ts
import { ReactNode } from 'react';

/**
 * Configurazione di una colonna del DataGrid
 */
export interface ColumnConfig<T = any> {
  field: keyof T;                                    // Campo dell'entità
  headerName: string;                                // Titolo colonna
  width?: number;                                    // Larghezza colonna
  sortable?: boolean;                                // Ordinabile (default: true)
  filterable?: boolean;                              // Filtrabile (default: true)
  renderCell?: (value: any, row: T) => ReactNode;    // Rendering custom della cella
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
 * Configurazione di un'azione su una riga
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
 * Configurazione completa del DataGrid
 */
export interface DataGridConfig<T = any> {
  columns: ColumnConfig<T>[];
  filters: FilterConfig[];
  actions: ActionConfig<T>[];
  title: string;
  description?: string;
  addButtonLabel?: string;
  emptyMessage?: string;
  pageSize?: number;
  // Nuove opzioni per l'header
  showHeader?: boolean;          // Se mostrare l'header del DataGrid
  headerLayout?: 'simple' | 'detailed';  // Tipo di layout header
}