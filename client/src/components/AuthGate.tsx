// Simple auth - just check sessionStorage
import { Navigate } from 'react-router-dom';
import { simpleAuth } from '../lib/simpleAuth';

interface AuthGateProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGate({ children, requireAuth = true }: AuthGateProps) {
  // Simple auth check - no loading, no API calls, just localStorage
  const isLoggedIn = simpleAuth.isLoggedIn();
  
  // If this route requires auth and user is not logged in, redirect to login
  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  // If this is the login page and user is already logged in, redirect to calendar
  if (!requireAuth && isLoggedIn) {
    return <Navigate to="/calendar" replace />;
  }
  
  return <>{children}</>;
}
