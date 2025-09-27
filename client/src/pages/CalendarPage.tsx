import { useAuthStore } from '../store/auth';
import { toast } from 'sonner';
import CalendarLegend from '../components/Calendar/CalendarLegend';
import CalendarResponsive from '../components/Calendar/CalendarResponsive';
import { BG } from '../lib/i18n';

export function CalendarPage() {
  const { user, logout } = useAuthStore();

  // AuthGate ensures user is authenticated, so user won't be null here
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Излязохте успешно');
    } catch (error) {
      toast.error('Неуспешен изход');
    }
  };

  const handlePartyCreated = () => {
    // Success message is now shown in the modal
  };

  const handlePartyDeleted = () => {
    // Success message is now shown in the modal
  };

  return (
    <div className="min-h-screen bg-app-bg">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-app-card/60 bg-app-card/80 border-b border-app-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">{BG.appTitle}</h1>
              <p className="text-sm text-gray-600">{BG.appSubtitle}</p>
            </div>
            
            {/* Age Legend in Header */}
            <div className="hidden md:flex items-center space-x-4">
              <CalendarLegend />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{BG.welcome}, {user.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center space-x-2"
              >
                <span>{BG.logout}</span>
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
