// src/features/reactRootWrapper/AppDemoRoleProvider.tsx
import React, { createContext, useContext, ReactNode, useState } from "react";
import { VaporThemeProvider, Box, Typography, Button } from "@vapor/v3-components";

type DemoRole = "ADMIN" | "SALES";

interface DemoRoleContextType {
  demoRole: DemoRole | null;
}

const DemoRoleContext = createContext<DemoRoleContextType | undefined>(undefined);

interface AppDemoRoleProviderProps {
  children: ReactNode;
}

export const AppDemoRoleProvider: React.FC<AppDemoRoleProviderProps> = ({ children }) => {
  const [demoRole, setDemoRole] = useState<DemoRole | null>(
    import.meta.env.VITE_APP_DEMO_ROLE_ENABLED === "true" ? null : "SALES" // default "SALES" se disabilitato
  );

  // Step 1: schermata di selezione ruolo
  if (import.meta.env.VITE_APP_DEMO_ROLE_ENABLED === "true" && !demoRole) {
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

  // Step 2: passiamo il contesto ai children
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
