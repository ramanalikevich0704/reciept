import { create } from "zustand";
import getTokenRepository from "@/src/auth/services/getTokenRepository";
import saveTokenRepository from "@/src/auth/services/saveTokenRepository";
import deleteTokenRepository from "@/src/auth/services/deleteTokenRepository";

interface AuthState {
  user: any | null;
  isInitialized: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,

  initialize: async () => {
    const token = await getTokenRepository('api-key');
    set({ user: token ? { token } : null, isInitialized: true });
  },

  login: async (token: string) => {
    await saveTokenRepository(token)
    set({ user: { token } });
  },

  logout: async () => {
    await deleteTokenRepository();
    set({ user: null });
  },
}))
export { useAuthStore };
