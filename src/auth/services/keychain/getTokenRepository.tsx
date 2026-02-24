import * as SecureStore from "expo-secure-store";

export async function getTokenRepository(id: string): Promise<string | null> {
  return await SecureStore.getItemAsync(id);
}
