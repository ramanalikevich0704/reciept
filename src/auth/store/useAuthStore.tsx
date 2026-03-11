import { create } from "zustand";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface AuthState {
  readonly user: FirebaseAuthTypes.User | null;
  readonly isInitialized: boolean;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  cleanUser: () => void;
  /** Вход по телефону: результат sendVerificationCode (общий для phone-input и sms-code) */
  confirmation: FirebaseAuthTypes.ConfirmationResult | null;
  setConfirmation: (c: FirebaseAuthTypes.ConfirmationResult | null) => void;
  code: string;
  setCode: (c: string) => void;
  clearPhoneAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,

  setUser: (user) => {
    set({ user, isInitialized: true });
  },
  cleanUser: () => {
    set({ user: null });
  },

  confirmation: null,
  setConfirmation: (confirmation) => set({ confirmation }),
  code: "",
  setCode: (code) => set({ code }),
  clearPhoneAuth: () => set({ confirmation: null, code: "" }),
}));

export { useAuthStore };
