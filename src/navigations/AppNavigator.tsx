import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

import { DashboardScreen } from '../screens/DashboardScreen';
import { RecipeNavigator } from './RecipeNavigator';
import { PantryNavigator } from './PantryNavigator';
import { MealPlanNavigator } from './MealPlanNavigator';
import { ShoppingListScreen } from '../screens/ShoppingList/ShoppingListScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        id={undefined}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'help';

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Ricette') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Dispensa') {
              iconName = focused ? 'basket' : 'basket-outline';
            } else if (route.name === 'Meal Plan') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Spesa') {
              iconName = focused ? 'cart' : 'cart-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Ricette" component={RecipeNavigator} options={{ headerShown: false }} />
        <Tab.Screen name="Dispensa" component={PantryNavigator} options={{ headerShown: false }} />
        <Tab.Screen name="Meal Plan" component={MealPlanNavigator} options={{ headerShown: false }} />
        <Tab.Screen name="Spesa" component={ShoppingListScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
