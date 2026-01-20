import { api } from "./api";
import type { User, LoginDto, RegisterDto, AuthResponse } from "@/types/auth";

export const AuthService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    // On peut filtrer avec ?email=...&password=...
    const response = await api.get<User[]>(`/users?email=${data.email}&password=${data.password}`);
    
    if (response.data.length === 0) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const user = response.data[0];
    // (En prod, c'est le Back qui fait ça avec une clé secrète)
    const fakeToken = btoa(JSON.stringify({ id: user.id, email: user.email }));

    return {
      access_token: fakeToken,
      user,
    };
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    // Vérifier si l'email existe déjà
    const check = await api.get<User[]>(`/users?email=${data.email}`);
    if (check.data.length > 0) {
      throw new Error("Cet email est déjà utilisé");
    }

    const response = await api.post<User>("/users", data);
    const user = response.data;

    const fakeToken = btoa(JSON.stringify({ id: user.id, email: user.email }));

    return {
      access_token: fakeToken,
      user,
    };
  },

  //GET ME : On décode le token pour retrouver l'ID et on re-fetch le user
  getMe: async (): Promise<User> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Pas de token");

    try {
      // Décodage du faux token
      const decoded = JSON.parse(atob(token));
      // On vérifie que l'user existe toujours en base
      const response = await api.get<User>(`/users/${decoded.id}`);
      return response.data;
    } catch (error) {
      throw new Error("Token invalide ou utilisateur supprimé");
    }
  },
};