// src/features/user-management/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetch } from "@1f/react-sdk";
import { User, UserFilters, UserMutationData } from '../../../types';

/**
 * Hook personalizzato per gestire le operazioni CRUD sugli utenti
 */
export const useUsers = (filters: UserFilters) => {
  const queryClient = useQueryClient();

  // Query per ottenere gli utenti con filtri
  const {
    data: users,
    isLoading,
    error
  } = useQuery<User[], Error>({
    queryKey: ['users', filters],
    queryFn: async () => {
      // Costruisci l'URL con i parametri di filtro
      const params = new URLSearchParams();
      
      if (filters.status !== 'All') {
        params.append('status', filters.status);
      }
      if (filters.role !== 'All') {
        params.append('role', filters.role);
      }
      if (filters.searchTerm) {
        params.append('search', filters.searchTerm);
      }

      const queryString = params.toString();
      let url = `${import.meta.env.VITE_APP_BE}/users`;
      url = `users`;
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    }
  });

  // Mutation per creare un nuovo utente
  const createUser = useMutation<User, Error, UserMutationData>({
    mutationFn: async (userData) => {
      const response = await fetch(`${import.meta.env.VITE_APP_BE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          registrationDate: new Date().toISOString(),
          lastAccess: null
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalida e ricarica la lista degli utenti
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // Mutation per aggiornare un utente esistente
  const updateUser = useMutation<User, Error, UserMutationData>({
    mutationFn: async (userData) => {
      if (!userData.id) {
        throw new Error('User ID is required for update');
      }

      const response = await fetch(`${import.meta.env.VITE_APP_BE}/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalida e ricarica la lista degli utenti
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // Mutation per eliminare un utente
  const deleteUser = useMutation<void, Error, string>({
    mutationFn: async (userId) => {
      const response = await fetch(`${import.meta.env.VITE_APP_BE}/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
    },
    onSuccess: () => {
      // Invalida e ricarica la lista degli utenti
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  return {
    // Data
    users,
    isLoading,
    error,
    
    // Mutations
    createUser,
    updateUser,
    deleteUser,
    
    // Loading states per le mutations
    isCreating: createUser.isPending,
    isUpdating: updateUser.isPending,
    isDeleting: deleteUser.isPending,
  };
};