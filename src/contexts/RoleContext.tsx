// contexts/RoleContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Role } from "../types";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('admin');
  const queryClient = useQueryClient();

  // Effetto per invalidare le query quando cambia il ruolo
  useEffect(() => {
    console.log(`Role changed to: ${role} - invalidating queries`);
    
    // Invalida tutte le query che dipendono dal ruolo
    queryClient.invalidateQueries({ queryKey: ['products'] });
    
    // Se hai altre query che dipendono dal ruolo, aggiungile qui:
    // queryClient.invalidateQueries({ queryKey: ['permissions'] });
    // queryClient.invalidateQueries({ queryKey: ['user-specific-data'] });
    
  }, [role, queryClient]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};