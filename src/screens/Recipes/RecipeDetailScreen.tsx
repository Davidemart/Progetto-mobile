import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useRecipeStore } from '../../store/useRecipeStore';
import { theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

export const RecipeDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const recipeId = route.params?.id;
  const { recipes, deleteRecipe } = useRecipeStore();
  
  const recipe = recipes.find(r => r.id === recipeId);

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ricetta non trovata.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Elimina Ricetta",
      "Sei sicuro di voler eliminare questa ricetta?",
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: "Elimina", 
          style: "destructive",
          onPress: () => {
            deleteRecipe(recipe.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={styles.headerImage} />
      ) : (
        <View style={styles.headerImagePlaceholder}>
          <Ionicons name="restaurant" size={60} color={theme.colors.textSecondary} />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{recipe.name}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => navigation.navigate('AddEditRecipe', { id: recipe.id })} style={styles.iconButton}>
              <Ionicons name="pencil" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
              <Ionicons name="trash" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.categoryBadge}>{recipe.category}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={20} color={theme.colors.secondary} />
            <Text style={styles.metaText}>{recipe.prepTime} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={20} color={theme.colors.secondary} />
            <Text style={styles.metaText}>{recipe.portions} porzioni</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="bar-chart-outline" size={20} color={theme.colors.secondary} />
            <Text style={styles.metaText}>{recipe.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.description}>{recipe.description}</Text>

        <View style={styles.section}>
          <Text style={theme.typography.h2}>Ingredienti</Text>
          {recipe.ingredients.map(ing => (
            <View key={ing.id} style={styles.ingredientRow}>
              <Ionicons name="ellipse" size={8} color={theme.colors.primary} style={styles.bullet} />
              <Text style={styles.ingredientName}>{ing.name}</Text>
              <Text style={styles.ingredientAmount}>{ing.quantity} {ing.unit}</Text>
            </View>
          ))}
        </View>

        {recipe.notes && (
          <View style={styles.section}>
            <Text style={theme.typography.h2}>Note Aggiuntive</Text>
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>{recipe.notes}</Text>
            </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...theme.typography.h3,
    color: theme.colors.error,
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  headerImagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    marginTop: -20, // Overlap image
    minHeight: 500,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.s,
  },
  title: {
    ...theme.typography.h1,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.s,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.round,
  },
  categoryBadge: {
    ...theme.typography.label,
    color: theme.colors.surface,
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.l,
    overflow: 'hidden',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.l,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...theme.typography.body,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  description: {
    ...theme.typography.body,
    lineHeight: 24,
    marginBottom: theme.spacing.l,
  },
  section: {
    marginBottom: theme.spacing.l,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  bullet: {
    marginRight: theme.spacing.s,
  },
  ingredientName: {
    ...theme.typography.body,
    flex: 1,
  },
  ingredientAmount: {
    ...theme.typography.body,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
  },
  noteBox: {
    backgroundColor: '#FFF9C4', // light yellow
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginTop: theme.spacing.s,
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D',
  },
  noteText: {
    ...theme.typography.body,
    fontStyle: 'italic',
    color: '#424242',
  }
});
