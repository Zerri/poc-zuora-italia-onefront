// src/features/reactRootWrapper/AppDemoRoleProvider.tsx
import React, { createContext, useContext, ReactNode, useState } from "react";
import { VaporThemeProvider, Box, Typography, Button, CircularProgress } from "@vapor/v3-components";
import { useAuth } from "@1f/react-sdk";

type DemoRole = "ADMIN" | "SALES";

interface DemoRoleContextType {
  demoRole: DemoRole | null;
}

const DemoRoleContext = createContext<DemoRoleContextType | undefined>(undefined);

interface AppDemoRoleProviderProps {
  children: ReactNode;
}

export const AppDemoRoleProvider: React.FC<AppDemoRoleProviderProps> = ({ children }) => {
  const { loading, tokenData } = useAuth();
  const [demoRole, setDemoRole] = useState<DemoRole | null>(null);

  // Se l'auth sta ancora caricando, mostra loading
  if (loading) {
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
            Verifica autenticazione...
          </Typography>
        </Box>
      </VaporThemeProvider>
    );
  }

  // Se non c'è token, il sistema deve gestire l'autenticazione (SSO login)
  // Non mostriamo la selezione ruolo senza token, ma forniamo comunque il context
  if (!tokenData) {
    // Qui l'auth system di OneFront dovrebbe gestire il redirect al login
    // Non blocchiamo, lasciamo che il sistema di auth faccia il suo lavoro
    console.log('🔐 No token found, auth system should handle login redirect');
    
    // IMPORTANTE: Forniamo sempre il context, ma senza forzare ruoli
    return (
      <DemoRoleContext.Provider value={{ demoRole: null }}>
        {children}
      </DemoRoleContext.Provider>
    );
  }

  // Se c'è il token ma modalità demo DISABILITATA → procedi senza selezione ruolo
  if (import.meta.env.VITE_APP_DEMO_ROLE_ENABLED !== "true") {
    return (
      <DemoRoleContext.Provider value={{ demoRole: null }}>
        {children}
      </DemoRoleContext.Provider>
    );
  }

  // Se c'è il token e modalità demo attiva ma nessun ruolo selezionato
  if (!demoRole) {
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
          <Typography variant="h5">Seleziona un ruolo demo</Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Modalità demo attiva. Scegli il ruolo per simulare l'esperienza utente.
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="contained" onClick={() => setDemoRole("ADMIN")}>
              Admin
            </Button>
            <Button variant="outlined" onClick={() => setDemoRole("SALES")}>
              Sales
            </Button>
          </Box>
        </Box>
      </VaporThemeProvider>
    );
  }

  // Passa il contesto ai children (con token verificato)
  return (
    <DemoRoleContext.Provider value={{ demoRole }}>
      {children}
    </DemoRoleContext.Provider>
  );
};

export const useDemoRole = () => {
  const context = useContext(DemoRoleContext);
  if (!context) {
    throw new Error("useDemoRole must be used within AppDemoRoleProvider");
  }
  return context;
};