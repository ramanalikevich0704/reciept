import * as SecureStore from 'expo-secure-store';

export default async function deleteTokenRepository() {
  await SecureStore.deleteItemAsync('api-key');
} 