import * as SecureStore from 'expo-secure-store';

export default async function getTokenRepository(): Promise<string | null> {
  //return await SecureStore.getItemAsync('userToken');
  let result = await SecureStore.getItemAsync('userToken');
  if (result) {
    console.log("Ваш токен: ", result);
    return result;
  } else {
    console.log('Ничего не найдено по этому ключу.');
    return null
  }
} 