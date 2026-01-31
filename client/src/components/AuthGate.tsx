// MVP: Auth disabled - imports commented out but kept for future use
// import { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuthStore } from '../store/auth';

interface AuthGateProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGate({ children }: AuthGateProps) {
  // MVP: Auth disabled for internal use (3-5 users)
  // TODO: Re-enable auth for production with external users
  // Just render children directly without any auth checks
  return <>{children}</>;

  /* COMMENTED OUT FOR MVP - KEEP FOR FUTURE USE
  const { user, loading } = useAuthStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      if (!hasHydrated) {
        try {
          await useAuthStore.getState().hydrate();
        } catch (error) {
          console.error('Hydration failed:', error);
        } finally {
          setHasHydrated(true);
        }
      }
    };
    
    hydrate();
  }, [hasHydrated]);

  // Show loading while we're checking authentication
  if (!hasHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  console.log('AuthGate: Final state', { requireAuth, user: !!user, shouldRedirectToHome: requireAuth && !user, shouldRedirectToCalendar: !requireAuth && user });
  
  if (requireAuth && !user) {
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/calendar" replace />;
  }

  return <>{children}</>;
  */
}
