import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LoginDto, RegisterDto, User } from "@/types/auth";
import { AuthService } from "@/services/auth.service";
import { UserService } from "@/services/user.service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
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

  /**
   * Met à jour le profil utilisateur et synchronise l'état global
   */
  const updateUser = async (data: Partial<User>) => {
    try {
      const updatedData = await UserService.updateProfile(data);
      
      setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      throw error;
    }
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
        updateUser,
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};