import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingListItem } from '../types';
import { mockShoppingList } from '../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

interface ShoppingListState {
  shoppingList: ShoppingListItem[];
  addShoppingItem: (item: Omit<ShoppingListItem, 'id'>) => void;
  updateShoppingItem: (id: string, updatedItem: Omit<ShoppingListItem, 'id'>) => void;
  deleteShoppingItem: (id: string) => void;
  toggleBought: (id: string) => void;
  setShoppingList: (items: ShoppingListItem[]) => void;
  resetToMockData: () => void;
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      shoppingList: mockShoppingList,
      addShoppingItem: (itemData) =>
        set((state) => ({
          shoppingList: [...state.shoppingList, { ...itemData, id: uuidv4() }],
        })),
      updateShoppingItem: (id, updatedItem) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((i) =>
            i.id === id ? { ...updatedItem, id } : i
          ),
        })),
      deleteShoppingItem: (id) =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((i) => i.id !== id),
        })),
      toggleBought: (id) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((i) =>
            i.id === id ? { ...i, isBought: !i.isBought } : i
          ),
        })),
      setShoppingList: (items) => set({ shoppingList: items }),
      resetToMockData: () => set({ shoppingList: mockShoppingList }),
    }),
    {
      name: 'shoppinglist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
