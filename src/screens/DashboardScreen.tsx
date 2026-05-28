import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRecipeStore } from '../store/useRecipeStore';
import { usePantryStore } from '../store/usePantryStore';
import { useMealPlanStore } from '../store/useMealPlanStore';
import { theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const startOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = domenica
  const diff = day === 0 ? -6 : 1 - day; // lunedì come inizio settimana
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfWeek = (date: Date) => {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const DashboardScreen = () => {
  const recipes = useRecipeStore(state => state.recipes);
  const pantryItems = usePantryStore(state => state.pantryItems);
  const plannedMeals = useMealPlanStore(state => state.plannedMeals);
  const navigation = useNavigation<any>();

  const totalRecipes = recipes.length;
  const todayISO = new Date().toISOString().split('T')[0];
  const todaysMeals = plannedMeals.filter(m => m.date === todayISO);

  const weeklyMealsCount = useMemo(() => {
    const now = new Date();
    const start = startOfWeek(now);
    const end = endOfWeek(now);
    return plannedMeals.filter(m => {
      const d = new Date(m.date);
      return d >= start && d <= end;
    }).length;
  }, [plannedMeals]);

  const expiringItems = useMemo(() => {
    const now = new Date();
    return pantryItems.filter(item => {
      if (!item.expirationDate) return false;
      const expDate = new Date(item.expirationDate);
      const daysDiff = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return daysDiff <= 7;
    });
  }, [pantryItems]);

  // Tempo medio di preparazione
  const avgPrepTime = useMemo(() => {
    if (recipes.length === 0) return 0;
    return Math.round(recipes.reduce((s, r) => s + r.prepTime, 0) / recipes.length);
  }, [recipes]);

  // Categoria di ricette più frequente
  const topCategory = useMemo(() => {
    if (recipes.length === 0) return null;
    const counts: Record<string, number> = {};
    recipes.forEach(r => { counts[r.category] = (counts[r.category] || 0) + 1; });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return entries[0];
  }, [recipes]);

  // Ingredienti più usati nelle ricette
  const topIngredients = useMemo(() => {
    const counts: Record<string, number> = {};
    recipes.forEach(r => r.ingredients.forEach(ing => {
      const key = ing.name.charAt(0).toUpperCase() + ing.name.slice(1).toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [recipes]);

  // Prodotti mancanti rispetto alle ricette pianificate (settimana corrente)
  const missingForPlan = useMemo(() => {
    const now = new Date();
    const start = startOfWeek(now);
    const end = endOfWeek(now);
    const weekMeals = plannedMeals.filter(m => {
      const d = new Date(m.date);
      return d >= start && d <= end;
    });

    const required: Record<string, { qty: number; unit: string }> = {};
    weekMeals.forEach(meal => {
      const recipe = recipes.find(r => r.id === meal.recipeId);
      if (!recipe) return;
      recipe.ingredients.forEach(ing => {
        const key = `${ing.name.toLowerCase()}_${ing.unit}`;
        if (required[key]) required[key].qty += ing.quantity;
        else required[key] = { qty: ing.quantity, unit: ing.unit };
      });
    });

    pantryItems.forEach(item => {
      const key = `${item.name.toLowerCase()}_${item.unit}`;
      if (required[key]) {
        required[key].qty -= item.quantity;
        if (required[key].qty <= 0) delete required[key];
      }
    });

    return Object.entries(required).map(([key, val]) => ({
      name: key.split('_')[0].replace(/^./, c => c.toUpperCase()),
      qty: val.qty,
      unit: val.unit,
    }));
  }, [plannedMeals, recipes, pantryItems]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      <View style={styles.headerContainer}>
        <Text style={theme.typography.h1}>Ciao!{'\n'}Ecco il tuo riepilogo.</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.primaryLight }]}>
          <Ionicons name="book" size={24} color={theme.colors.primaryDark} />
          <Text style={styles.statValue}>{totalRecipes}</Text>
          <Text style={styles.statLabel}>Ricette</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF9C4' }]}>
          <Ionicons name="calendar" size={24} color="#F57F17" />
          <Text style={[styles.statValue, { color: '#F57F17' }]}>{weeklyMealsCount}</Text>
          <Text style={styles.statLabel}>Pasti Settimana</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFCCBC' }]}>
          <Ionicons name="alert-circle" size={24} color="#D84315" />
          <Text style={[styles.statValue, { color: '#D84315' }]}>{expiringItems.length}</Text>
          <Text style={styles.statLabel}>In Scadenza</Text>
        </View>
      </View>

      {/* Secondary stats */}
      <View style={styles.miniStatsRow}>
        <View style={styles.miniStatCard}>
          <Ionicons name="time-outline" size={18} color={theme.colors.primary} />
          <View>
            <Text style={styles.miniStatLabel}>Tempo medio</Text>
            <Text style={styles.miniStatValue}>{avgPrepTime} min</Text>
          </View>
        </View>
        <View style={styles.miniStatCard}>
          <Ionicons name="pricetag-outline" size={18} color={theme.colors.secondary} />
          <View>
            <Text style={styles.miniStatLabel}>Categoria top</Text>
            <Text style={styles.miniStatValue}>{topCategory ? `${topCategory[0]} (${topCategory[1]})` : '—'}</Text>
          </View>
        </View>
      </View>

      {/* Today's Meals Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={theme.typography.h2}>Pasti di Oggi</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Meal Plan')}>
            <Text style={styles.linkText}>Vedi tutti</Text>
          </TouchableOpacity>
        </View>

        {todaysMeals.length > 0 ? (
          todaysMeals.map(meal => {
            const recipe = recipes.find(r => r.id === meal.recipeId);
            return (
              <TouchableOpacity
                key={meal.id}
                style={styles.mealCard}
                onPress={() => {
                  if (recipe) {
                    navigation.navigate('Ricette', { screen: 'RecipeDetail', params: { id: recipe.id } });
                  } else {
                    navigation.navigate('Meal Plan');
                  }
                }}
              >
                <View style={styles.mealInfo}>
                  <Text style={styles.mealType}>{meal.mealType}</Text>
                  <Text style={styles.mealRecipeName}>{recipe?.name || 'Ricetta rimossa'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={theme.typography.bodySmall}>Nessun pasto pianificato per oggi.</Text>
          </View>
        )}
      </View>

      {/* Ingredienti più usati */}
      {topIngredients.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={theme.typography.h2}>Ingredienti più usati</Text>
          <View style={styles.ingChipRow}>
            {topIngredients.map(([name, count]) => (
              <View key={name} style={styles.ingChip}>
                <Text style={styles.ingChipText}>{name}</Text>
                <Text style={styles.ingChipCount}>×{count}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Prodotti mancanti per il meal plan */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={theme.typography.h2}>Mancano per il Piano</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Spesa')}>
            <Text style={styles.linkText}>Lista spesa</Text>
          </TouchableOpacity>
        </View>
        {missingForPlan.length > 0 ? (
          missingForPlan.slice(0, 5).map((m, idx) => (
            <View key={`${m.name}-${idx}`} style={styles.missingRow}>
              <Ionicons name="close-circle" size={18} color={theme.colors.error} />
              <Text style={styles.missingName}>{m.name}</Text>
              <Text style={styles.missingQty}>{m.qty} {m.unit}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={theme.typography.bodySmall}>Hai tutto il necessario per i pasti di questa settimana.</Text>
          </View>
        )}
      </View>

      {/* Expiring Soon Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={theme.typography.h2}>Prodotti in Scadenza</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Dispensa')}>
            <Text style={styles.linkText}>Vai a Dispensa</Text>
          </TouchableOpacity>
        </View>

        {expiringItems.length > 0 ? (
          expiringItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.pantryCard}
              onPress={() => navigation.navigate('Dispensa', { screen: 'AddEditPantry', params: { id: item.id } })}
            >
              <View style={styles.pantryIconContainer}>
                <Ionicons name="basket" size={20} color={theme.colors.error} />
              </View>
              <View style={styles.pantryInfo}>
                <Text style={styles.pantryName}>{item.name}</Text>
                <Text style={styles.pantryExp}>Scade: {item.expirationDate}</Text>
              </View>
              <Text style={styles.pantryQty}>{item.quantity} {item.unit}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={theme.typography.bodySmall}>Nessun prodotto in scadenza a breve.</Text>
          </View>
        )}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.m,
  },
  headerContainer: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  statCard: {
    flex: 1,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
    marginVertical: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  miniStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.card,
    gap: theme.spacing.s,
  },
  miniStatLabel: {
    ...theme.typography.label,
    fontSize: 10,
  },
  miniStatValue: {
    ...theme.typography.h3,
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  mealCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
    ...theme.shadows.card,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    ...theme.typography.label,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  mealRecipeName: {
    ...theme.typography.h3,
    fontSize: 16,
  },
  emptyState: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ingChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  ingChipText: {
    fontWeight: '600',
    color: theme.colors.primaryDark,
  },
  ingChipCount: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
  },
  missingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.s,
    marginBottom: 6,
    gap: theme.spacing.s,
  },
  missingName: {
    flex: 1,
    ...theme.typography.body,
  },
  missingQty: {
    ...theme.typography.bodySmall,
    fontWeight: 'bold',
    color: theme.colors.error,
  },
  pantryCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
    ...theme.shadows.card,
  },
  pantryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  pantryInfo: {
    flex: 1,
  },
  pantryName: {
    ...theme.typography.h3,
    fontSize: 16,
  },
  pantryExp: {
    ...theme.typography.bodySmall,
    color: theme.colors.error,
    marginTop: 2,
  },
  pantryQty: {
    ...theme.typography.h3,
    fontSize: 16,
    color: theme.colors.primary,
  }
});
