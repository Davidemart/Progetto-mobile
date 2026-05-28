import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PantryListScreen } from '../screens/Pantry/PantryListScreen';
import { theme } from '../utils/theme';

const Stack = createNativeStackNavigator();

export const PantryNavigator = () => {
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
        name="PantryList"
        component={PantryListScreen}
        options={{ title: 'La Mia Dispensa' }}
      />

    </Stack.Navigator>
  );
};