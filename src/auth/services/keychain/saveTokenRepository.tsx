import * as SecureStore from "expo-secure-store";

export async function saveTokenRepository(id: string, token: string) {
  await SecureStore.setItemAsync(id, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}
