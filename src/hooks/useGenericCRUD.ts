// src/hooks/useGenericCRUD.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetch } from "@1f/react-sdk";
import type { PaginationInfo, PaginatedResponse, SortInfo } from '../types/generic';

export interface CRUDConfig {
  name: string;
  displayName: string;
  endpoints: {
    list: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };
  permissions: string[];
  searchFields: string[];
  
  // Configurazione sorting
  defaultSort?: SortInfo;               // Ordinamento di default
  sortableFields?: string[];            // Campi ordinabili (se omesso, tutti i campi sono ordinabili)
}

export interface CRUDItem {
  _id?: string | number;
  [key: string]: any;
}

export interface CRUDFilters {
  searchTerm?: string;
  page?: number;
  limit?: number;
  
  // Parametri sorting (già presenti in BaseFilters)
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  
  [key: string]: any;
}

/**
 * Hook CRUD generico con supporto sorting server-side
 */
export function useGenericCRUD<T extends CRUDItem>(
  entityKey: string,
  config: CRUDConfig,
  filters: CRUDFilters
) {
  const queryClient = useQueryClient();

  // Funzione per gestire cambio ordinamento
  const handleSortChange = (sortInfo: SortInfo) => {
    // Verifica se il campo è ordinabile (se specificato nella config)
    if (config.sortableFields && !config.sortableFields.includes(sortInfo.field)) {
      console.warn(`Campo '${sortInfo.field}' non ordinabile per ${entityKey}`);
      return;
    }

    // Invalida la query corrente per forzare il refetch con nuovo ordinamento
    queryClient.invalidateQueries({ queryKey: [entityKey] });
  };

  const query = useQuery({
    queryKey: [entityKey, filters],
    queryFn: async (): Promise<PaginatedResponse<T>> => {
      
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'all') {
          params.append(key, String(value));
        }
      });

      // Se non c'è sortBy ma c'è un default valido, usalo
      if (!filters.sortBy && config.defaultSort && config.defaultSort.field.length > 0) {
        params.append('sortBy', config.defaultSort.field);
        params.append('sortOrder', config.defaultSort.direction);
      }

      const url = `${config.endpoints.list}?${params.toString()}`;
      console.log(`🔍 ${entityKey} request:`, url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch ${entityKey}`);
      }

      const data = await response.json();

      let items: T[] = [];
      let pagination: PaginationInfo | undefined = undefined;
      let sorting: { sortBy: string; sortOrder: 'asc' | 'desc' } | undefined = undefined;

      // Caso 1: risposta è un array (no paginazione)
      if (Array.isArray(data)) {
        items = data;
        pagination = undefined;
      }
      // Caso 2: risposta è un oggetto (con o senza paginazione)
      else {
        items = data.items || [];
        pagination = data.pagination || undefined;
        sorting = data.sorting || undefined; // Info sorting dal server
      }

      // Log sorting info per debug
      if (sorting) {
        console.log(`✅ ${entityKey} ordinato per:`, sorting);
      }

      return { items, pagination, sorting };
    }
  });

  // Mutation per creazione
  const createMutation = useMutation({
    mutationFn: async (newItem: Partial<T>) => {
      const response = await fetch(config.endpoints.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (!response.ok) throw new Error('Failed to create item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey] });
    }
  });

  // Mutation per aggiornamento
  const updateMutation = useMutation({
    mutationFn: async (item: Partial<T> & { id: string | number }) => {
      const response = await fetch(config.endpoints.update(String(item.id)), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!response.ok) throw new Error('Failed to update item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey] });
    }
  });

  // Mutation per eliminazione
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(config.endpoints.delete(id), {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey] });
    }
  });

  return {
    // Data
    items: query.data?.items || [],
    pagination: query.data?.pagination,
    sorting: query.data?.sorting, // Info sorting corrente
    
    // States
    isLoading: query.isLoading,
    error: query.error,
    
    // Sorting handler
    handleSortChange,
    
    // Mutations
    createItem: createMutation,
    updateItem: updateMutation,
    deleteItem: deleteMutation,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}