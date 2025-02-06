import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;  // Added this property
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);  // Added loading state

  const login = (email: string, password: string): boolean => {
    // In a real app, you'd validate credentials against a backend
    if (email && password.length >= 6) {
      setUser({ email, name: email.split('@')[0] });
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
    // Here you would typically check for an existing session
    // For now, we'll just set loading to false after a brief delay
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