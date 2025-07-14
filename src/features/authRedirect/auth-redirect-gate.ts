import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@1f/react-sdk";

const REDIRECT_KEY = "postLoginRedirect";

export const AuthRedirectGate = ({ children }: { children?: ReactNode }) => {
 const { loading, error, tokenData } = useAuth();

 // DEBUG: Detailed log
 console.log("🔍 AuthRedirectGate render:", {
  loading,
  error,
  tokenData: !!tokenData,
  pathname: window.location.pathname,
  search: window.location.search,
 });

 const [hasRedirected, setHasRedirected] = useState(false);
 const [hasInitialized, setHasInitialized] = useState(false);

 // ALWAYS save the URL when the component mounts
 useEffect(() => {
  const currentPath = window.location.pathname + window.location.search;
  console.log("🔄 Component mounted, current path:", currentPath);

  // If we are not on the homepage, ALWAYS save
  if (window.location.pathname !== "/") {
   console.log("💾 Saving redirect path:", currentPath);
   sessionStorage.setItem(REDIRECT_KEY, currentPath);
   console.log("✅ Saved to sessionStorage");
  } else {
   console.log("🏠 On homepage, not saving");
  }

  setHasInitialized(true);
 }, []); // Only on mount

 // Handle post-login redirect only when auth is ready
 useEffect(() => {
  console.log("🎯 Auth state changed:", { tokenData: !!tokenData, loading, hasRedirected, hasInitialized });

  if (!tokenData || hasRedirected || !hasInitialized || loading) {
   return;
  }

  const redirectPath = sessionStorage.getItem(REDIRECT_KEY);
  console.log("🔓 Token found, checking redirect path:", redirectPath);

  if (!redirectPath || redirectPath === "/") {
   return;
  }

  const currentPath = window.location.pathname + window.location.search;

  // If we are already on the correct page, clean up storage
  if (currentPath === redirectPath) {
   console.log("✅ Already on target page, cleaning up storage");
   sessionStorage.removeItem(REDIRECT_KEY);
   setHasRedirected(true);
   return;
  }

  // Otherwise, perform redirect
  console.log("🚀 Need to redirect to:", redirectPath);
  sessionStorage.removeItem(REDIRECT_KEY);
  setHasRedirected(true);
  window.location.href = redirectPath;
 }, [tokenData, hasRedirected, hasInitialized, loading]);

 // IMPORTANT: Always render children to avoid blocking the app
 return children || null;
};