import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Simulate login validation
    if (email && password) {
      const name = email.split('@')[0];
      setUser({ 
        email, 
        name: name.charAt(0).toUpperCase() + name.slice(1) 
      });
      return true;
    }
    return false;
  };

  const loginWithGoogle = () => {
    console.log('Google Sign-In clicked - Demo mode');
    setUser({
      email: 'demo@foundrytrack.com',
      name: 'Demo User'
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        loginWithGoogle, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}