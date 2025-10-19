import { useAuthStore } from '../store/auth';
import { toast } from 'sonner';
import CalendarLegend from '../components/Calendar/CalendarLegend';
import CalendarResponsive from '../components/Calendar/CalendarResponsive';
import MobileMenu from '../components/ui/MobileMenu';
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14 gap-3">
            {/* Left - App Title + Legend (Desktop) */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-sky-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                {BG.appTitle}
              </h1>
              
              {/* Desktop Inline Legend - Compact */}
              <div className="hidden lg:flex items-center gap-2 overflow-x-auto no-scrollbar">
                <CalendarLegend />
              </div>
            </div>
            
            {/* Right - User + Menu/Logout */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Desktop: User name + Logout button */}
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                  {BG.welcome}, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="h-9 px-4 rounded-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold text-sm shadow-md active:scale-95 transition-all focus-ring"
                >
                  {BG.logout}
                </button>
              </div>
              
              {/* Mobile: Hamburger Menu */}
              <div className="sm:hidden">
                <MobileMenu userName={user.name} onLogout={handleLogout} />
              </div>
            </div>
          </div>
          
          {/* Mobile/Tablet Legend - Compact row below header */}
          <div className="lg:hidden py-2 border-t border-gray-100">
            <CalendarLegend />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-3 sm:py-6">
        <CalendarResponsive 
          onPartyCreated={handlePartyCreated}
          onPartyDeleted={handlePartyDeleted}
        />
      </main>
    </div>
  );
}
