import signUpUserService from "@/src/auth/services/firebase/SignUpUserRepository";
import signInUserService from "@/src/auth/services/firebase/LoginUserRepository";
import { useAuthStore } from "@/src/auth/store/useAuthStore";

export default interface RAuthService {
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    register: (tokenId: string)
}

const logout = useAuthStore((state) => state.logout);

export const AuthService: RAuthService = {
    login: function (email: string, password: string): Promise<void> {
        throw new Error("Function not implemented.");
    },
    logout: function () {
        logout()
    },
    register: function (tokenId: string) {
        signUpUserService.signUpUser
    }
};

export const authService: RAuthService = AuthService