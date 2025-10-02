import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('carenest_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email && password.length >= 6) {
      const user = {
        id: '1',
        email,
        name: email.split('@')[0]
      };
      setUser(user);
      sessionStorage.setItem('carenest_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email && password.length >= 6 && name) {
      const user = {
        id: '1',
        email,
        name
      };
      setUser(user);
      sessionStorage.setItem('carenest_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const loginAsGuest = async (): Promise<void> => {
    // Simulate brief processing
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Clear all previous session data to ensure fresh state
    sessionStorage.clear();
    
    const guestUser: User = {
      id: 'guest-' + Date.now(),
      email: 'guest@carenest.app',
      name: 'Guest User',
      isGuest: true
    };
    
    setUser(guestUser);
    // Use sessionStorage for guest (data cleared when browser closes)
    sessionStorage.setItem('carenest_user', JSON.stringify(guestUser));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('carenest_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      loginAsGuest,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
