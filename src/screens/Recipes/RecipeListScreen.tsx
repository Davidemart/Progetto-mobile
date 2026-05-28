import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRecipeStore } from '../../store/useRecipeStore';
import { usePantryStore } from '../../store/usePantryStore';
import { theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Recipe } from '../../types';

export const RecipeListScreen = () => {
  const recipes = useRecipeStore(state => state.recipes);
  const pantryItems = usePantryStore(state => state.pantryItems);
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestCookable, setSuggestCookable] = useState(false);

  // FEATURE AVANZATA: Suggerimento ricette
  const isCookable = (recipe: Recipe) => {
    return recipe.ingredients.every(ing => {
      const pantryItem = pantryItems.find(p => p.name.toLowerCase() === ing.name.toLowerCase() && p.unit === ing.unit);
      return pantryItem && pantryItem.quantity >= ing.quantity;
    });
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (suggestCookable) {
      return matchesSearch && isCookable(recipe);
    }
    return matchesSearch;
  });

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      ) : (
        <View style={styles.recipeImagePlaceholder}>
          <Ionicons name="restaurant" size={40} color={theme.colors.textSecondary} />
        </View>
      )}
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.recipeCategory}>{item.category}</Text>
        <View style={styles.recipeMeta}>
          <View style={styles.metaBadge}>
            <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>{item.prepTime} min</Text>
          </View>
          <View style={styles.metaBadge}>
            <Ionicons name="bar-chart-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>{item.difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cerca per nome o categoria..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.textSecondary}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.suggestButton, suggestCookable && styles.suggestButtonActive]}
        onPress={() => setSuggestCookable(!suggestCookable)}
      >
        <Ionicons name="sparkles" size={20} color={suggestCookable ? theme.colors.surface : theme.colors.secondary} />
        <Text style={[styles.suggestButtonText, suggestCookable && styles.suggestButtonTextActive]}>
          Cosa posso cucinare oggi?
        </Text>
      </TouchableOpacity>

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>Nessuna ricetta trovata.</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditRecipe')}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    height: 48,
    ...theme.shadows.card,
  },
  searchIcon: {
    marginRight: theme.spacing.s,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  suggestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  suggestButtonActive: {
    backgroundColor: theme.colors.secondary,
  },
  suggestButtonText: {
    marginLeft: theme.spacing.s,
    fontWeight: 'bold',
    color: theme.colors.secondary,
    fontSize: 14,
  },
  suggestButtonTextActive: {
    color: theme.colors.surface,
  },
  listContainer: {
    padding: theme.spacing.m,
    paddingTop: 0,
    paddingBottom: 80, // for FAB
  },
  recipeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.m,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  recipeImagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeInfo: {
    padding: theme.spacing.m,
  },
  recipeName: {
    ...theme.typography.h2,
    fontSize: 20,
    marginBottom: theme.spacing.xs,
  },
  recipeCategory: {
    ...theme.typography.label,
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.m,
    marginRight: theme.spacing.m,
  },
  metaText: {
    ...theme.typography.bodySmall,
    marginLeft: 4,
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
    elevation: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.m,
  }
});
