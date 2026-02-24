import * as SecureStore from 'expo-secure-store';

const replaceKey = (key: string) => key.replace(/[^a-zA-Z0-9.\-_]/g, '_');

const SecureFirebaseStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const replacedKey = replaceKey(key);
    return await SecureStore.getItemAsync(replacedKey);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    const replacedKey = replaceKey(key);
    return await SecureStore.setItemAsync(replacedKey, value);
  },
  removeItem: async (key: string): Promise<void> => {
    const replacedKey = replaceKey(key);
    return await SecureStore.deleteItemAsync(replacedKey);
  },
};

export default SecureFirebaseStorage;