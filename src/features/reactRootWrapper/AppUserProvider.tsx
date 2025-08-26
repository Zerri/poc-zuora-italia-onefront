// src/features/reactRootWrapper/AppUserProvider.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useCurrentUser, UserData } from '../../hooks/useCurrentUser';
import { VaporThemeProvider, CircularProgress, Box, Typography, Button } from "@vapor/v3-components";

interface UserContextType {
  user: UserData;
}

const UserContext = createContext<UserContextType | null>(null);

interface AppUserProviderProps {
  children: ReactNode;
}

export const AppUserProvider: React.FC<AppUserProviderProps> = ({ children }) => {
  const { data: user, isLoading, error } = useCurrentUser();
  
  // Mostra loading mentre carica /me
  if (isLoading) {
    return (
      <VaporThemeProvider>
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          height="100vh"
          gap={2}
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Caricamento dati utente...
          </Typography>
        </Box>
      </VaporThemeProvider>
    );
  }
  
  // Se errore, mostra componente errore fisso (niente more re-mount)
  if (error) {
    console.error('Failed to fetch user data:', error);
    return (
      <VaporThemeProvider>
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          height="100vh"
          gap={3}
        >
          <Typography variant="h4">Errore di Autenticazione</Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" maxWidth={400}>
            Non è possibile accedere alle tue informazioni utente. 
            Errore: {error.message}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Ricarica Pagina
          </Button>
        </Box>
      </VaporThemeProvider>
    );
  }
  
  // Se no user dopo loading, non renderizzare
  if (!user) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within AppUserProvider');
  }
  return context;
};