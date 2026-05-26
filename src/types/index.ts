export type RecipeCategory = 'Colazione' | 'Primo' | 'Secondo' | 'Contorno' | 'Dolce' | 'Spuntino' | 'Bevanda';
export type Difficulty = 'Facile' | 'Media' | 'Difficile';
export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'pz' | 'cucchiaio' | 'cucchiaino' | 'q.b.';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: RecipeCategory;
  prepTime: number; //minuti
  difficulty: Difficulty;
  portions: number;
  ingredients: Ingredient[];
  notes?: string;
  imageUrl?: string;
}

export interface PantryItem {
  id: string;
  name: string;
  category: RecipeCategory | 'Generico';
  quantity: number;
  unit: Unit;
  expirationDate?: string; // ISO Date string
  notes?: string;
}

export type MealType = 'Colazione' | 'Pranzo' | 'Spuntino' | 'Cena';

export interface PlannedMeal {
  id: string;
  date: string; //YYYY-MM-DD
  mealType: MealType;
  recipeId: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  isBought: boolean;
  fromMealPlan?: boolean; //indica se automaticamente generato o no
}
