import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "favoriteRecipeIds";

async function getFavoriteIds(): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is number => typeof x === "number") : [];
  } catch {
    return [];
  }
}

export async function isFavorite(recipeId: number): Promise<boolean> {
  const ids = await getFavoriteIds();
  return ids.includes(recipeId);
}

export async function addFavoriteId(recipeId: number): Promise<void> {
  const ids = await getFavoriteIds();
  if (ids.includes(recipeId)) return;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, recipeId]));
}

export async function removeFavoriteId(recipeId: number): Promise<void> {
  const ids = await getFavoriteIds();
  const next = ids.filter((id) => id !== recipeId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function toggleFavorite(recipeId: number): Promise<boolean> {
  const ids = await getFavoriteIds();
  const has = ids.includes(recipeId);
  if (has) {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(ids.filter((id) => id !== recipeId))
    );
    return false;
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, recipeId]));
  return true;
}

export { getFavoriteIds };
