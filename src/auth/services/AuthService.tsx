import { RUser } from "@/src/auth/models/RUser";
import { authInstance, getCurrentUid } from "@/src/auth/services/firebase/FirebaseConfiguration";
import signInUserService from "@/src/auth/services/firebase/LoginUserRepository";
import logoutUserService from "@/src/auth/services/firebase/LogoutUserRepository";
import {
  confirmCode,
  sendVerificationCode,
} from "@/src/auth/services/firebase/SignInWithPhoneNumber";
import signUpUserService from "@/src/auth/services/firebase/SignUpUserRepository";
import updateProfileService, {
  ProfileData,
} from "@/src/auth/services/firebase/UpdateProfileRepository";
import { handleSecureError } from "@/src/auth/services/keychain/SecureErrorHandler";
import { secureTokenService } from "@/src/auth/services/keychain/SecureTokenService";
import { googleSignIn } from "@/src/auth/services/socialNetwork/GoogleSignInRepository";
import { useAuthStore } from "@/src/auth/store/useAuthStore";
import React from "react";

import { useState } from "react";
interface RAuthService {
  login: (email: string, password: string) => void;
  logout: () => Promise<void>;
  register: (user: RUser, password: string) => void;
  updateProfile: (data: ProfileData) => Promise<void>;
  googleIn: () => void;
  signInWithPhoneNumber: (phoneNumber: string) => void;
  confirmCode: (code: string) => void;
}

const apiKey = "api-key";
const apiToken = '8d60b5e64b024d51845f65c9a92e14e3'//"46ec8567d8a3484895afb7d53572aa5c";//'34400fd7a6e6482abdecf956c03d41f1'

export const useAuth = () => {
  const confirmation = useAuthStore((s) => s.confirmation);
  const setConfirmation = useAuthStore((s) => s.setConfirmation);
  const code = useAuthStore((s) => s.code);
  const setCode = useAuthStore((s) => s.setCode);
  const [token, setToken] = React.useState<string>("");
  const [showWebView, setShowWebView] = useState(false);

  const AuthService: RAuthService = {
    login: function (email: string, password: string) {
      signInUserService
        .signInUser(email, password)
        .then(() => {
          secureTokenService.save(apiKey, apiToken);
        }) //stub because don't want to save api key in firebase for only async tokens
        .catch((error) => {
          handleSecureError(error.message, "Ошибка при авторизации:");
        });
    },
    logout: function () {
      return logoutUserService.logoutUser().then(() => {
        useAuthStore.getState().cleanUser();
        secureTokenService.delete(apiKey);
      });
    },
    register: function (user: RUser, password: string) {
      signUpUserService
        .signUpUser(user, password)
        .then(() => {
          secureTokenService.save(apiKey, apiToken);
        })
        .catch((error) =>
          handleSecureError(error.message, "Ошибка при регистрации:"),
        );
    },
    updateProfile: function (data: ProfileData) {
      const uid = getCurrentUid();
      if (!uid) return Promise.reject(new Error("Пользователь не авторизован"));
      return updateProfileService.updateProfile(uid, data).catch((error) => {
        handleSecureError(error.message, "Ошибка при сохранении профиля:");
      });
    },
    googleIn: function (): void {
      googleSignIn()
        .then(() => {
          secureTokenService.save(apiKey, apiToken);
        })
        .catch((error) => {
          handleSecureError(error.message, "Ошибка авторизации через Google:");
        });
    },
    signInWithPhoneNumber: function (phoneNumber: string) {
      return sendVerificationCode(phoneNumber, token)
        .then((confirmation) => {
          setConfirmation(confirmation);
        })
        .catch((error) => {
          handleSecureError(error.message, "Ошибка авторизации через телефон:");
        });
    },
    confirmCode: function (smsCode: string): void {
      confirmCode(smsCode, confirmation)
        .then((isConfirmed) => {
          if (isConfirmed) {
            secureTokenService.save(apiKey, apiToken);
          } else {
            logoutUserService.logoutUser();
            //нужно ли чистить zustand?
          }
        })
        .catch((error) => {
          handleSecureError(error?.message ?? "Ошибка", "Неверный код из SMS");
        });
    },
  };
  return {
    AuthService,
    showWebView,
    token,
    setToken,
    setShowWebView,
    code,
    setCode,
    confirmation,
  };
};