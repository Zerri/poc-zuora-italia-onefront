// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { usePermissions } from "../hooks/usePermissions";
import { ROUTE_PERMISSIONS } from "../config/routePermissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoute: string;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoute,
  fallbackPath = "/",
}) => {
  const perms = usePermissions();

  const check = ROUTE_PERMISSIONS[requiredRoute];
  const hasAccess = check ? check(perms) : false;

  if (!hasAccess) {
    console.warn("🚫 Unauthorized route access attempt:", {
      user: perms.userName,
      route: requiredRoute,
      fallback: fallbackPath,
      timestamp: new Date().toISOString(),
    });
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
