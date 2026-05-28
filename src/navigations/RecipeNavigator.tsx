import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecipeListScreen } from '../screens/Recipes/RecipeListScreen';
import { RecipeDetailScreen } from '../screens/Recipes/RecipeDetailScreen';
import { AddEditRecipeScreen } from '../screens/Recipes/AddEditRecipeScreen';
import { theme } from '../utils/theme';

const Stack = createNativeStackNavigator();

export const RecipeNavigator = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.surface,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="RecipeList" 
        component={RecipeListScreen} 
        options={{ title: 'Le Mie Ricette' }}
      />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Dettaglio' }} />
      <Stack.Screen name="AddEditRecipe" component={AddEditRecipeScreen} options={{ title: 'Nuova Ricetta' }} /> 
    </Stack.Navigator>
  );
}