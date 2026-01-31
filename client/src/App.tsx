import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Home } from './pages/Home'; // Login page
import { CalendarPage } from './pages/CalendarPage';
import { AllPartiesPage } from './pages/AllPartiesPage';
import { AuthGate } from './components/AuthGate';
import { useMobileViewport } from './hooks/useMobileViewport';

function App() {
  // Fix 100vh on iOS
  useMobileViewport();
  
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Login page - no auth required */}
          <Route 
            path="/" 
            element={
              <AuthGate requireAuth={false}>
                <Home />
              </AuthGate>
            } 
          />
          {/* Calendar - requires auth */}
          <Route 
            path="/calendar" 
            element={
              <AuthGate requireAuth={true}>
                <CalendarPage />
              </AuthGate>
            } 
          />
          <Route 
            path="/all-parties" 
            element={
              <AuthGate requireAuth={true}>
                <div className="safe-area min-h-[calc(var(--vh,1vh)*100)] bg-gradient-to-b from-slate-50 to-slate-100">
                  <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                    <AllPartiesPage />
                  </main>
                </div>
              </AuthGate>
            } 
          />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
            }
          }}
        />
      </div>
    </Router>
  )
}

export default App
