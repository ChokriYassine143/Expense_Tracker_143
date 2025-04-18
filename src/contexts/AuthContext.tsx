import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for saved token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user
      axios.get('https://backend-expense-tracker-9lb3.onrender.com/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          if (response.data.user) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('https://backend-expense-tracker-9lb3.onrender.com/api/auth/login', {
        email,
        password,
      });

      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);

      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${response.data.user.name}!`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('https://backend-expense-tracker-9lb3.onrender.com/api/auth/register', {
        email,
        name,
        password,
      });

      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);

      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};