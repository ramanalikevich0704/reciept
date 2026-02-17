import * as SecureStore from 'expo-secure-store';

export default async function saveTokenRepository(token: string) {
  try {
    await SecureStore.setItemAsync('api-key', token, { keychainAccessible: SecureStore.WHEN_UNLOCKED})
  } catch (error) {
    console.log("Ошибка сохранения", error);
  }
}