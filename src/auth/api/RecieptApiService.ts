import { handleSecureError } from "../services/keychain/SecureErrorHandler";
import {
  fetchRecipeInformation,
  fetchSearchRecipes,
  type RecipeInformation,
  type SearchRecipesResponse,
  type RecipeItem,
} from "./RecieptRepository";

export interface RRecieptService {
  searchRecipes: (
    query: string,
    offset?: number,
  ) => Promise<SearchRecipesResponse>;
  getRecipeInformation: (recipeId: number) => Promise<RecipeInformation>;
}

export const useReciept = () => {
  const RecieptService: RRecieptService = {
    searchRecipes(query: string, offset: number = 0) {
      return fetchSearchRecipes(query, offset).catch((error: unknown) => {
        if (error instanceof Error) {
          handleSecureError(
            error.message,
            "Ошибка при загрузке списка рецептов:",
          );
        }
        throw error;
      });
    },
    getRecipeInformation(recipeId: number) {
      return fetchRecipeInformation(recipeId).catch((error: unknown) => {
        if (error instanceof Error) {
          handleSecureError(
            error.message,
            "Ошибка при загрузке информации о рецепте:",
          );
        }
        throw error;
      });
    },
  };

  return { RecieptService };
};

export type {
  RecipeItem,
  SearchRecipesResponse,
  RecipeInformation,
} from "./RecieptRepository";

