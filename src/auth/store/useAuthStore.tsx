import { deleteTokenRepository } from "@/src/auth/services/keychain/deleteTokenRepository";
import { getTokenRepository } from "@/src/auth/services/keychain/getTokenRepository";
import { saveTokenRepository } from "@/src/auth/services/keychain/saveTokenRepository";
import { create } from "zustand";

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
    const token = await getTokenRepository("api-key");
    set({ user: token ? { token } : null, isInitialized: true });
  },

  login: async (token: string) => {
    await saveTokenRepository(token);
    set({ user: { token } });
  },

  logout: async () => {
    await deleteTokenRepository();
    set({ user: null });
  },
}));
export { useAuthStore };
