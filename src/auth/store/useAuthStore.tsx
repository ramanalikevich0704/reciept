import { create } from "zustand";
import { User } from '@firebase/auth';

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  cleanUser: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,

  setUser: (user) => {
    set({ user , isInitialized: true });//зачем все же он надо?
  },
  cleanUser: () => {
    set({ user: null});
  },
}));

export { useAuthStore };
