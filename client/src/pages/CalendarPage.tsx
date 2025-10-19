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
    <div className="safe-area min-h-[calc(var(--vh,1vh)*100)] bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200">
        <div className="max-w-screen-md mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            {/* Left - App Title */}
            <div className="flex items-center space-x-2 min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">{BG.appTitle}</h1>
            </div>
            
            {/* Right - User + Logout */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="hidden sm:flex items-center text-sm text-gray-600">
                <span className="truncate max-w-[150px]">{BG.welcome}, {user.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="h-11 px-4 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm shadow-sm active:scale-95 transition focus-ring"
              >
                <span className="hidden sm:inline">{BG.logout}</span>
                <span className="sm:hidden">Изход</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Legend - shows below header on smaller screens */}
          <div className="md:hidden py-2 border-t border-gray-100">
            <CalendarLegend />
          </div>
        </div>
        
        {/* Desktop Legend */}
        <div className="hidden md:block border-t border-gray-100">
          <div className="max-w-screen-md mx-auto px-4 py-2">
            <CalendarLegend />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-screen-md px-3 sm:px-4 py-3 sm:py-6">
        <CalendarResponsive 
          onPartyCreated={handlePartyCreated}
          onPartyDeleted={handlePartyDeleted}
        />
      </main>
    </div>
  );
}
