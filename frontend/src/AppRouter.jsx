import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/use-auth-store';
import { useEffect, useState } from 'react';
import App from './App';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './components/landing/LandingPage';
import UserProfile from './pages/UserProfile';
import { Toaster } from 'react-hot-toast';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const hasVisitedBefore = localStorage.getItem('codepix-visited');
  
  if (!isAuthenticated && !hasVisitedBefore) {
    return <Navigate to="/welcome" replace />;
  }
  
  return children;
}

// Public Route Component (redirect to home if already authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

// Loading Component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default function AppRouter() {
  const [authInitialized, setAuthInitialized] = useState(false);
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    setAuthInitialized(true);
    return unsubscribe;
  }, [initializeAuth]);

  if (!authInitialized) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Toaster toastOptions={{ className: "toast" }} />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/welcome" 
          element={            <LandingPage 
              onGetStarted={() => {
                localStorage.setItem('codepix-visited', 'true');
                window.location.href = '/';
              }} 
            />
          } 
        />
        
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
