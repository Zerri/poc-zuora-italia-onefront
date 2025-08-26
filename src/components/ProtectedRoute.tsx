// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { hasRouteAccess } from '../config/menuConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoute: string;
  fallbackPath?: string;
}

/**
 * Componente per la protezione delle route basata sui permessi utente
 * Usa la configurazione menu esistente per verificare l'accesso
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoute,
  fallbackPath = '/' // Default: redirect alla dashboard
}) => {
  const { userRoles } = usePermissions();

  // Verifica se l'utente ha accesso alla route richiesta
  const hasAccess = hasRouteAccess(userRoles, requiredRoute);

  if (!hasAccess) {
    // Log tentativo di accesso non autorizzato
    console.warn('🚫 Unauthorized route access attempt:', {
      requestedRoute: requiredRoute,
      userRoles: userRoles,
      redirectTo: fallbackPath,
      timestamp: new Date().toISOString()
    });
    
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};