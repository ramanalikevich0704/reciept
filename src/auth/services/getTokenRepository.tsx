import * as SecureStore from 'expo-secure-store';

export default async function getTokenRepository(token : string): Promise<string | null> {
  let result = await SecureStore.getItemAsync(token);
  if (result) {
    console.log("Ваш токен: ", result);
  } else {
    console.log('Ничего не найдено по этому ключу.');
  }
  return result;
} 