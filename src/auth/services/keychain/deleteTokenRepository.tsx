import * as SecureStore from "expo-secure-store";

export async function deleteTokenRepository(id: string) {
  await SecureStore.deleteItemAsync(id);
}
