// src/hooks/useRouteAccess.ts
import { usePermissions } from "./usePermissions";
import { ROUTE_PERMISSIONS } from "../config/routePermissions";

/**
 * Hook per verificare se l'utente ha accesso a una route o a una feature
 */
export const useRouteAccess = () => {
  const perms = usePermissions();

  /**
   * Restituisce true se l'utente ha accesso
   * @param routeOrFeature: string, nome della route ("/user-management") o feature ("aiDrawer")
   */
  const canAccess = (routeOrFeature: string): boolean => {
    // Prima prova a vedere se esiste come route nella mappa centralizzata
    const checkRoute = ROUTE_PERMISSIONS[routeOrFeature];
    if (checkRoute) {
      return checkRoute(perms);
    }

    // Altrimenti verifica come feature flag
    return perms.hasFeature(routeOrFeature);
  };

  return { canAccess };
};
