import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LoginDto, RegisterDto, User } from "@/types/auth";
import { AuthService } from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await AuthService.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Session expirée", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginDto) => {
    const response = await AuthService.login(data);
    localStorage.setItem("token", response.access_token);
    const userData = await AuthService.getMe();
    setUser(userData);
  };

  const register = async (data: RegisterDto) => {
    const response = await AuthService.register(data);
    localStorage.setItem("token", response.access_token);
    const userData = await AuthService.getMe();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        register, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte facilement
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};