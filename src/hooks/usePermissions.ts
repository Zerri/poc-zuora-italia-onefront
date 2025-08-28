// src/hooks/usePermissions.ts
import { useUser } from "../features/reactRootWrapper/AppUserProvider";

export const usePermissions = () => {
  const { user } = useUser();

  return {
    // Permessi granulari
    canView: (resource: string) => user?.permissions?.[resource]?.VIEW || false,
    canEdit: (resource: string) => user?.permissions?.[resource]?.EDIT || false,
    canCreate: (resource: string) =>
      user?.permissions?.[resource]?.CREATE || false,
    canDelete: (resource: string) =>
      user?.permissions?.[resource]?.DELETE || false,
    canExport: (resource: string) =>
      user?.permissions?.[resource]?.EXPORT || false,

    // Ruoli
    hasRole: (role: string) => user?.roles?.includes(role) || false,
    isAdmin: () => user?.roles?.includes("ADMIN") || false,

    // Feature flags
    hasFeature: (flag: string) => user?.featureFlags?.[flag] || false,

    // Getter per dati utente comuni
    get userName() {
      return user?.name || "Guest";
    },
    get userId() {
      return user?.id || "";
    },
    get userRoles() {
      return user?.roles || [];
    },
    get userMenu() {
      return user?.menu || [];
    },
  };
};
