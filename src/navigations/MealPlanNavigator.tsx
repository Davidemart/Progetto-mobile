import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MealPlanScreen } from '../screens/MealPlan/MealPlanScreen';
import { AddMealScreen } from '../screens/MealPlan/AddMealScreen';
import { theme } from '../utils/theme';

const Stack = createNativeStackNavigator();

export const MealPlanNavigator = () => {
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
        name="MealPlanList" 
        component={MealPlanScreen} 
        options={{ title: 'Menu Settimanale' }}
      />
      <Stack.Screen 
        name="AddMeal" 
        component={AddMealScreen} 
        options={{ title: 'Pianifica Pasto' }} 
      />
    </Stack.Navigator>
  );
};
