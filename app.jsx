// src/App.jsx
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers (Integrated from all versions)
import { ExamStoreProvider } from './contexts/ExamStoreContext';
import { SetupProvider } from './contexts/SetupContext';
import { AuthProvider } from './contexts/AuthContext';

// Pages (Comprehensive list from both versions)
import LandingPage from './pages/LandingPage';
import EnhancedSetupWizard from './pages/EnhancedSetupWizard';
import Dashboard from './pages/Dashboard';
import SchedulePage from './pages/SchedulePage';
import TestArena from './pages/TestArena';
import ResourceLibrary from './pages/ResourceLibrary';
import FocusMode from './pages/FocusMode';
import Analytics from './pages/Analytics';
import Community from './pages/Community';
import Settings from './pages/Settings';

// Professional Query Client Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Nexus AI Engine Initialization Sequence
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Professional Loading Screen (Intelligence Layer)
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-gray-800 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl">🤖</div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Nexus AI</h1>
            <p className="text-gray-400">Initializing intelligent study platform...</p>
            <div className="mt-6 flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ExamStoreProvider>
          <SetupProvider>
            <Router>
              <div className="App min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
                <Routes>
                  {/* Comprehensive Route Mapping */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/setup" element={<EnhancedSetupWizard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/schedule" element={<SchedulePage />} />
                  <Route path="/tests" element={<TestArena />} />
                  <Route path="/resources" element={<ResourceLibrary />} />
                  <Route path="/focus" element={<FocusMode />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
                
                {/* Advanced Toaster Configuration */}
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      background: '#1f2937',
                      color: '#fff',
                      border: '1px solid #374151',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </SetupProvider>
        </ExamStoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
