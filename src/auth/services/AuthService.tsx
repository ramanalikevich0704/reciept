import { RUser } from "@/src/auth/models/RUser";
import signInUserService from "@/src/auth/services/firebase/LoginUserRepository";
import logoutUserService from "@/src/auth/services/firebase/LogoutUserRepository";
import signUpUserService from "@/src/auth/services/firebase/SignUpUserRepository";
import { handleSecureError } from "@/src/auth/services/keychain/SecureErrorHandler";
import { useAuthStore } from "@/src/auth/store/useAuthStore";
import { secureTokenService } from "@/src/auth/services/keychain/SecureTokenService";

interface RAuthService {
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (user: RUser, password: string) => void;
}

const apiKey = "api-key";
const apiToken = "46ec8567d8a3484895afb7d53572aa5c";

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
    logoutUserService.logoutUser().then(() => {
      useAuthStore.getState().cleanUser()
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
};

export const authService: RAuthService = AuthService;
