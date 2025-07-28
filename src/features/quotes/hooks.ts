import { useQuery } from '@tanstack/react-query';
import { fetch } from "@1f/react-sdk";
import { Quote } from './types';

/**
 * Hook per gestire il fetching dei preventivi con filtri
 */
export const useQuotes = (filterStatus: string, searchTerm: string) => {
  return useQuery<Quote[], Error>({ 
    queryKey: ['quotes', filterStatus, searchTerm], 
    queryFn: async () => {
      let url = `${import.meta.env.VITE_APP_BE}/quotes`;
      
      // Costruisci la query string in base ai filtri
      const params = new URLSearchParams();
      if (filterStatus !== 'All') {
        params.append('status', filterStatus);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // Aggiungi i parametri all'URL se presenti
      const queryString = params.toString();
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
};