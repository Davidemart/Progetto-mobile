import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecipeListScreen } from '../screens/Recipes/RecipeListScreen';
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
    </Stack.Navigator>
  );
}