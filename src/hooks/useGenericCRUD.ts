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

// ✅ CAMBIATO: id ora è opzionale per supportare creazione
export interface CRUDItem {
  id?: string | number;  // ← Ora opzionale
  [key: string]: any;
}

export interface CRUDFilters {
  searchTerm: string;
  [key: string]: any;
}

export function useGenericCRUD(
  entityKey: string,
  config: CRUDConfig,
  filters: CRUDFilters
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [entityKey, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'All' && value !== '') {
          params.append(key, String(value));
        }
      });

      const queryString = params.toString();
      const url = queryString 
        ? `${config.endpoints.list}?${queryString}` 
        : config.endpoints.list;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch ${entityKey}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 3
  });

  // Mutation per creare - id è opzionale
  const createMutation = useMutation({
    mutationFn: async (itemData: CRUDItem) => {
      // Per la creazione, aggiungiamo automaticamente registrationDate se non presente
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

  // Mutation per aggiornare - id è richiesto
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
    items: query.data || [],
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