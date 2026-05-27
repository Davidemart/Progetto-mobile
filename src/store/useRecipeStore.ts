import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types';
import { mockRecipes } from '../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

interface RecipeState {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, updatedRecipe: Omit<Recipe, 'id'>) => void;
  deleteRecipe: (id: string) => void;
  resetToMockData: () => void;
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set) => ({
      recipes: mockRecipes,
      addRecipe: (recipeData) =>
        set((state) => ({
          recipes: [...state.recipes, { ...recipeData, id: uuidv4() }],
        })),
      updateRecipe: (id, updatedRecipe) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...updatedRecipe, id } : r
          ),
        })),
      deleteRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        })),
      resetToMockData: () => set({ recipes: mockRecipes }),
    }),
    {
      name: 'recipe-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
