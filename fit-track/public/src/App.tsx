import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, Route } from 'wouter';
import { ThemeProvider } from './hooks/use-theme';
import { Toaster } from './components/ui/toaster';

// Pages
import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="fittrack-ui-theme">
        <Router>
          <div className="min-h-screen bg-gradient-main">
            <Route path="/" component={Dashboard} />
            <Route path="*" component={NotFound} />
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;