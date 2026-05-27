import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlannedMeal } from '../types';
import { mockMealPlan } from '../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

interface MealPlanState {
  plannedMeals: PlannedMeal[];
  addPlannedMeal: (meal: Omit<PlannedMeal, 'id'>) => void;
  updatePlannedMeal: (id: string, updatedMeal: Omit<PlannedMeal, 'id'>) => void;
  deletePlannedMeal: (id: string) => void;
  resetToMockData: () => void;
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set) => ({
      plannedMeals: mockMealPlan,
      addPlannedMeal: (mealData) =>
        set((state) => ({
          plannedMeals: [...state.plannedMeals, { ...mealData, id: uuidv4() }],
        })),
      updatePlannedMeal: (id, updatedMeal) =>
        set((state) => ({
          plannedMeals: state.plannedMeals.map((m) =>
            m.id === id ? { ...updatedMeal, id } : m
          ),
        })),
      deletePlannedMeal: (id) =>
        set((state) => ({
          plannedMeals: state.plannedMeals.filter((m) => m.id !== id),
        })),
      resetToMockData: () => set({ plannedMeals: mockMealPlan }),
    }),
    {
      name: 'mealplan-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
