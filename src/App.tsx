import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PatternProvider } from "./contexts/PatternContext";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { Dashboard } from "./components/Dashboard";
import { ScanPattern } from "./components/ScanPattern";
import { PatternList } from "./components/PatternList";
import { MaintenanceLog } from "./components/MaintenanceLog";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} 
      />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/scan" 
        element={
          <ProtectedRoute>
            <ScanPattern />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patterns" 
        element={
          <ProtectedRoute>
            <PatternList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/maintenance" 
        element={
          <ProtectedRoute>
            <MaintenanceLog />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PatternProvider>
            <AppRoutes />
          </PatternProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;