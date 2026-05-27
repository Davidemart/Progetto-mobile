import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PantryItem } from '../types';
import { mockPantry } from '../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

interface PantryState {
  pantryItems: PantryItem[];
  addPantryItem: (item: Omit<PantryItem, 'id'>) => void;
  updatePantryItem: (id: string, updatedItem: Omit<PantryItem, 'id'>) => void;
  deletePantryItem: (id: string) => void;
  resetToMockData: () => void;
}

export const usePantryStore = create<PantryState>()(
  persist(
    (set) => ({
      pantryItems: mockPantry,
      addPantryItem: (itemData) => {
        let expDate = itemData.expirationDate;
        
        // Se non viene fornita una data di scadenza, ne stimiamo una
        if (!expDate) {
          const nameLower = itemData.name.toLowerCase();
          const today = new Date();
          let addDays = 14; // Default: 2 settimane
          
          // Logica base per stimare la scadenza
          if (nameLower.includes('latte') || nameLower.includes('uova') || nameLower.includes('carne') || 
              nameLower.includes('pesce') || nameLower.includes('pollo') || nameLower.includes('formaggio') || 
              nameLower.includes('insalata') || nameLower.includes('frutta') || nameLower.includes('verdura') || 
              nameLower.includes('pomodor')) {
            addDays = 5; // Freschi e deperibili
          } else if (nameLower.includes('pasta') || nameLower.includes('riso') || nameLower.includes('farina') || 
                     nameLower.includes('zucchero') || nameLower.includes('sale') || nameLower.includes('caffè') || 
                     nameLower.includes('scatola') || nameLower.includes('secco')) {
            addDays = 365; // Lunga conservazione
          }
          
          today.setDate(today.getDate() + addDays);
          expDate = today.toISOString().split('T')[0];
        }

        set((state) => ({
          pantryItems: [...state.pantryItems, { ...itemData, id: uuidv4(), expirationDate: expDate }],
        }));
      },
      updatePantryItem: (id, updatedItem) =>
        set((state) => ({
          pantryItems: state.pantryItems.map((i) =>
            i.id === id ? { ...updatedItem, id } : i
          ),
        })),
      deletePantryItem: (id) =>
        set((state) => ({
          pantryItems: state.pantryItems.filter((i) => i.id !== id),
        })),
      resetToMockData: () => set({ pantryItems: mockPantry }),
    }),
    {
      name: 'pantry-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
