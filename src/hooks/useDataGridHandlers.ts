// src/hooks/useDataGridHandlers.ts
import { useState, useCallback } from 'react';
import type { SortInfo } from '../types/generic';
import type { SnackbarState } from '../types';

/**
 * Interfaccia base per filtri che supportano paginazione e sorting
 */
interface BaseFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Hook per gestire handlers comuni delle DataGrid
 * Centralizza logica di paginazione, filtri, sorting e snackbar
 */
export function useDataGridHandlers<T extends BaseFilters>(
  filters: T,
  setFilters: React.Dispatch<React.SetStateAction<T>>
) {
  // State per snackbar unificato
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Handler per chiusura snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Handler per mostrare snackbar
  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Handler per il cambio di paginazione
  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    console.log('Pagination changed:', { page: newPage, pageSize: newPageSize });
    
    setFilters(prev => ({
      ...prev,
      page: newPage,
      limit: newPageSize
    }));
  }, [setFilters]);

  // Handler per il cambio filtri (supporta reset paginazione)
  const handleFiltersChange = useCallback((newFilters: T) => {
    console.log('Filters changed:', newFilters);
    
    // Reset paginazione quando cambiano i filtri
    setFilters({
      ...newFilters,
      page: 1,
      limit: filters.limit || 10
    });
  }, [setFilters, filters.limit]);

  // Handler per il cambio ordinamento
  const handleSortChange = useCallback((sortInfo: SortInfo) => {
    console.log('🎯 Sort change requested:', sortInfo);
    
    let newFilters: T;
    
    if (sortInfo.field === "" || !sortInfo.field) {
      // Rimuovi ordinamento completamente
      console.log('✅ Removing sort');
      const { sortBy, sortOrder, ...filtersWithoutSort } = filters;
      newFilters = {
        ...filtersWithoutSort,
        page: 1 // Reset paginazione
      } as T;
    } else {
      // Ordinamento normale
      console.log('🔀 Applying sort');
      newFilters = {
        ...filters,
        sortBy: sortInfo.field,
        sortOrder: sortInfo.direction,
        page: 1
      };
    }
    
    console.log('🔄 New filters with sort:', newFilters);
    setFilters(newFilters);
  }, [filters, setFilters]);

  return {
    // Snackbar state e handlers
    snackbar,
    showSnackbar,
    handleCloseSnackbar,
    
    // DataGrid handlers
    handlePaginationChange,
    handleFiltersChange,
    handleSortChange
  };
}