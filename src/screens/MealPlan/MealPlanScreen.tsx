import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useMealPlanStore } from '../../store/useMealPlanStore';
import { useRecipeStore } from '../../store/useRecipeStore';
import { theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const MealPlanScreen = () => {
  const { plannedMeals, deletePlannedMeal } = useMealPlanStore();
  const { recipes } = useRecipeStore();
  const navigation = useNavigation<any>();

  // Helper to generate the next 7 days
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const days = getNext7Days();

  const renderMeal = (mealId: string, mealType: string, recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    return (
      <View key={mealId} style={styles.mealCard}>
        <TouchableOpacity
          style={styles.mealInfo}
          onPress={() => {
            if (recipe) {
              navigation.navigate('Ricette', { screen: 'RecipeDetail', params: { id: recipe.id } });
            }
          }}
        >
          <Text style={styles.mealType}>{mealType}</Text>
          <Text style={styles.mealRecipe}>{recipe?.name || 'Ricetta rimossa'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AddMeal', { id: mealId })} style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="pencil" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deletePlannedMeal(mealId)} style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="close-circle" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list}>
        {days.map(day => {
          const mealsForDay = plannedMeals.filter(m => m.date === day);
          const dateObj = new Date(day);
          const dayName = dateObj.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'short' });

          return (
            <View key={day} style={styles.daySection}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{dayName.charAt(0).toUpperCase() + dayName.slice(1)}</Text>
                {day === days[0] && <View style={styles.todayBadge}><Text style={styles.todayText}>Oggi</Text></View>}
              </View>

              {mealsForDay.length > 0 ? (
                mealsForDay.map(m => renderMeal(m.id, m.mealType, m.recipeId))
              ) : (
                <Text style={styles.emptyDayText}>Nessun pasto pianificato.</Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddMeal')}
      >
        <Ionicons name="add" size={24} color={theme.colors.surface} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: theme.spacing.m,
    paddingBottom: 80,
  },
  daySection: {
    marginBottom: theme.spacing.xl,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.xs,
  },
  dayTitle: {
    ...theme.typography.h2,
    color: theme.colors.primaryDark,
  },
  todayBadge: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.s,
    marginLeft: theme.spacing.s,
  },
  todayText: {
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyDayText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
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
  },
  mealRecipe: {
    ...theme.typography.body,
    fontWeight: '600',
    marginTop: 2,
  },
  iconBtn: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.l,
    right: theme.spacing.l,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.card,
  }
});
