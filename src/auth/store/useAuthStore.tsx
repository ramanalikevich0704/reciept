import { create } from "zustand";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  isInitialized: boolean;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
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
