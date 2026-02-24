import { deleteTokenRepository } from "@/src/auth/services/keychain/deleteTokenRepository";
import { getTokenRepository } from "@/src/auth/services/keychain/getTokenRepository";
import { saveTokenRepository } from "@/src/auth/services/keychain/saveTokenRepository";
import { handleSecureError } from "@/src/auth/services/keychain/SecureErrorHandler";

export default interface RSecureTokenService {
    save: (tokenId: string, token: string) => Promise<void>
    get: (tokenId: string) => Promise<string | null>
    delete: (tokenId: string)
}

export const SecureTokenService: RSecureTokenService = {
    save: async (tokenId: string, value: string) => {
        saveTokenRepository(tokenId, value)
        .catch((error) => handleSecureError(error))
    },
    get: function (tokenId: string): Promise<string | null> {
        return getTokenRepository(tokenId)
        .catch((error) => handleSecureError(error))
        // .then((token) => {
        //     if (token) {
        //         console.log("Полученный токен:", token);
        //         return token
        //     }
        // });
    },
    delete: function (tokenId: string) {
        deleteTokenRepository(tokenId)
        .catch((error) => handleSecureError(error))
    }
};

export const secureTokenService: RSecureTokenService = SecureTokenService