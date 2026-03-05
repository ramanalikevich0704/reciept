import { secureTokenService } from "../auth/services/keychain/SecureTokenService";


const API_BASE = "https://api.spoonacular.com";
const PAGE_SIZE = 16;

function getApiKey(): string {
  return process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY ?? "";
}

export type RecipeItem = {
  id: number;
  title: string;
  image: string;
  imageType?: string;
};

export type SearchRecipesResponse = {
  offset: number;
  number: number;
  results: RecipeItem[];
  totalResults: number;
};

export async function searchRecipes(
  query: string,
  offset: number = 0
): Promise<SearchRecipesResponse> {
  const apiKey = await secureTokenService.get('api-key')//'46ec8567d8a3484895afb7d53572aa5c'//getApiKey();
  if (!apiKey) {
    console.warn("EXPO_PUBLIC_SPOONACULAR_API_KEY is not set");
    return { offset: 0, number: 0, results: [], totalResults: 0 };
  }
  console.log('request')
  const params = new URLSearchParams({
    apiKey: apiKey,
    number: String(PAGE_SIZE),
    offset: String(offset),
  });
  if (query.trim()) {
    params.set("query", query.trim());
  }
  const url = `${API_BASE}/recipes/complexSearch?${params.toString()}`;
  const res = await fetch(url);
  console.log(res)
  if (!res.ok) {
    throw new Error(`Spoonacular API error: ${res.status}`);
  }
  const data = (await res.json()) as SearchRecipesResponse;
  return data;
}
