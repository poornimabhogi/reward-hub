import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  isAdmin: boolean;  // Added this property
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (email: string, password: string): boolean => {
    // In a real app, you'd validate credentials against a backend
    if (email && password.length >= 6) {
      setUser({ 
        email, 
        name: email.split('@')[0],
        isAdmin: email.includes('admin') // Simple example: users with 'admin' in their email are admins
      });
      setIsLoading(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoading(false);
  };

  // Simulate initial auth check
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoading 
    }}>
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