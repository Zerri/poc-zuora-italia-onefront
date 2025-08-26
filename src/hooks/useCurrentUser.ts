// src/hooks/useCurrentUser.ts
import { useState, useEffect } from 'react';
import { useAuth, fetch } from "@1f/react-sdk";

export interface UserData {
  id: string;
  name: string;
  roles: string[];
  menu: Array<{
    label: string;
    route: string;
    icon: string;
  }>;
  permissions: Record<string, Record<string, boolean>>;
}

export const useCurrentUser = () => {
  const { tokenData } = useAuth();
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tokenData) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_BE}/me`);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const userData = await response.json();
        setData(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [tokenData]);

  return { data, isLoading, error };
};