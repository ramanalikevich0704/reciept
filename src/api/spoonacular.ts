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

// Get Recipe Information response types (Spoonacular docs)
export type ExtendedIngredient = {
  id: number;
  name: string;
  original: string;
  amount: number;
  unit: string;
  image?: string;
};

export type AnalyzedStep = {
  number: number;
  step: string;
  ingredients?: { id: number; name: string; image?: string }[];
  equipment?: { id: number; name: string; image?: string }[];
};

export type AnalyzedInstruction = {
  name: string;
  steps: AnalyzedStep[];
};

export type RecipeInformation = {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  servings: number;
  readyInMinutes: number;
  summary: string;
  instructions: string | null;
  extendedIngredients: ExtendedIngredient[];
  analyzedInstructions: AnalyzedInstruction[];
  // Optional metadata used in UI
  creditsText?: string | null;
  spoonacularScore?: number | null;
};

export async function getRecipeInformation(
  recipeId: number
): Promise<RecipeInformation> {
  const apiKey = await secureTokenService.get("api-key");
  if (!apiKey) {
    throw new Error("API key not configured");
  }
  const params = new URLSearchParams({ apiKey });
  const url = `${API_BASE}/recipes/${recipeId}/information?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Spoonacular API error: ${res.status}`);
  }
  return (await res.json()) as RecipeInformation;
}

export async function searchRecipes(
  query: string,
  offset: number = 0
): Promise<SearchRecipesResponse> {
  const apiKey = await secureTokenService.get('api-key')////getApiKey();
  //второй ключ апи: 34400fd7a6e6482abdecf956c03d41f1
  if (!apiKey) {
    console.warn("EXPO_PUBLIC_SPOONACULAR_API_KEY is not set");
    return { offset: 0, number: 0, results: [], totalResults: 0 };
  }
  console.log('request-----')
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
