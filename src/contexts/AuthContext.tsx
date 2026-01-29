import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ===================== SIGNUP =====================
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);

    const res = await fetch('http://localhost/mindguide/signup.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!data.success) {
      setIsLoading(false);
      throw new Error('Signup failed');
    }

    const newUser: User = {
      id: String(data.user.id),
      email: data.user.email,
      name: data.user.name,
    };

    localStorage.setItem('authUser', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
  };

  // ===================== LOGIN =====================
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    const res = await fetch('http://localhost/mindguide/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      setIsLoading(false);
      throw new Error('Login failed');
    }

    const loggedUser: User = {
      id: String(data.user.id),
      email: data.user.email,
      name: data.user.name,
    };

    localStorage.setItem('authUser', JSON.stringify(loggedUser));
    setUser(loggedUser);
    setIsLoading(false);
  };

  // ===================== LOGOUT =====================
  const logout = async () => {
    await fetch('http://localhost/mindguide/logout.php', {
      method: 'POST',
    });

    localStorage.removeItem('authUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
