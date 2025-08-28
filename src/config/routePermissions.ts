// src/config/routePermissions.ts
import { usePermissions } from "../hooks/usePermissions";

/**
 * Mappa delle route e funzione di check accesso
 * Può usare permessi, ruoli e feature flags
 */
export const ROUTE_PERMISSIONS: Record<
  string,
  (p: ReturnType<typeof usePermissions>) => boolean
> = {
  // Admin
  "/admin/users": (p) => p.isAdmin(),
  "/admin/quotes": (p) => p.isAdmin(),

  // // Quotes
  // "/quotes": (p) => p.canView("quotes"),
  // "/quotes/export": (p) => p.canExport("quotes"),

  // // Customers
  // "/customers": (p) => p.canView("customers"),
  // "/customers/edit": (p) => p.canEdit("customers"),

  // // Reports avanzati (permessi + feature flag)
  // "/reports/advanced": (p) =>
  //   p.canView("reports") && p.hasFeature("advancedReporting"),

  // // Dashboard nuova (feature flag)
  // "/dashboard/new": (p) => p.hasFeature("newDashboard"),
};
