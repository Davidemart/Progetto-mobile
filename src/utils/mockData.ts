import { Recipe, PantryItem, PlannedMeal, ShoppingListItem } from '../types';

export const mockRecipes: Recipe[] = [
  {
    id: 'r1',
    name: 'Spaghetti alla Carbonara',
    description: 'Un classico della cucina romana.',
    category: 'Primo',
    prepTime: 20,
    difficulty: 'Facile',
    portions: 2,
    ingredients: [
      { id: 'i1', name: 'Spaghetti', quantity: 200, unit: 'g' },
      { id: 'i2', name: 'Guanciale', quantity: 100, unit: 'g' },
      { id: 'i3', name: 'Pecorino Romano', quantity: 50, unit: 'g' },
      { id: 'i4', name: 'Uova', quantity: 3, unit: 'pz' },
      { id: 'i5', name: 'Pepe Nero', quantity: 1, unit: 'q.b.' },
    ],
    notes: 'Non usare la pancetta!',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'r2',
    name: 'Insalata di Pollo',
    description: 'Leggera e proteica, perfetta per il pranzo.',
    category: 'Secondo',
    prepTime: 15,
    difficulty: 'Facile',
    portions: 1,
    ingredients: [
      { id: 'i6', name: 'Petto di Pollo', quantity: 150, unit: 'g' },
      { id: 'i7', name: 'Insalata Mista', quantity: 100, unit: 'g' },
      { id: 'i8', name: 'Pomodorini', quantity: 10, unit: 'pz' },
      { id: 'i9', name: 'Olio d\'oliva', quantity: 1, unit: 'cucchiaio' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'r3',
    name: 'Pancake all\'Avena',
    description: 'Colazione sana ed energetica.',
    category: 'Colazione',
    prepTime: 10,
    difficulty: 'Facile',
    portions: 1,
    ingredients: [
      { id: 'i10', name: 'Fiocchi d\'Avena', quantity: 50, unit: 'g' },
      { id: 'i11', name: 'Latte', quantity: 100, unit: 'ml' },
      { id: 'i12', name: 'Uova', quantity: 1, unit: 'pz' },
      { id: 'i13', name: 'Miele', quantity: 1, unit: 'cucchiaio' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-384cb1119671?w=800&auto=format&fit=crop&q=60'
  }
];

export const mockPantry: PantryItem[] = [
  { id: 'p1', name: 'Spaghetti', category: 'Generico', quantity: 500, unit: 'g', expirationDate: '2027-01-01' },
  { id: 'p2', name: 'Uova', category: 'Generico', quantity: 6, unit: 'pz', expirationDate: '2026-06-01' },
  { id: 'p3', name: 'Pecorino Romano', category: 'Generico', quantity: 200, unit: 'g', expirationDate: '2026-08-15' },
  { id: 'p4', name: 'Latte', category: 'Colazione', quantity: 1, unit: 'l', expirationDate: '2026-05-25' },
];

export const mockMealPlan: PlannedMeal[] = [
  { id: 'm1', date: new Date().toISOString().split('T')[0], mealType: 'Colazione', recipeId: 'r3' },
  { id: 'm2', date: new Date().toISOString().split('T')[0], mealType: 'Cena', recipeId: 'r1' },
];

export const mockShoppingList: ShoppingListItem[] = [
  { id: 's1', name: 'Guanciale', quantity: 150, unit: 'g', isBought: false, fromMealPlan: true },
  { id: 's2', name: 'Pomodorini', quantity: 1, unit: 'kg', isBought: false },
  { id: 's3', name: 'Petto di Pollo', quantity: 500, unit: 'g', isBought: false },
];
