import { RUser } from "@/src/auth/models/RUser";
import signInUserService from "@/src/auth/services/firebase/LoginUserRepository";
import logoutUserService from "@/src/auth/services/firebase/LogoutUserRepository";
import {
  confirmCode,
  sendVerificationCode,
} from "@/src/auth/services/firebase/SignInWithPhoneNumber";
import signUpUserService from "@/src/auth/services/firebase/SignUpUserRepository";
import { handleSecureError } from "@/src/auth/services/keychain/SecureErrorHandler";
import { secureTokenService } from "@/src/auth/services/keychain/SecureTokenService";
import { googleSignIn } from "@/src/auth/services/socialNetwork/GoogleSignInRepository";
import { useAuthStore } from "@/src/auth/store/useAuthStore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React from "react";

import { useState } from "react";
interface RAuthService {
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (user: RUser, password: string) => void;
  googleIn: () => void;
  signInWithPhoneNumber: (phoneNumber: string) => void;
  confirmCode: () => void;
}

const apiKey = "api-key";
const apiToken = "46ec8567d8a3484895afb7d53572aa5c";

export const useAuth = () => {
  const [confirmation, setConfirmation] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [code, setCode] = useState("");
  const [token, setToken] = React.useState<string>("");
  const [showWebView, setShowWebView] = useState(false);

  const AuthService: RAuthService = {
    login: function (email: string, password: string) {
      // logoutUserService.logoutUser()
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
      logoutUserService.logoutUser().then(() => {
        useAuthStore.getState().cleanUser();
        secureTokenService.delete(apiKey);
      });
    },
    register: function (user: RUser, password: string) {
      signUpUserService
        .signUpUser(user, password)
        .catch((error) =>
          handleSecureError(error.message, "Ошибка при регистрации:"),
        );
    },
    googleIn: function (): void {
      console.log("googleIn flow");
      googleSignIn()
        .then(() => {
          secureTokenService.save(apiKey, apiToken);
        })
        .catch((error) => {
          handleSecureError(error.message, "Ошибка авторизации через Google:");
        });
    },
    signInWithPhoneNumber: function (phoneNumber: string): void {
      // setShowWebView(true);
      console.log("вошел в sendVerificationCode");
      // logoutUserService.logoutUser()
      sendVerificationCode(phoneNumber, token, setConfirmation)
        .then(() => {
          // console.log("вошел в confirmCode");
          confirmCode('111111', confirmation);
        })
        .catch((error) => {
          handleSecureError(error.message, "Ошибка авторизации через телефон:");
          // console.log("Ошибка верификации");
          // console.log(error);
          // console.log(error.code);
        });
    },
    confirmCode: function (): void {
      // console.log("вошел в sendVerificationCode");
      confirmCode(code, confirmation)
        .then((isConfirmed) => {
          // if (!isConfirmed) logoutUserService.logoutUser();
          //добавить навигацию на заполнение профиля или же на главную
        })
        .catch((error) => {
          handleSecureError("Ошибка", "Неверный код из SMS");
          console.log(".catch((error) =>");
        }); // повторяется, вынести
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
  };
};

// export const authService: RAuthService = AuthService;
