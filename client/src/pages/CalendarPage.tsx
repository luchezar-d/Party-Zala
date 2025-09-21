import { useAuthStore } from '../store/auth';
import { toast } from 'sonner';
import CalendarLegend from '../components/Calendar/CalendarLegend';
import CalendarResponsive from '../components/Calendar/CalendarResponsive';

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

  const handlePartyCreated = () => {
    toast.success('Party created successfully! 🎉');
  };

  const handlePartyDeleted = () => {
    toast.success('Party deleted successfully');
  };

  return (
    <div className="min-h-screen bg-app-bg">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-app-card/60 bg-app-card/80 border-b border-app-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Party Zala</h1>
              <p className="text-sm text-gray-600">Kids Party Calendar</p>
            </div>
            
            {/* Age Legend in Header */}
            <div className="hidden md:flex items-center space-x-4">
              <CalendarLegend />
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
          
          {/* Mobile Legend - shows below header on smaller screens */}
          <div className="md:hidden py-3 border-t">
            <CalendarLegend />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-2 md:px-4 lg:px-6 py-6">
        {/* Responsive Calendar Component */}
        <CalendarResponsive 
          onPartyCreated={handlePartyCreated}
          onPartyDeleted={handlePartyDeleted}
        />
      </main>
    </div>
  );
}
