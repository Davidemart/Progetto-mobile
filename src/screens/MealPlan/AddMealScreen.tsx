import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMealPlanStore } from '../../store/useMealPlanStore';
import { useRecipeStore } from '../../store/useRecipeStore';
import { theme } from '../../utils/theme';
import { MealType } from '../../types';

export const AddMealScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editingId: string | undefined = route.params?.id;
  const { plannedMeals, addPlannedMeal, updatePlannedMeal } = useMealPlanStore();
  const { recipes } = useRecipeStore();
  const existing = editingId ? plannedMeals.find(m => m.id === editingId) : undefined;

  const [selectedDate, setSelectedDate] = useState<string>(existing?.date ?? new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(existing?.mealType ?? 'Pranzo');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(existing?.recipeId ?? '');

  const mealTypes: MealType[] = ['Colazione', 'Spuntino', 'Pranzo', 'Cena'];

  const getNext7Days = () => {
    const days: string[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    if (existing && !days.includes(existing.date)) {
      days.unshift(existing.date);
    }
    return days;
  };
  const dates = getNext7Days();

  useLayoutEffect(() => {
    navigation.setOptions({ title: editingId ? 'Modifica Pasto' : 'Pianifica Pasto' });
  }, [navigation, editingId]);

  const handleSave = () => {
    if (!selectedRecipeId) {
      Alert.alert('Errore', 'Seleziona una ricetta');
      return;
    }

    const payload = {
      date: selectedDate,
      mealType: selectedMealType,
      recipeId: selectedRecipeId,
    };

    if (editingId) {
      updatePlannedMeal(editingId, payload);
    } else {
      addPlannedMeal(payload);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <Text style={theme.typography.h2}>Quando?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {dates.map(date => {
          const d = new Date(date);
          const isSelected = date === selectedDate;
          return (
            <TouchableOpacity
              key={date}
              style={[styles.dateChip, isSelected && styles.dateChipSelected]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                {d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={[theme.typography.h2, { marginTop: theme.spacing.m }]}>Tipo di Pasto</Text>
      <View style={styles.mealTypeContainer}>
        {mealTypes.map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.typeChip, selectedMealType === type && styles.typeChipSelected]}
            onPress={() => setSelectedMealType(type)}
          >
            <Text style={[styles.typeText, selectedMealType === type && styles.typeTextSelected]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[theme.typography.h2, { marginTop: theme.spacing.m, marginBottom: theme.spacing.s }]}>Cosa mangi?</Text>
      {recipes.length > 0 ? (
        recipes.map(recipe => (
          <TouchableOpacity
            key={recipe.id}
            style={[styles.recipeCard, selectedRecipeId === recipe.id && styles.recipeCardSelected]}
            onPress={() => setSelectedRecipeId(recipe.id)}
          >
            <Text style={[styles.recipeName, selectedRecipeId === recipe.id && styles.recipeNameSelected]}>
              {recipe.name}
            </Text>
            <Text style={styles.recipeMeta}>{recipe.category} • {recipe.prepTime} min</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.emptyText}>Nessuna ricetta disponibile. Aggiungi prima delle ricette.</Text>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{editingId ? 'Aggiorna Pasto' : 'Pianifica Pasto'}</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.m,
  },
  horizontalScroll: {
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  dateChip: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dateText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  dateTextSelected: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.l,
  },
  typeChip: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeChipSelected: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  typeText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  typeTextSelected: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  recipeCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.card,
  },
  recipeCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  recipeName: {
    ...theme.typography.h3,
    fontSize: 16,
  },
  recipeNameSelected: {
    color: theme.colors.primaryDark,
  },
  recipeMeta: {
    ...theme.typography.bodySmall,
    marginTop: 4,
  },
  emptyText: {
    ...theme.typography.bodySmall,
    color: theme.colors.error,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: 40,
  },
  saveButtonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
