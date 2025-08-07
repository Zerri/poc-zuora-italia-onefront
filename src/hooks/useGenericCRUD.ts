// src/hooks/useGenericCRUD.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetch } from "@1f/react-sdk";

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
}

export interface CRUDItem {
  _id?: string | number;
  [key: string]: any;
}

export interface CRUDFilters {
  searchTerm?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function useGenericCRUD<T extends CRUDItem>(
  entityKey: string,
  config: CRUDConfig,
  filters: CRUDFilters
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [entityKey, filters],
    queryFn: async (): Promise<{ items: T[]; pagination?: PaginationInfo }> => {
      
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'All') {
          params.append(key, String(value));
        }
      });

      const url = `${config.endpoints.list}?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch ${entityKey}`);
      }

      const data = await response.json();

      let items: T[] = [];
      let pagination: PaginationInfo | undefined = undefined;

      // Caso 1: risposta è un array (no paginazione)
      if (Array.isArray(data)) {
        items = data;
        pagination = undefined; // oppure puoi costruirne uno fittizio se serve coerenza
      }
      // Caso 2: risposta è un oggetto (con o senza paginazione)
      else {
        items = data.items || [];
        if (data.pagination) {
          pagination = data.pagination;
        } else {
          // fallback se vuoi che la struttura sia sempre consistente
          pagination = {
            total: items.length,
            page: 1,
            limit: items.length,
            pages: 1,
            hasNext: false,
            hasPrev: false
          };
        }
      }

      return { items, pagination };
    },
    staleTime: 5 * 60 * 1000,
    retry: 3
  });

  const createMutation = useMutation({
    mutationFn: async (itemData: CRUDItem) => {
      const dataToSend = {
        ...itemData,
        registrationDate: itemData.registrationDate || new Date().toISOString(),
        lastAccess: itemData.lastAccess || null
      };

      const response = await fetch(config.endpoints.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (itemData: CRUDItem) => {
      if (!itemData.id) {
        throw new Error(`ID required for updating ${entityKey}`);
      }

      const response = await fetch(config.endpoints.update(String(itemData.id)), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(config.endpoints.delete(itemId), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey] });
    }
  });

  return {
    items: query.data?.items || [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    error: query.error,
    createItem: createMutation,
    updateItem: updateMutation,
    deleteItem: deleteMutation,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    refreshItems: () => query.refetch(),
    invalidateCache: () => queryClient.invalidateQueries({ queryKey: [entityKey] }),
    createSuccess: createMutation.isSuccess,
    updateSuccess: updateMutation.isSuccess,
    deleteSuccess: deleteMutation.isSuccess,
  };
}
