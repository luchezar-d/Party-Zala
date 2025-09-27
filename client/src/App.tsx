import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Home } from './pages/Home';
import { CalendarPage } from './pages/CalendarPage';
import { AuthGate } from './components/AuthGate';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route 
            path="/" 
            element={
              <AuthGate requireAuth={false}>
                <Home />
              </AuthGate>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <AuthGate requireAuth={true}>
                <CalendarPage />
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
