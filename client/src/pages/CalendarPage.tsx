import { useAuthStore } from '../store/auth';
import { toast } from 'sonner';

export function CalendarPage() {
  const { user, logout } = useAuthStore();
  
  // Show access denied if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-sky-50 to-purple-50">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please log in to access the calendar.</p>
          <a href="/" className="btn-primary">Go to Login</a>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-sky-50 to-purple-50">
      <header className="bg-white shadow-soft border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Party Zala</h1>
              <p className="text-sm text-gray-600">Kids Party Calendar</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Welcome, {user.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center space-x-2"
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 Calendar Coming Soon</h2>
          <p className="text-gray-600 mb-8">Calendar functionality will be added back once authentication is stable.</p>
          
          <div className="card p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Test Successful!</h3>
            <p className="text-gray-600 mb-4">
              You are successfully logged in as <strong>{user.name}</strong>
            </p>
            <p className="text-sm text-gray-500">
              No more infinite loops or CORS errors! 🎉
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
